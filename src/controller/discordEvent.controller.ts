import htmlToText from 'html-to-text';
import { BWC_Client } from "../lib/index.js";
import { XenOpservOperationModel } from "../database/models/xen/index.js";
import {
    Guild,
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    GuildVoiceChannelResolvable
} from "discord.js";
import { INTDiscordEventOptions } from "../interfaces/main.interface.js";
import { DiscordEventModel } from "../database/models/bot/index.js";

export default class DiscordThreadController {
    private client: BWC_Client;
    constructor(client: BWC_Client) {
        this.client = client;
    }

    /**
     * Syncs all non OPSEC operations across OpServ and Discord
     *
     * @returns {Promise<void>}
     */
    public async syncEvents(): Promise<void> {
        try {
            await this.syncDiscordToOpserv();
            this.client.logger.info(`Synced events from Discord to OpServ`, { label: 'CONTROLLER' });

            await this.syncOpservToDiscord();
            this.client.logger.info(`Synced events from OpServ to Discord`, { label: 'CONTROLLER' });
        } catch (error: any) {
            this.client.logger.error(`Error syncing events:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Creates a Discord event for the provided operation ID
     *
     * @param   {number}    opId    The operation ID to create an event for
     *
     * @returns {Promise<void>}
     */
    public async createEvent(opId: number): Promise<void> {
        const op = await this.client.xenDatabaseProvider.xenOperationService.getOperationByOpId(opId)
            .catch(error => {
                this.client.logger.error(`Error getting operation ${opId}:`, { label: 'CONTROLLER', error: error.stack });
                return;
            })
        if (!op) {
            this.client.logger.error(`Operation ${opId} not found`, { label: 'CONTROLLER' });
            return;
        }

        try {
            await this.createDiscordEvent(op);
        } catch (error: any) {
            this.client.logger.error(`Error creating event for operation ${opId}:`, { label: 'CONTROLLER', error: error.stack });
            return;
        }
    }

    /**
     * Updates the Discord event for the provided operation ID
     *
     * @param   {number}    opId    The operation ID to update an event for
     *
     * @returns {Promise<void>}
     */
    public async updateEvent(opId: number): Promise<void> {
        const op = await this.client.xenDatabaseProvider.xenOperationService.getOperationByOpId(opId)
            .catch(error => {
                this.client.logger.error(`Error getting operation ${opId}:`, { label: 'CONTROLLER', error: error.stack });
            })
        if (!op) {
            this.client.logger.error(`Operation ${opId} not found`, { label: 'CONTROLLER' });
            return;
        }

        const event = await this.client.botDatabaseProvider.eventService.getEventByOpId(opId)
            .catch(error => {
                this.client.logger.error(`Error getting event for operation ${opId}:`, { label: 'CONTROLLER', error: error.stack });
            })

        if (event) {
            try {
                await this.updateDiscordEvent(op, event);
                this.client.logger.info(`Updated event ${event.event_id} for operation ${opId}`, { label: 'CONTROLLER' });
            } catch (error: any) {
                this.client.logger.error(`Error updating event for operation ${opId}:`, { label: 'CONTROLLER', error: error.stack });
                return;
            }
        } else {
            try {
                await this.createDiscordEvent(op);
                this.client.logger.info(`Created event for operation ${opId}`, { label: 'CONTROLLER' });
            } catch (error: any) {
                this.client.logger.error(`Error creating event for operation ${opId}:`, { label: 'CONTROLLER', error: error.stack });
                return;
            }
        }

    }

    /**
     * Deletes the Discord event for the provided operation ID
     *
     * @param   {number}    opId    The operation ID to delete an event for
     *
     * @returns {Promise<void>}
     */
    public async deleteDiscordEvent(opId: number): Promise<void> {
        const event = await this.client.botDatabaseProvider.eventService.getEventByOpId(opId)
            .catch(error => {
                this.client.logger.error(`Error getting event for operation ${opId}:`, { label: 'CONTROLLER', error: error.stack });
            })
        if (!event) {
            this.client.logger.error(`Event for operation ${opId} not found`, { label: 'CONTROLLER' });
            return;
        }


        const guild = await this.client.guilds.fetch(this.client.getMainGuildId())
            .catch(error => {
                this.client.logger.error(`Error fetching guild ${this.client.getMainGuildId()}:`, { label: 'CONTROLLER', error: error.stack });
            })
        if (!guild) {
            this.client.logger.error(`Guild ${this.client.getMainGuildId()} not found`, { label: 'CONTROLLER' });
            return;
        }

        const discordEvent = guild.scheduledEvents.cache.get(event.event_id);
        if (!discordEvent) {
            this.client.logger.error(`Event ${event.event_id} not found`, { label: 'CONTROLLER' });
            return;
        }

        try {
            await guild.scheduledEvents.delete(discordEvent)
            await this.client.botDatabaseProvider.eventService.deleteEvent(event.operation_id);
            this.client.logger.info(`Deleted event ${event.event_id} for operation ${opId}`, { label: 'CONTROLLER' });
        } catch (error: any) {
            this.client.logger.error(`Error deleting event ${event.event_id} for operation ${opId}:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Creates a Discord event for the provided operation
     *
     * @param   {XenOpservOperationModel}   op  The operation to create an event for
     *
     * @returns {Promise<void>} Nothing
     */
    private async createDiscordEvent(op: XenOpservOperationModel): Promise<void> {
        if (!op) {
            this.client.logger.error(`No operation provided`, { label: 'CONTROLLER' });
            return;
        }
        if (op.date_start < Date.now() / 1000) {
            this.client.logger.error(`Operation ${op.operation_id} happened in the past`, { label: 'CONTROLLER' });
            return;
        }

        const guild = await this.client.guilds.fetch(this.client.getMainGuildId())
            .catch(error => {
                this.client.logger.error(`Error fetching guild ${this.client.getMainGuildId()}:`, { label: 'CONTROLLER', error: error.stack });
            })
        if (!guild) {
            this.client.logger.error(`Guild ${this.client.getMainGuildId()} not found`, { label: 'CONTROLLER' });
            return;
        }

        const options = await this.prepareDiscordEvent(op, guild);
        if (!options) {
            this.client.logger.error(`Unable to prepare event options for operation ${op.operation_id}`, { label: 'CONTROLLER' });
            return;
        }

        try {
            const event = await guild.scheduledEvents.create(options);
            await this.client.botDatabaseProvider.eventService.addEvent(event.id, op.operation_id, op.edited_date, guild.id);
            this.client.logger.info(`Created event ${event.id} for operation ${op.operation_id}`, { label: 'CONTROLLER' });
        } catch (error: any) {
            this.client.logger.error(`Error creating event for operation ${op.operation_id}:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * @private
     * Updates the Discord event for the provided operation
     *
     * @param   {XenOpservOperationModel}   op      The operation to update an event for
     * @param   {DiscordEventModel}         event   The event to update
     *
     * @returns {Promise<void>} Nothing
     */
    private async updateDiscordEvent(op: XenOpservOperationModel, event: DiscordEventModel): Promise<void> {
        const guild = await this.client.guilds.fetch(this.client.getMainGuildId())
            .catch(error => {
                this.client.logger.error(`Error fetching guild ${this.client.getMainGuildId()}:`, {
                    label: 'CONTROLLER',
                    error: error.stack
                });
            })
        if (!guild) {
            this.client.logger.error(`Guild ${this.client.getMainGuildId()} not found`, {label: 'CONTROLLER'});
            return;
        }

        const discordEvent = guild.scheduledEvents.cache.get(event.event_id);
        if (!discordEvent) {
            this.client.logger.error(`Event ${event.event_id} not found`, {label: 'CONTROLLER'});
            return;
        }

        const options = await this.prepareDiscordEvent(op, guild);
        if (!options) {
            this.client.logger.error(`Unable to prepare event options for operation ${op.operation_id}`, { label: 'CONTROLLER' });
            return;
        }

        try {
            await guild.scheduledEvents.edit(discordEvent, options);
            await this.client.botDatabaseProvider.eventService.updateEvent(op.operation_id, op.edited_date);
            this.client.logger.info(`Updated event ${event.event_id} for operation ${op.operation_id}`, { label: 'CONTROLLER' });
        } catch (error: any) {
            this.client.logger.error(`Error updating event ${event.event_id} for operation ${op.operation_id}:`, {
                label: 'CONTROLLER',
                error: error.stack
            });
        }
    }

    /**
     * @private
     * Parses HTML to text
     *
     * @param   {string}    html    The HTML to parse
     *
     * @returns {Promise<string | undefined>} The parsed HTML
     */
    private async parseHTML(html: string): Promise<string | undefined> {
        try {
            return htmlToText.convert(html)
        } catch (error: any) {
            this.client.logger.error(`Error parsing HTML:`, { label: 'CONTROLLER', error: error.stack });
            return;
        }
    }

    /**
     * @private
     * Prepares the Discord event options for the provided operation
     *
     * @param   {XenOpservOperationModel}   op      The operation to prepare the event options for
     * @param   {Guild}                     guild   The guild to prepare the event options for
     *
     * @returns {Promise<INTDiscordEventOptions | undefined>} The event options
     */
    private async prepareDiscordEvent(op: XenOpservOperationModel, guild: Guild): Promise<INTDiscordEventOptions | undefined> {
        let html = await this.parseHTML(op.description);
        if (typeof html === 'string' && html.length > 950) {
            html = html.substring(0, 950) + '...';
        }

        if (op.discord_event_location === "" || op.discord_event_location === null) {
            op.discord_event_location = "Unknown";
        }

        if (op.discord_voice_channel_id !== "" && op.discord_voice_channel_id !== null) {
            const voiceChannel = await guild.channels.fetch(op.discord_voice_channel_id)
                .catch(error => {
                    this.client.logger.error(`Error fetching voice channel ${op.discord_voice_channel_id}:`, { label: 'CONTROLLER', error: error.stack });
                })
            if (!voiceChannel) {
                this.client.logger.error(`Voice channel ${op.discord_voice_channel_id} not found`, { label: 'CONTROLLER' });
                return;
            }
            return {
                name: op.operation_name,
                description: html,
                scheduledStartTime: new Date(op.date_start * 1000),
                scheduledEndTime: new Date(op.date_end * 1000),
                entityType: GuildScheduledEventEntityType.Voice,
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                channel: voiceChannel as GuildVoiceChannelResolvable
            }
        } else {
            return {
                name: op.operation_name,
                description: html,
                scheduledStartTime: new Date(op.date_start * 1000),
                scheduledEndTime: new Date(op.date_end * 1000),
                entityType: GuildScheduledEventEntityType.External,
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                entityMetadata: {
                    location: op.discord_event_location
                }
            }
        }
    }

    /**
     * @private
     * Syncs all current events from Discord with the Event table in the database
     *
     * @returns {Promise<void>}
     */
    private async syncDiscordToOpserv(): Promise<void> {
        const guild = await this.client.guilds.fetch(this.client.getMainGuildId())
            .catch(error => {
                this.client.logger.error(`Error fetching guild ${this.client.getMainGuildId()}:`, { label: 'CONTROLLER', error: error.stack });
            })
        if (!guild) {
            this.client.logger.error(`Guild ${this.client.getMainGuildId()} not found`, { label: 'CONTROLLER' });
            return;
        }

        const discordEvents = await guild.scheduledEvents.fetch()
            .catch(error => {
                this.client.logger.error(`Error fetching events for guild ${guild.id}:`, { label: 'CONTROLLER', error: error.stack });
            })
        if (!discordEvents) {
            this.client.logger.error(`No events found for guild ${guild.id}`, { label: 'CONTROLLER' });
            return;
        }

        const events = await this.client.botDatabaseProvider.eventService.getAllEvents()
            .catch(error => {
                this.client.logger.error(`Error fetching events from the database:`, { label: 'CONTROLLER', error: error.stack });
            })
        if (!events) {
            this.client.logger.error(`No events found in the database`, { label: 'CONTROLLER' });
            return;
        }

        for (const event of events) {
            const discordEvent = discordEvents.get(event.event_id);
            if (!discordEvent) {
                await this.client.botDatabaseProvider.eventService.deleteEvent(event.operation_id)
                    .catch(error => {
                        this.client.logger.error(`Error deleting event ${event.event_id} for operation ${event.operation_id}:`, { label: 'CONTROLLER', error: error.stack });
                    })
                this.client.logger.info(`Deleted event ${event.event_id} for operation ${event.operation_id}`, { label: 'CONTROLLER' });
            }
        }
    }

    /**
     * @private
     * Syncs all current operations from OpServ to Discord and the Event table in the database
     *
     * @returns {Promise<void>}
     */
    private async syncOpservToDiscord(): Promise<void> {
        const ops = await this.client.xenDatabaseProvider.xenOperationService.getUpcomingOperations()
            .catch(error => {
                this.client.logger.error(`Error fetching upcoming operations:`, { label: 'CONTROLLER', error: error.stack });
            })
        if (!ops) {
            this.client.logger.error(`No operations found`, { label: 'CONTROLLER' });
            return;
        }

        for (const op of ops) {
            const event = await this.client.botDatabaseProvider.eventService.getEventByOpId(op.operation_id)
                .catch(error => {
                    this.client.logger.error(`Error fetching event for operation ${op.operation_id}:`, { label: 'CONTROLLER', error: error.stack });
                })
            if (!event) {
                try {
                    await this.createDiscordEvent(op);
                    this.client.logger.info(`Created event for operation ${op.operation_id}`, { label: 'CONTROLLER' });
                } catch (error: any) {
                    this.client.logger.error(`Error creating event for operation ${op.operation_id}:`, { label: 'CONTROLLER', error: error.stack });
                    return;
                }
            } else if (event.operation_edited_date !== op.edited_date) {
                try {
                    await this.updateDiscordEvent(op, event);
                    this.client.logger.info(`Updated event ${event.event_id} for operation ${op.operation_id}`, { label: 'CONTROLLER' });
                } catch (error: any) {
                    this.client.logger.error(`Error updating event for operation ${op.operation_id}:`, { label: 'CONTROLLER', error: error.stack });
                    return;
                }
            } else {
                this.client.logger.info(`No changes for operation ${op.operation_id}`, { label: 'CONTROLLER' });
            }
        }
    }
}