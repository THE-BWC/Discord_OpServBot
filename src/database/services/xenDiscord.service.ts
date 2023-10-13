import { XenDiscordUserLinks, XenDiscordKeyRoles } from '../models/xen/index.js';

/**
 * Get all discord link info from the database
 *
 * @returns {Promise<XenDiscordUserLinks>} The user from the database
 */
export async function getAllDiscordLinkInfo() {
    return await XenDiscordUserLinks.findAll();
}

/**
 * Get discord link info from the database by their forum user ID
 *
 * @param   {String}    userId  The user ID to get
 *
 * @returns {Promise<XenDiscordUserLinks>} The user from the database
 */
export async function getDiscordLinkInfoByForumUserId(userId: string) {
    return await XenDiscordUserLinks.findOne({
        where: {
            user_id: userId
        }
    });
}

/**
 * Get a discord key role from the database by the role name
 *
 * @param   {String}    roleName    The role name to get
 *
 * @returns {Promise<XenDiscordKeyRoles>} The role from the database
 */
export async function getDiscordKeyRoleByRoleName(roleName: string): Promise<XenDiscordKeyRoles | null> {
    return await XenDiscordKeyRoles.findOne({
        where: {
            name: roleName
        }
    });
}

/**
 * Get all discord key roles from the database
 *
 * @returns {Promise<XenDiscordKeyRoles>} The role from the database
 */
export async function getAllDiscordKeyRoles(): Promise<XenDiscordKeyRoles[]> {
    return await XenDiscordKeyRoles.findAll();
}

/**
 * Insert a discord link info in the database by their forum user ID
 *
 * @param   {number}    userId  The user ID to set
 * @param   {String}    discordUserId   The discord user ID to set
 * @param   {String}    discordUsername The discord username to set
 * @param   {String}    discordDiscrim  The discord discrim to set
 *
 * @returns {Promise<XenDiscordUserLinks>} The user from the database
 */
export async function setDiscordLinkInfoByForumUserId(userId: number, discordUserId: string, discordUsername: string, discordDiscrim: string): Promise<XenDiscordUserLinks> {
    return await XenDiscordUserLinks.create({
        user_id: userId,
        discord_user_id: discordUserId,
        discord_username: discordUsername,
        discord_discrim: discordDiscrim
    });
}