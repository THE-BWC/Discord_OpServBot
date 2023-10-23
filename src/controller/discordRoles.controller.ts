import { BWC_Client } from "../lib/index.js";
import { XenDiscordRoles, XenUserModel } from "../database/models/xen/index.js";
import { GuildMember } from "discord.js";

export default class DiscordRolesController {
    public client: BWC_Client;

    constructor(client: BWC_Client) {
        this.client = client;
    }

    /**
     * Synchronizes the roles for the user with the given forum user ID
     *
     * @param   {String}    forumUserId         The forum user ID to synchronize roles for
     *
     * @returns {Promise<{ message: string }>}  The result of the operation
     */
    public async syncRolesByForumUserId(forumUserId: string): Promise<{ message: string }> {
        const forumUser = await this.client.xenDatabaseProvider.xenDiscordService.getDiscordLinkInfoByForumUserId(forumUserId);
        if (!forumUser) {
            this.client.logger.error(`Could not find forum user with ID ${forumUserId} in the database.`);
            return { message: `ERROR - Could not find forum user with ID ${forumUserId} in the database.` };
        }
        const discordUser = await this.client.guilds.cache.get(this.client.getMainGuildId())?.members.fetch(forumUser.discord_user_id);
        if (!discordUser) {
            this.client.logger.error(`Could not find discord user with ID ${forumUser.discord_user_id} in the main guild.`);
            return { message: `ERROR - Could not find discord user with ID ${forumUser.discord_user_id} in the main guild.` };
        }
        const discordRoles = await this.client.xenDatabaseProvider.xenDiscordService.getAllDiscordRoles();
        const forumUserGroups = await this.client.xenDatabaseProvider.xenUserService.getUserGroupsByUserId(forumUserId);
        if (!forumUserGroups) {
            this.client.logger.error(`Could not find forum user groups for user with ID ${forumUserId} in the database.`);
            return { message: `ERROR - Could not find forum user groups for user with ID ${forumUserId} in the database.` };
        }

        return this.updateRoles(forumUserGroups, discordRoles, discordUser)
            .then(() => { return { message: `SUCCESS - Roles synced` }; })
            .catch((error) => {
                this.client.logger.error(`Error syncing roles for user ${forumUserId}`, { label: 'CONTROLLER', error: error.stack });
                return { message: `ERROR - An error happened while synchronizing roles` };
            });
    }

    /**
     * Synchronizes the roles for the user with the given discord user ID
     *
     * @param   {String}    discordUserId       The discord user ID to synchronize roles for
     *
     * @returns {Promise<{ message: string }>}  The result of the operation
     */
    public async syncRolesByDiscordUserId(discordUserId: string): Promise<{ message: string }> {
        const forumUser = await this.client.xenDatabaseProvider.xenDiscordService.getDiscordLinkInfoByDiscordUserId(discordUserId);
        if (!forumUser) {
            this.client.logger.error(`Could not find Discord user with ID ${discordUserId} in the database.`);
            return { message: `ERROR - Could not find Discord user with ID ${discordUserId} in the database.` };
        }
        const discordUser = await this.client.guilds.cache.get(this.client.getMainGuildId())?.members.fetch(discordUserId);
        if (!discordUser) {
            this.client.logger.error(`Could not find discord user with ID ${discordUserId} in the main guild.`);
            return { message: `ERROR - Could not find discord user with ID ${discordUserId} in the main guild.` };
        }
        const discordRoles = await this.client.xenDatabaseProvider.xenDiscordService.getAllDiscordRoles();
        const forumUserGroups = await this.client.xenDatabaseProvider.xenUserService.getUserGroupsByUserId(String(forumUser.user_id));
        if (!forumUserGroups) {
            this.client.logger.error(`Could not find forum user groups for user with ID ${forumUser.user_id} in the database.`);
            return { message: `ERROR - Could not find forum user groups for user with ID ${forumUser.user_id} in the database.` };
        }

        return this.updateRoles(forumUserGroups, discordRoles, discordUser)
            .then(() => { return { message: `SUCCESS - Roles synced` }; })
            .catch((err) => {
                this.client.logger.error(`Error syncing roles for user ${forumUser.user_id}`, { label: 'CONTROLLER', error: err.stack });
                return { message: `ERROR - An error happened while synchronizing roles` };
            });
    }

    /**
     * Updates the roles for the given discord user
     *
     * @param   {XenUserModel}          forumUserGroups     The forum user groups to update roles for
     * @param   {XenDiscordRoles[]}     discordRoles        The discord roles to update
     * @param   {GuildMember}           discordUser         The discord user to update roles for
     *
     * @returns {Promise<void>}                             The result of the operation
     * @private
     */
    private async updateRoles(forumUserGroups: XenUserModel, discordRoles: XenDiscordRoles[], discordUser: GuildMember): Promise<void> {
        const forumUserGroupIds = forumUserGroups.secondary_group_ids.split(',').concat(String(forumUserGroups.user_group_id));
        const discordRoleIds = discordRoles.map(role => role.role_id);
        const discordUserRoleIds = discordUser.roles.cache.map(role => role.id);

        const discordUserRolesToAdd = discordRoleIds.filter(roleId => forumUserGroupIds.includes(roleId) && !discordUserRoleIds.includes(roleId));
        const discordUserRolesToRemove = discordUserRoleIds.filter(roleId => !forumUserGroupIds.includes(roleId) && discordRoleIds.includes(roleId));

        if (discordUserRolesToAdd.length > 0) {
            await discordUser.roles.add(discordUserRolesToAdd);
            this.client.logger.info(`Added roles ${discordUserRolesToAdd.join(', ')} to ${discordUser.user.tag} (${discordUser.id})`);
        }
        if (discordUserRolesToRemove.length > 0) {
            await discordUser.roles.remove(discordUserRolesToRemove);
            this.client.logger.info(`Removed roles ${discordUserRolesToRemove.join(', ')} from ${discordUser.user.tag} (${discordUser.id})`);
        }
    }
}