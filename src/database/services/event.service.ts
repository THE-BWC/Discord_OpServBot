import { DiscordEventModel } from '../models/bot/index.js';

/**
 * Get an event from the database by its operation ID.
 *
 * @param   {number} opId                       The operation ID to get
 *
 * @returns {Promise<DiscordEventModel | null>} The event from the database.
 */
async function getEventByOpId(opId: number): Promise<DiscordEventModel | null> {
    return await DiscordEventModel.findOne({
        where: {
            operation_id: opId
        }
    })
}

/**
 * Get all events from the database.
 *
 * @returns {Promise<DiscordEventModel[]>}  The events from the database.
 */
async function getAllEvents(): Promise<DiscordEventModel[]> {
    return await DiscordEventModel.findAll();
}

/**
 * Get all events from the database that match the guild ID.
 *
 * @param   {string} eventId                The event ID to add
 * @param   {number} opId                   The operation ID to add
 * @param   {number} opEditedDate           The operation edited date to add
 * @param   {string} guildId                The guild ID to associate the event with
 *
 * @returns {Promise<DiscordEventModel>}    The event from the database.
 */
async function addEvent(eventId: string, opId: number, opEditedDate: number, guildId: string): Promise<DiscordEventModel> {
    return await DiscordEventModel.create({
        event_id: eventId,
        operation_id: opId,
        operation_edited_date: opEditedDate,
        guild_id: guildId
    });
}

/**
 * Update an event in the database.
 *
 * @param   {number} opId                   The operation ID to update
 * @param   {number} opEditedDate           The operation edited date to update
 *
 * @returns {Promise<DiscordEventModel>}    The event from the database.
 */
async function updateEvent(opId: number, opEditedDate: number): Promise<[affectedCount: number]> {
    return await DiscordEventModel.update({
        operation_edited_date: opEditedDate
    }, {
        where: {
            operation_id: opId
        }
    });
}

/**
 * Delete an event from the database.
 *
 * @param   {number} opId       The operation ID to delete
 *
 * @returns {Promise<number>}   The event from the database.
 */
async function deleteEvent(opId: number): Promise<number> {
    return await DiscordEventModel.destroy({
        where: {
            operation_id: opId
        }
    });
}

export {
    getEventByOpId,
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent
}