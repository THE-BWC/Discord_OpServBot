import { BWC_Client } from "../lib/index.js";
import { XenDiscordUserLinks } from "../database/models/xen/index.js";
import { Guild, GuildMember } from "discord.js";

export default class DiscordNicknameController {
    private client: BWC_Client;
    constructor(client: BWC_Client) {
        this.client = client;
    }

    /**
     * Sets the nickname for the user
     *
     * @param   {String}    forumUserId The forum user ID to set the nickname for
     *
     * @returns {Promise<{ message: string }>}       The result of the operation
     */
    public async setNickname(forumUserId: string): Promise<{ message: string }> {
        let user: XenDiscordUserLinks;
        try {
            user = await this.client.xenDatabaseProvider.xenDiscordService.getDiscordLinkInfoByForumUserId(forumUserId) as XenDiscordUserLinks;
        } catch (error: any) {
            this.client.logger.error(`Error fetching user ${forumUserId} from database`, { label: 'CONTROLLER', error: error.stack });
            return { message: `ERROR - Unable to fetch user ${forumUserId} from database` }
        }

        let guild: Guild;
        try {
         guild = await this.client.guilds.fetch(this.client.getMainGuild())
        } catch (error: any) {
            this.client.logger.info(`Guild ${this.client.getMainGuild()} does not exist`, { label: 'CONTROLLER' });
            return { message: `ERROR - Failed to fetch BWC Discord Server from Bot. Please verify correct Server ID` }
        }

        let guildUser: GuildMember;
        try {
            guildUser = await guild.members.fetch(user.discord_user_id)
        } catch (error: any) {
            this.client.logger.error(`Error fetching user ${user.discord_user_id} in guild ${guild.id}`, { label: 'CONTROLLER' });
            return { message: `ERROR - Unable to get guild user information for user ${user.user_id}` }
        }

        if (guildUser.user.id !== guildUser.guild.ownerId) {
            let userUsername = await this.client.xenDatabaseProvider.xenUserService.getUserByUserId(forumUserId);
            if (userUsername === null || userUsername === undefined || !userUsername.username) {
                this.client.logger.error(`Forum User ${forumUserId} does not exist in the database`, { label: 'CONTROLLER' });
                return { message: `ERROR - Forum User ${forumUserId} does not exist in the database` }
            }

            let newNickname = `[BWC] ${userUsername.username}`;
            await guildUser.setNickname(newNickname)
                .catch(error => {
                    this.client.logger.error(`Error setting nickname for user ${user.discord_user_id} in guild ${guild.id}`, { label: 'CONTROLLER', error: error.stack });
                    return { message: `ERROR - Unable to set nickname for user ${user.user_id}` };
                })

            return { message: "SUCCESS - Nickname set" }
        } else {
            return { message: "ERROR - Cannot update nickname for guild owner" }
        }
    }
}