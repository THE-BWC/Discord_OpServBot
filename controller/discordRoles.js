// noinspection JSUnresolvedVariable
class DiscordRolesController {
    async syncRole(client, userId) {
        // Check if user has Linked Discord to account
        let user = await client.xenProvider.fetchDiscordLinkInfoForumUserId(userId)
            .catch(err => {
                client.logger.error(err.stack)
                return { ERROR_DiscordLink: `ERROR - Failed to fetch Discord information for user ${userId} from Database` }
            })

        if (user[0]) {
            let userGroupIds = await client.xenProvider.fetchUserGroupIds(user[0].user_id)
                .catch(err => {
                    client.logger.error(err.stack)
                    return { ERROR_FetchUserGroups: `ERROR - Failed to fetch User Group information for user ${userId} from Database` }
                })
            let userGroupIdsArray = Object.values(userGroupIds[0])[0].split(",")
            userGroupIdsArray.push(Object.values(userGroupIds[0])[1].toString())

            if (userGroupIdsArray.includes('8')) return { ERROR_MemberIsBanned: "Member is banned from BWC. If this is in error contact S-1." }
            if (userGroupIdsArray.includes('10')) return { ERROR_MemberIsDeparted: "Hol up... Member is marked as departed. Please contact S-1 Immediately!" }
            if (userGroupIdsArray.includes('43')) return { ERROR_MemberIsAmbassador: "Member is an Ambassador, please contact S-1 to receive Ambassador tags" }
            if (userGroupIdsArray.includes('51')) return { ERROR_MemberIsDischarged: "Member is discharged. Cannot give role" }

            let guild = await client.guilds.fetch(client.config.botMainDiscordServer)
                .catch(err => {
                    client.logger.error(err.stack)
                    return { ERROR_FetchBWCDiscord: `ERROR - Failed to fetch BWC Discord Server from Bot. Please verify correct Server ID in Settings file` }
                })

            let bwcRole = guild.roles.cache.filter(role => role.id === client.config.bwcRole)
            if (!bwcRole) return { ERROR_NoBWCRole: "ERROR - No default BWC role set. Contact S-1 for assistance" }

            let guestRole = guild.roles.cache.filter(role => role.id === client.config.guestRole)
            if (guestRole.size === 0) return { ERROR_NoGuestRole: "ERROR - No default Guest role set. Contact S-1 for assistance" }

            let verifyRole = guild.roles.cache.filter(role => role.id === client.config.verifyRole)
            if (!verifyRole) return { ERROR_NoVerifyRole: "ERROR - No default Verify role set. Contact S-1 for assistance" }

            let unsignedRole = guild.roles.cache.filter(role => role.id === client.config.unsignedRole)
            if (!unsignedRole) return { ERROR_NoUnsignedRole: "ERROR - No default Unsigned role set. Contact S-1 for assistance" }

            let guildUser = guild.members.cache.get(user[0].discord_user_id)
            if (!guildUser) return { ERROR_GuildUserInfo: `ERROR - Unable to get guild user information for user ${user[0].user_id}` }

            if (!guildUser.roles.cache.has(bwcRole.firstKey())) {
                await guildUser.roles.add(bwcRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { ERROR_BWCRoleFailed: "ERROR - Failed to add BWC Role" }
                    })
                await guildUser.roles.remove(guestRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { ERROR_GuestRoleFailed: "ERROR - Failed to remove Guest Role" }

                    })
                await guildUser.roles.remove(verifyRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { ERROR_VerifyRoleFailed: "ERROR - Failed to remove Verify Role" }

                    })
                await guildUser.roles.remove(unsignedRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { ERROR_UnsignedRoleFailed: "ERROR - Failed to remove Unsigned Role" }

                    })

                // Check if the user is the guild owner. We can't update the Nickname.
                if (guildUser.user.id !== guildUser.guild.ownerId) {
                    // Check if user already has BWC tags in their Nickname.
                    if (!guildUser.roles.cache.has(bwcRole.firstKey()) && guildUser.nickname && guildUser.nickname.includes('[BWC]')) {
                        let new_username = guildUser.nickname.slice(5)
                        await guildUser.setNickname(new_username)
                            .catch(err => {
                                client.logger.error(err.stack)
                                return { ERROR_FailedNick: "ERROR - Failed to set Nickname" }
                            })
                        // Check if user already has nickname and set and if it includes [BWC]. If not, add them.
                    } else if (guildUser.roles.cache.has(bwcRole.firstKey()) && (!guildUser.nickname || !guildUser.nickname.includes('[BWC]'))) {
                        // If not BWC tags in name, add them.
                        let user_username = await client.xenProvider.fetchUsername(user[0].user_id)
                        let new_username = `[BWC] ${user_username[0].username}`
                        await guildUser.setNickname(new_username)
                            .catch(err => {
                                client.logger.error(err.stack)
                                return { ERROR_FailedNick: "ERROR - Failed to set Nickname" }
                            })
                    }
                } else {
                    return { ERROR_GuildOwner: "ERROR - Cannot update nickname for guild owner" }
                }
            }
            return { SUCCESS: "SUCCESS - Sync'd Discord Permissions" }
        }
        return { ERROR: "ERROR - Can't find members Discord ID in the Database" }
    }

    async giveRole(client, userId) {
        let user = await client.xenProvider.fetchDiscordLinkInfoForumUserId(userId)

        if (user[0]) {
            let userGroupIds = await client.xenProvider.fetchUserGroupIds(user[0].user_id)
            let userGroupIdsArray = Object.values(userGroupIds[0])[0].split(",")
            userGroupIdsArray.push(Object.values(userGroupIds[0])[1].toString())

            // Causes issues as group 2 = registered forum user group that everyone is a part of...
            // if (userGroupIdsArray.includes('2')) return interaction.followUp({ content: "Please submit an application in the Recruiters Office on the forum here: https://the-bwc.com/forum/index.php?forums/recruiters-office.7/" +
            //                                                                                     "If the application has already been submitted, please wait for the approval" })
            if (userGroupIdsArray.includes('8')) return { message: "Member is banned from BWC. If this is in error contact S-1." }
            if (userGroupIdsArray.includes('10')) return { message: "Hol up... Member is marked as departed. Please contact S-1 Immediately!" }
            if (userGroupIdsArray.includes('43')) return { message: "Member is an Ambassador, please contact S-1 to receive Ambassador tags" }
            if (userGroupIdsArray.includes('51')) return { message: "Member is discharged. Cannot give role" }

            let guild = await client.guilds.fetch(client.config.botMainDiscordServer)

            let bwcRole = guild.roles.cache.filter(role => role.id === client.config.bwcRole)
            if (!bwcRole) return { message: "No default BWC role set. Contact S-1 for assistance." }

            let guestRole = guild.roles.cache.filter(role => role.id === client.config.guestRole)
            if (!guestRole) return { message: "No default Guest role set. Contact S-1 for assistance" }

            let verifyRole = guild.roles.cache.filter(role => role.id === client.config.verifyRole)
            if (!verifyRole) return { message: "No default Verify role set. Contact S-1 for assistance" }

            let unsignedRole = guild.roles.cache.filter(role => role.id === client.config.unsignedRole)
            if (!unsignedRole) return { message: "No default Unsigned role set. Contact S-1 for assistance" }

            let guildUser = guild.members.cache.get(user[0].discord_user_id)

            if (!guildUser.roles.cache.find(role => role === bwcRole[0])) {
                await guildUser.roles.add(bwcRole)
                await guildUser.roles.remove(guestRole)
                await guildUser.roles.remove(verifyRole)
                await guildUser.roles.remove(unsignedRole)
                return { message: "SUCCESS - BWC role added" }
            } else {
                return { message: "ERROR - Could not add BWC role" }
            }


        }

        return { message: "Can't find members Discord ID in the Database" }
    }

    async removeRole(client, userId) {

        let user = await client.xenProvider.fetchDiscordLinkInfoForumUserId(userId)

        if (user[0]) {
            let guild = await client.guilds.fetch(client.config.botMainDiscordServer)

            let bwcRole = guild.roles.cache.filter(role => role.id === client.config.bwcRole)
            if (!bwcRole) return { ERROR_NoBWCRole: "No default BWC role set. Contact S-1 for assistance" }

            let guestRole = guild.roles.cache.filter(role => role.id === client.config.guestRole)
            if (!guestRole) return { ERROR_NoGuestRole: "No default Guest role set. Contact S-1 for assistance" }

            let guildUser = guild.members.cache.get(user[0].discord_user_id)

            if (guildUser.roles.cache.has(bwcRole.firstKey())) {
                await guildUser.roles.remove(bwcRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { ERROR_BWCRoleFailed: "ERROR - Failed to remove BWC Role" }
                    })
                await guildUser.roles.add(guestRole)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { ERROR_GuestRoleFailed: "ERROR - Failed to add Guest Role" }

                    })

                if (guildUser.nickname && guildUser.nickname.includes('[BWC]')) {
                    let new_username = guildUser.nickname.slice(5)
                    await guildUser.setNickname(new_username)
                        .catch(err => {
                            client.logger.error(err.stack)
                            return { ERROR_FailedNick: "ERROR - Failed to remove [BWC] from Nickname" }
                        })
                }
            } else {
                return { ERROR_NoBWCRoleFound: "ERROR - Could not find BWC role on member!" }
            }
            return { SUCCESS: "SUCCESS - Removed Discord Permissions" }
        }

        return { ERROR: "ERROR - Cannot find member' Discord ID in the Database" }
    }
}

module.exports = DiscordRolesController
