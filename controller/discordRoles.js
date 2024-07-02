class DiscordRolesController {
    async syncRole(client, userId, forceNickname = 0) {
        client.logger.info(`[FUNCTION] - SyncRole function used`);
        // Check if user has Linked Discord to account
        let user = await client.xenProvider.fetchDiscordLinkInfoForumUserId(userId)
            .catch(err => {
                client.logger.error(err.stack)
                return { message: `ERROR - Failed to fetch Discord information for user ${userId} from Database` }
            })

        if (user[0]) {
            user = user[0]
        } else return { 
            message: "Can't find members Discord ID in the Database"
        }
    
        if (user) {
            let possibleMessage = await DiscordRolesController.#checkUserGroupIds(client, user)
            if (possibleMessage) return possibleMessage

            let guild = await client.guilds.fetch(client.config.botMainDiscordServer)
                .catch(err => {
                    client.logger.error(err.stack)
                    return { message: `ERROR - Failed to fetch BWC Discord Server from Bot. Please verify correct Server ID in Settings file` }
                })

            let guildUser = guild.members.cache.get(user.discord_user_id)
            if (!guildUser) return { message: `ERROR - Unable to get guild user information for user ${user.user_id}` }

            let guildRoles = await DiscordRolesController.#checkGuildRoles(client, guild)
            if (!guildRoles) return { message: "ERROR - Could not get key guild roles"}

            let bwcRole = guildRoles[0],
                guestRole = guildRoles[1],
                verifyRole = guildRoles[2],
                unsignedRole = guildRoles[3]
            client.logger.debug(bwcRole, guestRole, verifyRole, unsignedRole)

            if (!guildUser.roles.cache.has(bwcRole.firstKey())) {
                client.logger.debug('Attempting to add BWC Role')
                await guildUser.roles.add(bwcRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { message: "ERROR - Failed to add BWC Role" }
                    })
                client.logger.debug('Attempting to remove Guest Role')
                await guildUser.roles.remove(guestRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { message: "ERROR - Failed to remove Guest Role" }
                    })
                client.logger.debug('Attempting to remove Verify Role')
                await guildUser.roles.remove(verifyRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { message: "ERROR - Failed to remove Verify Role" }
                    })
                client.logger.debug('Attempting to remove Unisgned Role')
                await guildUser.roles.remove(unsignedRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { message: "ERROR - Failed to remove Unsigned Role" }
                    })

                // Check if the user is the guild owner. We can't update the Nickname.
                if (forceNickname === 1) {
                    if (guildUser.user.id !== guildUser.guild.ownerId) {
                        // Check if user already has BWC tags in their Nickname.
                        if (!guildUser.roles.cache.has(bwcRole.firstKey()) && guildUser.nickname && guildUser.nickname.includes('[BWC]')) {
                            let new_username = guildUser.nickname.slice(5)
                            await guildUser.setNickname(new_username)
                                .catch(err => {
                                    client.logger.error(err.stack)
                                    return { message: "ERROR - Failed to set Nickname" }
                                })
                            // Check if user already has nickname and set and if it includes [BWC]. If not, add them.
                        } else if (guildUser.roles.cache.has(bwcRole.firstKey()) && (!guildUser.nickname || !guildUser.nickname.includes('[BWC]'))) {
                            // If not BWC tags in name, add them.
                            let user_username = await client.xenProvider.fetchUsername(user.user_id)
                            let new_username = `[BWC] ${user_username[0].username}`
                            await guildUser.setNickname(new_username)
                                .catch(err => {
                                    client.logger.error(err.stack)
                                    return { message: "ERROR - Failed to set Nickname" }
                                })
                        }
                    } else {
                        return { message: "ERROR - Cannot update nickname for guild owner" }
                    }
                }
            }
            return { message: "SUCCESS - Sync'd Discord Permissions" }
        }
        return { message: "ERROR - Can't find members Discord ID in the Database" }
    }

    async giveRole(client, userId, roleId) {
        client.logger.info(`[FUNCTION] - GiveRole function used`);
        let user = await client.xenProvider.fetchDiscordLinkInfoForumUserId(userId)

        if (user[0]) {
            user = user[0]
        } else return { message: "Can't find members Discord ID in the Database" }

        if (user) {
            let possibleMessage = await DiscordRolesController.#checkUserGroupIds(client, user)
            if (possibleMessage) return possibleMessage

            let guild = await client.guilds.fetch(client.config.botMainDiscordServer)

            let role = guild.roles.cache.filter(role => role.id === roleId)
            if (!role) return { message: "Role not found. Contact S-1 for assistance." }

            let guildUser = guild.members.cache.get(user.discord_user_id)
            if (!guildUser.roles.cache.find(r => r === role[0])) {
                await guildUser.roles.add(role)
                return { message: "SUCCESS - Role added" }
            } else {
                return { message: "ERROR - Could not add role" }
            }
        }

        return { message: "Can't find members Discord ID in the Database" }
    }

    async removeRole(client, userId, roleId) {
        client.logger.info(`[FUNCTION] - RemoveRole function used`);
        let user = await client.xenProvider.fetchDiscordLinkInfoForumUserId(userId)

        if (user[0]) {
            user = user[0]
        } else return { message: "Can't find members Discord ID in the Database" }

        if (user) {
            let possibleMessage = await DiscordRolesController.#checkUserGroupIds(client, user)
            if (possibleMessage) return possibleMessage

            let guild = await client.guilds.fetch(client.config.botMainDiscordServer)

            let role = guild.roles.cache.filter(role => role.id === roleId)
            if (!role) return { message: "Role not found. Contact S-1 for assistance." }

            let guildUser = guild.members.cache.get(user.discord_user_id)
            if (!guildUser.roles.cache.find(r => r === role[0])) {
                await guildUser.roles.remove(role)
                return { message: "SUCCESS - Role removed" }
            } else {
                return { message: "ERROR - Could not remove role" }
            }
        }

        return { message: "Can't find members Discord ID in the Database" }
    }

    async fetchAllRoles(client) {
        client.logger.info(`[FUNCTION] - FetchAllRoles function used`);
        const guild = await client.guilds.fetch(client.config.botMainDiscordServer)
        const roles = guild.roles.cache
            .filter(role => role.id !== guild.id)
            .sort((roleA, roleB) => roleB.rawPosition - roleA.rawPosition)
            .map(role => role)

        let formattedRoles = []
        for (let role of roles) {
            formattedRoles.push({ id: role.id, name: role.name })
        }

        return formattedRoles
    }


    async forceSyncUsers(client) {
        client.logger.info(`[FUNCTION] forceSyncUsers function used`);

        const guild = await client.guilds.fetch(client.config.botMainDiscordServer)
        const bwcRole = await client.xenProvider.fetchKeyRole('BWC')
            .catch(err => client.logger.error(err.stack))

        const role = guild.roles.cache
            .filter(role => role.id === bwcRole[0].role_id)
        const members = guild.members.cache
            .filter(user => user._roles.includes(role.first().id))

        const linkedMembers = await client.xenProvider.fetchAllDiscordLinkInfo()
            .catch(err => client.logger.error(err.stack))

        let linkedMembersArray = []
        Object.values(linkedMembers).forEach(user => {
            linkedMembersArray.push(user.discord_user_id)
        })

        let filteredMembers = []
        for (const member of members) {
            if (!linkedMembersArray.includes(member[1].id)){
                filteredMembers.push(member)
            }
        }

        let failedUsers = []

        for (const userArray of filteredMembers) {
            let user = userArray[1]
            let username
            if (user.nickname) {
                username = user.nickname
            } else {
                username = user.user.username
            }
            username = username.replace('[BWC] ', '') // Do not remove the space after [BWC], it will screw up the usernames
            let xenUser = await client.xenProvider.fetchUserByUsername(username)
            if (xenUser.length === 0) {
                failedUsers.push({ username: username, discordId: user.id })
                continue
            }

            try {
                await client.xenProvider.setDiscordLinkInfo(xenUser[0].user_id, user.id, user.user.username, user.user.discriminator)
            } catch (err) {
                client.logger.error(err.stack)
                client.logger.info(`${xenUser[0].user_id} ${user.id} ${user.user.username} ${user.user.discriminator}`)
            }
        }

        client.logger.info(`[ROLES] - [FAILED] Failed users: ${JSON.stringify(failedUsers)}`)
    }

    /**
     * Checks the given user's forum usergroups to verify if the user is an active member
     * @param client
     * @param {object} user
     * @return {promise<{message: string}>}
     */
    static async #checkUserGroupIds(client, user) {
        client.logger.info(`[FUNCTION] - [PRIVATE] checkUserGroupIds function used`);
        let userGroupIds = await client.xenProvider.fetchUserGroupIds(user.user_id)
            .catch(err => {
                client.logger.error(err.stack)
                return { message: `ERROR - Failed to fetch User Group information for user ${userId} from Database` }
            })
        let userGroupIdsArray = Object.values(userGroupIds[0])[0].split(",")
        userGroupIdsArray.push(Object.values(userGroupIds[0])[1].toString())

        if (userGroupIdsArray.includes('8')) return { message: "Member is banned from BWC. If this is in error contact S-1." }
        if (userGroupIdsArray.includes('10')) return { message: "Hol up... Member is marked as departed. Please contact S-1 Immediately!" }
        if (userGroupIdsArray.includes('43')) return { message: "Member is an Ambassador, please contact S-1 to receive Ambassador tags" }
        if (userGroupIdsArray.includes('51')) return { message: "Member is discharged. Cannot give role" }
    }

    /**
     * Checks if the guild has the assigned roles
     * @param client
     * @param {object} guild
     * @return {promise<{message: string}>|array[]}
     */
    static async #checkGuildRoles(client, guild) {
        client.logger.info(`[FUNCTION] - [PRIVATE] checkGuildRoles function used`);
        let keyRoles = await client.xenProvider.fetchAllKeyRoles()
        let keyRolesObject = {}

        Object.values(keyRoles).forEach(role => {
            Object.defineProperty(keyRolesObject, role.name.toLowerCase() ,{
                value: role.role_id,
                writable: false
            })
        })

        let bwcRole = guild.roles.cache.filter(role => role.id === keyRolesObject.bwc)
        if (!bwcRole) return { message: "ERROR - No default BWC role set. Contact S-1 for assistance" }

        let guestRole = guild.roles.cache.filter(role => role.id === keyRolesObject.guest)
        if (!guestRole) return { message: "ERROR - No default Guest role set. Contact S-1 for assistance" }

        let verifyRole = guild.roles.cache.filter(role => role.id === keyRolesObject.verify)
        if (!verifyRole) return { message: "ERROR - No default Verify role set. Contact S-1 for assistance" }

        let unsignedRole = guild.roles.cache.filter(role => role.id === keyRolesObject.unsigned)
        if (!unsignedRole) return { message: "ERROR - No default Unsigned role set. Contact S-1 for assistance" }

        return [bwcRole, guestRole, verifyRole, unsignedRole]
    }
}

module.exports = DiscordRolesController
