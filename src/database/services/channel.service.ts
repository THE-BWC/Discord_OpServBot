import { DiscordChannelModel } from "../models/bot/index.js";
import { DiscordChannelTypeEnum } from "../../interfaces/enums.interface.js";

/**
 * Get a channel from the database
 *
 * @param   {String}    channelId   The channel ID to get
 *
 * @returns {Promise<DiscordChannelModel>} The channel from the database
 */
async function getChannel(channelId: string) {
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
async function getChannels() {
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
async function getChannelsByTypeAndGuild(type: DiscordChannelTypeEnum, guildId: string) {
    return await DiscordChannelModel.findAll({
        where: {
            type: type,
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
 *
 * @returns {Promise<DiscordChannelModel>} The channel that was added
 */
async function addChannel(channelId: string, type: DiscordChannelTypeEnum, guildId: string) {
    return await DiscordChannelModel.create({
        channel_id: channelId,
        type: type,
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

async function updateChannel(channelId: string, type: DiscordChannelTypeEnum, guildId: string) {
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
 * @param   {String}    channelId   The channel ID to remove
 *
 * @returns {Promise<void>}
 */
async function deleteChannel(channelId: string) {
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
async function deleteAllChannels() {
    return await DiscordChannelModel.destroy({
        where: {}
    });
}

export {
    getChannel,
    getChannels,
    getChannelsByTypeAndGuild,
    addChannel,
    updateChannel,
    deleteChannel,
    deleteAllChannels
}