// noinspection JSUnresolvedVariable
class DiscordNicknameController {
    async setNickname(client, userId) {
        // Check if user has Linked Discord to account
        let user = await client.xenProvider.fetchDiscordLinkInfoForumUserId(userId)
            .catch(err => {
                client.logger.error(err.stack)
                return { message: `ERROR - Failed to fetch Discord information for user ${userId} from Database` }
            })

        if (user[0]) {
            user = user[0]
            let guild = await client.guilds.fetch(client.config.botMainDiscordServer)
                .catch(err => {
                    client.logger.error(err.stack)
                    return { message: `ERROR - Failed to fetch BWC Discord Server from Bot. Please verify correct Server ID in Settings file` }
                })

            let guildUser = guild.members.cache.get(user.discord_user_id)
            if (!guildUser) return { message: `ERROR - Unable to get guild user information for user ${user.user_id}` }

            try {
                return await DiscordNicknameController.#nickname(client, user, guildUser)
            } catch (err) {
                client.logger.error(err.stack)
                return { message: "ERROR - Failed to set Nickname" }
            }
        }
    }

    static async #nickname(client, user, guildUser) {
        if (guildUser.user.id !== guildUser.guild.ownerId) {
            if (guildUser.nickname === null) {
                client.logger.info(guildUser)
                let user_username = await client.xenProvider.fetchUsername(user.user_id)
                let new_username = `[BWC] ${user_username[0].username}`
                try {
                    await guildUser.setNickname(new_username)
                    return { message: "SUCCESS - Nickname set" }
                } catch (err) {
                    client.logger.error(err.stack)
                    return { message: "ERROR - Failed to set Nickname" }
                }
            } else {
                return { message: "ERROR - Nickname already set" }
            }
        } else {
            return { message: "ERROR - Cannot update nickname for guild owner" }
        }
    }
}

module.exports = DiscordNicknameController
