const htmlToText = require('html-to-text')

class DiscordEventsController {
    /**
     * Syncs all non OPSEC operations across Opserv and Discord
     * @param client
     * @returns {Promise<void>}
     */
    async sync(client) {
        client.logger.info(`[FUNCTION] - Sync function used`);
        const operations = await client.xenProvider.fetchOps()

        if (operations.length === 1) {
            await this.updateDiscordEvent(client, operations[0].operation_id)
        } else {
            let array = []
            for (let op of operations) {
                array.push({operation_id: op.operation_id})
            }
            await this.updateDiscordEvents(client, array)
        }

    }

    /**
     * Takes an operation ID and creates a Discord Event for that operation.
     * @param client
     * @param {String | Number} operationId
     * @returns {Promise<void>}
     */
    async createEvent(client, operationId) {
        client.logger.info(`[FUNCTION] - CreateEvent function used`);
        const operation = await client.xenProvider.fetchOperationById(operationId, false)
        if (operation.length === 0) {
            client.logger.info(`[RETURNED] - OperationData length is 0. Returned`)
            return
        }
        await DiscordEventsController.#createDiscordEvent(client, operation[0])
            .catch(err => client.logger.error(err.stack))
    }

    /**
     * Updates a single Discord event
     * @param client
     * @param {String | Number} operationId
     * @returns {Promise<void>}
     */
    async updateDiscordEvent(client, operationId) {
        client.logger.info(`[FUNCTION] - UpdateDiscordEvent function used`);

        const guild = await client.guilds.fetch(client.config.botMainDiscordServer)
        let operationData = await client.xenProvider.fetchOperationById(operationId)
        if (operationData.length === 0) {
            client.logger.info(`[RETURNED] - OperationData length is 0. Returned`)
            return
        }
        operationData = operationData[0]
        const event = await client.botProvider.fetchEventEntry(operationId)
        if (operationData === undefined && event) {
            await this.deleteDiscordEvent(client, operationId)
            return
        }
        if (operationData === undefined) {
            client.logger.info(`[RETURNED] - Operation Object was undefined. Returned`)
            return
        }

        if (event) {
            if (operationData.edited_date === event.operation_edited_date) {
            	client.logger.info(`[RETURNED] - Operation edited date and event edited date is the same. Returned`)
            	return
            }
            const currentEvent = await guild.scheduledEvents.fetch(event.event_id)
            await DiscordEventsController.#updateEvent(client, guild, currentEvent, operationId, operationData)
        } else {
            await DiscordEventsController.#createDiscordEvent(client, operationData)
        }
    }

    //
    /**
     * Updates Discord Events with new information if the operation was updated
     * @param client
     * @param {Array.<Object>} operations
     * @returns {Promise<void>}
     */
    async updateDiscordEvents(client, operations) {
        client.logger.info(`[FUNCTION] - UpdateDiscordEvents function used`);
        const guild = await client.guilds.fetch(client.config.botMainDiscordServer)
        const currentEvents = guild.scheduledEvents.cache.map(event => event)
        for (const op of operations) {
            let fetchedEvent = await client.botProvider.fetchEventEntry(op.operation_id)
            if (fetchedEvent) {
                const operationDataArray = await client.xenProvider.fetchOperationById(op.operation_id)
                const operationData = operationDataArray[0]

                if (operationData.edited_date !== fetchedEvent.operation_edited_date) {
                    client.logger.info(`[FUNCTION][INFO] - Discord Event Updated`);
                    const event = currentEvents.find(e => e.id === fetchedEvent.event_id)
                    await DiscordEventsController.#updateEvent(client, guild, event, op.operation_id, operationData)
                }
            } else {
                const operationDataArray = await client.xenProvider.fetchOperationById(op.operation_id)
                if (operationDataArray.length === 0) {
                    client.logger.info(`[RETURNED] - OperationData length is 0. Returned`)
                    return
                }
                await DiscordEventsController.#createDiscordEvent(client, operationDataArray[0])
            }
        }
    }

    /**
     * Deletes a Discord Event from Discord and Database Table
     * @param client
     * @param {String | Number} operationId
     * @returns {Promise<void>}
     */
    async deleteDiscordEvent(client, operationId) {
        client.logger.info(`[FUNCTION] - DeleteDiscordEvent function used`);
        const guild = await client.guilds.fetch(client.config.botMainDiscordServer)
        const eventId = await client.botProvider.fetchEventEntry(operationId)

        if (eventId === null) {
            client.logger.info(`[RETURNED] EventID was null. Returning`)
        }
        const event = await guild.scheduledEvents.fetch(eventId.event_id)

        if (event) {
            try {
                await guild.scheduledEvents.delete(event)
                await client.botProvider.deleteEventEntry(operationId)
                return { message: "Event Deleted" }
            } catch (err) {
                client.logger.error(err.stack)
            }
        }

    }

    /**
     * Updates a Discord Event
     * @param client
     * @param {Object} guild
     * @param {Object} currentEvent
     * @param {String | Number} operationId
     * @param {Object} operationData
     * @returns {Promise<void>}
     */
    static async #updateEvent(client, guild, currentEvent, operationId, operationData) {
        client.logger.info(`[FUNCTION] - [PRIVATE] UpdateEvent function used`);
        try {
            if (operationData.date_start < Date.now()/1000) {
                client.logger.info(`[RETURNED] Operations Start Date is in the past. Deleting existing Discord Event and returning.`)
                await client.discordEventsController.deleteDiscordEvent(client, operationId)
                return
            }

            await client.botProvider.updateEventEntry(operationId, operationData.edited_date)
            let html = await DiscordEventsController.#parseHTML(client, operationData.description)
            if (html.length > 950) {
            	html = html.substring(0, 950)
        	}
            let options
            if (operationData.discord_voice_channel_id !== "") {
                const voiceChannel = await guild.channels.fetch(operationData.discord_voice_channel_id)
                if (voiceChannel === null || voiceChannel === undefined) {
          			client.logger.info(`[RETURNED] voiceChannel is null or undefined`)
          			return
        		}
                options = {
                    name: `[${operationData.tag}] - ${operationData.operation_name}`,
                    description: html,
                    scheduledStartTime: new Date(operationData.date_start * 1000),
                    scheduledEndTime: new Date(operationData.date_end * 1000),
                    entityType: 2,
                    privacyLevel: 2,
                    channel: voiceChannel
                }
            } else {
                options = {
                    name: `[${operationData.tag}] - ${operationData.operation_name}`,
                    description: html,
                    scheduledStartTime: new Date(operationData.date_start * 1000),
                    scheduledEndTime: new Date(operationData.date_end * 1000),
                    entityType: 3,
                    privacyLevel: 2,
                    channel: null,
                    entityMetadata: {
                        location: operationData.discord_event_location ? operationData.discord_event_location : "Hmm..."
                    }
                }
            }

            await guild.scheduledEvents.edit(currentEvent, options)
        } catch (err) {
            client.logger.error(err.stack)
        }
    }

    /**
     * Creates a Discord Event
     * @param client
     * @param {Object} operation
     * @returns {Promise<void>}
     */
    static async #createDiscordEvent(client, operation) {
        client.logger.info(`[FUNCTION] - [PRIVATE] CreateDiscordEvent function used`);

        if (!operation) {
            client.logger.info(`[RETURNED] Operation Object was undefined. Returned`)
            return
        }
        if (operation.date_start < Date.now()/1000) {
            client.logger.info(`[RETURNED] - Operation happened in the past. Returned`)
            return
        }
        let guild = await client.guilds.fetch(client.config.botMainDiscordServer)
            .catch(err => client.logger.error(err.stack))

        let html = await DiscordEventsController.#parseHTML(client, operation.description)
        if (html.length > 950) {
            html = html.substring(0, 950)
        }
        let voiceChannel
        if (operation.discord_voice_channel_id !== "" && operation.discord_voice_channel_id !== null) {
            voiceChannel = await guild.channels.fetch(operation.discord_voice_channel_id)
        }
        if (operation.discord_event_location === "" || operation.discord_event_location === null) {
            operation.discord_event_location = "Hmm..."
        }

        let options = (operation.discord_voice_channel_id !== "" && operation.discord_voice_channel_id !== null) ? {
            name: `[${operation.tag}] - ${operation.operation_name}`,
            description: html,
            scheduledStartTime: new Date(operation.date_start * 1000),
            scheduledEndTime: new Date(operation.date_end * 1000),
            entityType: 2,
            privacyLevel: 2,
            channel: voiceChannel
        } : {
            name: `[${operation.tag}] - ${operation.operation_name}`,
            description: html,
            scheduledStartTime: new Date(operation.date_start * 1000),
            scheduledEndTime: new Date(operation.date_end * 1000),
            entityType: 3,
            privacyLevel: 2,
            entityMetadata: {
                location: operation.discord_event_location
            }
        }

        try {
            let event = await guild.scheduledEvents.create(options)
            await client.botProvider.createEventEntry(client.config.botMainDiscordServer, event.id, operation.operation_id, operation.edited_date)
        } catch (err) {
            client.logger.error(err.stack)
        }
    }

    /**
     * Parses HTML code to plain text
     * @param client
     * @param {String} text
     * @returns {Promise<void>}
     */
    static async #parseHTML(client, text) {
        client.logger.info(`[FUNCTION] - [PRIVATE] ParseHTML function used`);
        try {
            return htmlToText.convert(text)
        } catch (err) {
            client.logger.error(err.stack)
        }
    }
}

module.exports = DiscordEventsController
