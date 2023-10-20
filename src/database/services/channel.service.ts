import { DiscordChannelModel } from "../models/bot/index.js";
import { DiscordChannelTypeEnum } from "../../interfaces/enums.interface.js";

/**
 * Get a channel from the database
 *
 * @param   {String}                    channelId   The channel ID to get
 *
 * @returns {Promise<DiscordChannelModel>} The channel from the database
 */
async function getChannel(channelId: string): Promise<DiscordChannelModel | null> {
    return await DiscordChannelModel.findOne({
        where: {
            channel_id: channelId
        }
    });
}

/**
 * Get all channels from the database
 *
 * @returns {Promise<DiscordChannelModel[]>} All channels from the database
 */
async function getChannels(): Promise<DiscordChannelModel[]> {
    return await DiscordChannelModel.findAll();
}

/**
 * Get all channels from the database that has the type
 *
 * @param   {DiscordChannelTypeEnum}    type    The type of channel to get
 * @param   {String}                    guildId The guild ID to get channels for
 *
 * @returns {Promise<DiscordChannelModel[]>} All channels from the database
 */
async function getChannelsByTypeAndGuild(type: DiscordChannelTypeEnum, guildId: string): Promise<DiscordChannelModel[]> {
    return await DiscordChannelModel.findAll({
        where: {
            type: type,
            guild_id: guildId
        }
    });
}

/**
 * Get all channels from the database that has the game ID
 *
 * @param   {Number}                    gameId  The game ID to get channels for
 * @param   {String}                    guildId The guild ID to get channels for
 *
 * @returns {Promise<DiscordChannelModel[]>} All channels from the database
 */
async function getChannelsByGameIdAndGuild(gameId: number, guildId: string): Promise<DiscordChannelModel[]> {
    return await DiscordChannelModel.findAll({
        where: {
            game_id: gameId,
            guild_id: guildId
        }
    });
}

/**
 * Add a channel to the database
 *
 * @param   {String}                    channelId   The channel ID to add
 * @param   {DiscordChannelTypeEnum}    type        The type of channel to add
 * @param   {String}                    guildId     The guild ID to add
 * @param   {Number}                    gameId      The game ID to add
 *
 * @returns {Promise<DiscordChannelModel>} The channel that was added
 */
async function addChannel(channelId: string, type: DiscordChannelTypeEnum, guildId: string, gameId?: number): Promise<DiscordChannelModel> {
    return await DiscordChannelModel.create({
        channel_id: channelId,
        type: type,
        game_id: gameId,
        guild_id: guildId,
        created_date: Date.now()
    });
}

/**
 * Update a channel in the database
 *
 * @param   {String}                    channelId   The channel ID to update
 * @param   {DiscordChannelTypeEnum}    type        The type of channel to update
 * @param   {String}                    guildId     The guild ID to update
 *
 * @returns {Promise<DiscordChannelModel>} The channel that was updated
 */

async function updateChannel(channelId: string, type: DiscordChannelTypeEnum, guildId: string): Promise<[affectedCount: number]> {
    return await DiscordChannelModel.update({
        type: type,
        guild_id: guildId
    }, {
        where: {
            channel_id: channelId
        }
    });
}

/**
 * Delete a channel from the database
 *
 * @param   {String}                    channelId   The channel ID to delete
 *
 * @returns {Promise<void>}
 */
async function deleteChannel(channelId: string): Promise<number> {
    return await DiscordChannelModel.destroy({
        where: {
            channel_id: channelId
        }
    });
}

/**
 * Delete all channels from the database
 *
 * @returns {Promise<void>}
 */
async function deleteAllChannels(): Promise<number> {
    return await DiscordChannelModel.destroy({
        where: {}
    });
}

export {
    getChannel,
    getChannels,
    getChannelsByTypeAndGuild,
    getChannelsByGameIdAndGuild,
    addChannel,
    updateChannel,
    deleteChannel,
    deleteAllChannels
}