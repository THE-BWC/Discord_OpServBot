import { DiscordGuildModel } from "../models/bot/index.js";

/**
 * Get a guild from the database
 *
 * @param   {String}    guildId     The guild ID to get
 *
 * @returns {Promise<DiscordGuildModel>} The guild from the database
 */
async function getGuild(guildId: string): Promise<DiscordGuildModel | null> {
    return await DiscordGuildModel.findOne({
        where: {
            guild_id: guildId
        }
    });
}

/**
 * Get all guilds from the database
 *
 * @returns {Promise<DiscordGuildModel[]>} All guilds from the database
 */
async function getGuilds(): Promise<DiscordGuildModel[]> {
    return await DiscordGuildModel.findAll();
}

/**
 * Add a guild to the database
 *
 * @param   {String}    guildId     The guild ID to add
 * @param   {String | null}    logChannelId  The log channel ID to add. Defaults to null
 *
 * @returns {Promise<DiscordGuildModel>} The guild that was added
 */
async function addGuild(guildId: string, logChannelId: string | null = null): Promise<DiscordGuildModel> {
    return await DiscordGuildModel.create({
        guild_id: guildId,
        log_channel_id: logChannelId,
        created_date: Date.now()
    });
}

/**
 * Update a guild in the database
 *
 * @param   {String}    guildId     The guild ID to update
 * @param   {String | null}    logChannelId  The log channel ID to update. Defaults to null
 *
 * @returns {Promise<DiscordGuildModel>} The guild that was updated
 */
async function updateGuild(guildId: string, logChannelId: string | null = null): Promise<[affectedCount: number]> {
    return await DiscordGuildModel.update({
        log_channel_id: logChannelId
    }, {
        where: {
            guild_id: guildId
        }
    });
}

/**
 * Delete a guild from the database
 *
 * @param   {String}    guildId     The guild ID to delete
 *
 * @returns {Promise<Number>} The number of rows deleted
 */
async function deleteGuild(guildId: string): Promise<number> {
    return await DiscordGuildModel.destroy({
        where: {
            guild_id: guildId
        }
    });
}

/**
 * Delete all guilds from the database
 *
 * @returns {Promise<Number>} The number of rows deleted
 */
async function deleteAllGuilds(): Promise<number> {
    return await DiscordGuildModel.destroy({
        where: {}
    });
}

export {
    getGuild,
    getGuilds,
    addGuild,
    updateGuild,
    deleteGuild,
    deleteAllGuilds
}