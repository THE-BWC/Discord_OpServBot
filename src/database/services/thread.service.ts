import { DiscordThreadModel } from "../models/bot/index.js";

/**
 * Get a thread from the database
 *
 * @param   {String}    threadId    The thread ID to get
 *
 * @returns {Promise<DiscordThreadModel>} The thread from the database
 */
async function getThread(threadId: string) {
    return await DiscordThreadModel.findOne({
        where: {
            thread_id: threadId
        }
    });
}

/**
 * Get all threads from the database
 *
 * @returns {Promise<DiscordThreadModel[]>} All threads from the database
 */
async function getThreads() {
    return await DiscordThreadModel.findAll();
}

/**
 * Get all threads from the database that match the guild ID
 *
 * @param {String} guildId The guild ID to get threads for
 *
 * @returns {Promise<DiscordThreadModel[]>} All threads from the database
 */
async function getThreadsByGuild(guildId: string) {
    return await DiscordThreadModel.findAll({
        where: {
            guild_id: guildId
        }
    });
}

/**
 * Add a thread to the database
 *
 * @param   {String}    threadId    The thread ID to add
 * @param   {String}    guildId     The guild ID to add
 * @param   {String}    channelId   The channel ID to add
 * @param   {Number}    deleteAt    The time to delete the thread
 *
 * @returns {Promise<DiscordThreadModel>} The thread that was added
 */
async function addThread(threadId: string, guildId: string, channelId: string, deleteAt: number) {
    return await DiscordThreadModel.create({
        thread_id: threadId,
        guild_id: guildId,
        channel_id: channelId,
        created_date: Date.now(),
        delete_at: deleteAt
    });
}

/**
 * Update a thread in the database
 *
 * @param   {String}    threadId    The thread ID to update
 * @param   {String}    guildId     The guild ID to update
 * @param   {String}    channelId   The channel ID to update
 * @param   {Number}    deleteAt    The time to delete the thread
 *
 * @returns {Promise<DiscordThreadModel>} The thread that was updated
 */
async function updateThread(threadId: string, guildId: string, channelId: string, deleteAt?: number) {
    let values: any = {
        guild_id: guildId,
        channel_id: channelId
    }

    if (deleteAt) {
        values.delete_at = deleteAt;
    }

    return await DiscordThreadModel.update(values, {
        where: {
            thread_id: threadId
        }
    });
}

/**
 * Delete a thread from the database
 *
 * @param   {String}    threadId    The thread ID to delete
 *
 * @returns {Promise<Number>} The number of rows deleted
 */
async function deleteThread(threadId: string) {
    return await DiscordThreadModel.destroy({
        where: {
            thread_id: threadId
        }
    });
}

/**
 * Delete all threads from the database
 *
 * @returns {Promise<Number>} The number of rows deleted
 */
async function deleteAllThreads() {
    return await DiscordThreadModel.destroy({
        where: {}
    });
}

export {
    getThread,
    getThreads,
    getThreadsByGuild,
    addThread,
    updateThread,
    deleteThread,
    deleteAllThreads
}