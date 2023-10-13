import { XenUserModel } from '../models/xen/index.js';

/**
 * Get users user_id and username from the database by their username
 *
 * @param   {String}    username    The username to get
 *
 * @returns {Promise<XenUserModel>} The user from the database
 */
export async function getUserByUsername(username: string): Promise<XenUserModel | null> {
    return await XenUserModel.findOne({
        attributes: ['user_id', 'username'],
        where: {
            username: username
        }
    });
}

/**
 * Get users user_id and username from the database by their user ID
 *
 * @param   {String}    userId  The user ID to get
 *
 * @returns {Promise<XenUserModel>} The user from the database
 */
export async function getUserByUserId(userId: string): Promise<XenUserModel | null> {
    return await XenUserModel.findOne({
        attributes: ['user_id', 'username'],
        where: {
            user_id: userId
        }
    });
}

/**
 * Get users usergroups from the database by their user ID
 *
 * @param   {String}    userId  The user ID to get
 *
 * @returns {Promise<XenUserModel>} The user from the database
 */
export async function getUserGroupsByUserId(userId: string): Promise<XenUserModel | null> {
    return await XenUserModel.findOne({
        attributes: ['user_group_id', 'secondary_group_ids'],
        where: {
            user_id: userId
        }
    });
}