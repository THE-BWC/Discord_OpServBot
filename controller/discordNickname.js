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
            let guild = await client.guilds.fetch(client.config.settings_guildId_dev2)
                .catch(err => {
                    client.logger.error(err.stack)
                    return { message: `ERROR - Failed to fetch BWC Discord Server from Bot. Please verify correct Server ID in Settings file` }
                })

            let guildUser = guild.members.cache.get(user.discord_user_id)
            if (!guildUser) return { message: `ERROR - Unable to get guild user information for user ${user.user_id}` }

            await DiscordNicknameController.#nickname(client, user, guildUser)
        }
    }

    static async #nickname(client, user, guildUser) {
        if (guildUser.user.id !== guildUser.guild.ownerId) {
            let user_username = await client.xenProvider.fetchUsername(user.user_id)
            let new_username = `[BWC] ${user_username[0].username}`
            await guildUser.setNickname(new_username)
                .catch(err => {
                    client.logger.error(err.stack)
                    return { message: "ERROR - Failed to set Nickname" }
                })
            return { message: "SUCCESS - Nickname set" }
        } else {
            return { message: "ERROR - Cannot update nickname for guild owner" }
        }
    }
}

module.exports = DiscordNicknameController
