import { XenDiscordUserLinks, XenDiscordRoles } from '../models/xen/index.js';

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
 * Get discord link info from the database by their discord user ID
 *
 * @param   {String}    discordUserId   The discord user ID to get
 *
 * @returns {Promise<XenDiscordUserLinks>} The user from the database
 */
export async function getDiscordLinkInfoByDiscordUserId(discordUserId: string) {
    return await XenDiscordUserLinks.findOne({
        where: {
            discord_user_id: discordUserId
        }
    });
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

/**
 * Get a discord key role from the database by the role name
 *
 * @param   {String}    roleName    The role name to get
 *
 * @returns {Promise<XenDiscordRoles>} The role from the database
 */
export async function getDiscordRoleByRoleName(roleName: string): Promise<XenDiscordRoles | null> {
    return await XenDiscordRoles.findOne({
        where: {
            name: roleName
        }
    });
}

/**
 * Get all discord key roles from the database
 *
 * @returns {Promise<XenDiscordRoles>} The role from the database
 */
export async function getAllDiscordRoles(): Promise<XenDiscordRoles[]> {
    return await XenDiscordRoles.findAll();
}