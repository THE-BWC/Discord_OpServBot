import { BWC_Client } from "../lib/index.js";
import { ThreadChannel } from "discord.js";
import { INTThread } from "../interfaces/main.interface.js";
import { DiscordChannelTypeEnum } from "../interfaces/enums.interface.js";

export default class DiscordThreadController {
    private client: BWC_Client;
    constructor(client: BWC_Client) {
        this.client = client;
    }

    /**
     * Syncs the database threads with the discord threads
     *
     * @returns {Promise<void>}
     */
    public async syncThreads() {
        try {
            await this.syncDiscordThreadsWithDBThreads();
            await this.archiveExpiredThreads();
        } catch (error: any) {
            this.client.logger.error(`Error syncing threads:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Get a thread from the database
     *
     * @param {String} threadId The thread ID to get
     *
     * @returns {Promise<DiscordThreadModel>} The thread from the database
     */
    public async getThread(threadId: string) {
        try {
            return await this.client.botDatabaseProvider.threadService.getThread(threadId);
        } catch (error: any) {
            this.client.logger.error(`Error getting thread ${threadId}:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Adds a thread to the database
     *
     * @param {ThreadChannel} thread
     *
     * @returns {Promise<void>}
     */
    public async addThread(thread: ThreadChannel) {
        const deleteAt = Date.now() + 1000 * 60 * 60 * 3;
        try {
            if (!thread || !thread.guild || !thread.parentId) {
                new Error('Thread, guild, or parent ID not found')
                return;
            }
            await this.client.botDatabaseProvider.threadService.addThread(
                thread.id,
                thread.guild.id,
                thread.parentId,
                deleteAt
            );
        } catch (error: any) {
            this.client.logger.error(`Error adding thread ${thread.id} in guild ${thread.guild.id}:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Removes a thread from the database and remove the creation message from the parent channel
     *
     * @param {ThreadChannel} thread
     *
     * @returns {Promise<void>}
     */
    public async removeThread(thread: ThreadChannel) {
        try {
            await this.client.botDatabaseProvider.threadService.deleteThread(thread.id)
                .then(() => {
                    if (thread.parent) {
                        thread.parent.messages.fetch(thread.id)
                            .then(message => {
                                message.delete();
                            })
                    }
                })
        } catch (error: any) {
            this.client.logger.error(`Error removing thread ${thread.id} in guild ${thread.guild.id}:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Updates a threads delete at time
     *
     * @param {ThreadChannel} thread
     *
     * @returns {Promise<void>}
     */
    public async updateThreadDeleteAt(thread: ThreadChannel) {
        const deleteAt = Date.now() + 1000 * 60 * 60 * 3;
        try {
            if (!thread || !thread.guild || !thread.parentId) {
                new Error('Thread, guild, or parent ID not found')
                return;
            }
            await this.client.botDatabaseProvider.threadService.updateThread(thread.id, thread.guild.id, thread.parentId, deleteAt);
        } catch (error: any) {
            this.client.logger.error(`Error updating thread ${thread.id} in guild ${thread.guild.id}:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Archive expired threads
     *
     * @returns {Promise<void>}
     */
    public async archiveExpiredThreads() {
        try {
            for (const thread of await this.getThreadsFromDB()) {
                if (thread.delete_at && thread.delete_at < Date.now().valueOf()) {
                    await this.archiveThread(thread);
                    await this.removeThread(thread)
                }
            }
        } catch (error: any) {
            this.client.logger.error(`Error archiving threads:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Get all threads from the database that match the guild ID
     * @private
     *
     * @param {String} guildId The guild ID to get threads for
     *
     * @returns {Promise<DiscordThreadModel[]>} All threads from the database
     */
    private async getThreadsFromDBByGuildId(guildId: string) {
        try {
            return await this.client.botDatabaseProvider.threadService.getThreadsByGuild(guildId);
        } catch (error: any) {
            this.client.logger.error(`Error getting threads by guild ${guildId}:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Get all threads from the database
     * @private
     *
     * @returns {Promise<DiscordThreadModel[]>} All threads from the database
     */
    private async getThreadsFromDB() {
        try {
            return await this.client.botDatabaseProvider.threadService.getThreads();
        } catch (error: any) {
            this.client.logger.error(`Error getting threads:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Syncs the database threads with the discord threads
     * @private
     *
     * @returns {Promise<void>}
     */
    private async syncDiscordThreadsWithDBThreads() {
        try {
            for (const guildKey of this.client.guilds.cache.keys()) {
                const guild = this.client.guilds.cache.get(guildKey);
                if (!guild) {
                    this.client.logger.error(`Error syncing threads:`, { label: 'CONTROLLER', error: `Guild ${guildKey} not found` });
                    continue;
                }

                // Close overdue threads and delete them from the database
                const threads = await this.getThreadsFromDBByGuildId(guild.id);
                for (const thread of threads) {
                    const threadExists = guild?.channels.cache.get(thread.thread_id);
                    if ((threadExists && (threadExists as ThreadChannel).archived) || !threadExists) {
                        await this.client.botDatabaseProvider.threadService.deleteThread(thread.thread_id);
                    }
                }

                // Add new threads to the database
                for (const channel of await this.client.botDatabaseProvider.channelService.getChannelsByTypeAndGuild(DiscordChannelTypeEnum.Rapid_Response, guild.id)) {
                    const parentChannel = guild.channels.cache.get(channel.channel_id)
                    const threadsInChannel = guild?.channels.cache.filter(channel => channel.parentId === parentChannel?.id && channel.isThread())
                    const threadsInDB = await this.getThreadsFromDBByGuildId(guild.id);
                    for (const thread of threadsInChannel.values()) {
                        if (!threadsInDB.find((dbThread: INTThread) => dbThread.thread_id === thread.id)) {
                            await this.addThread((thread as ThreadChannel));
                        }
                    }
                }


            }
        } catch (error: any) {
            this.client.logger.error(`Error syncing threads:`, { label: 'CONTROLLER', error: error.stack });
        }
    }

    /**
     * Archive thread
     * @private
     *
     * @param {INTThread} thread
     *
     * @returns {Promise<void>}
     */
    private async archiveThread(thread: INTThread) {
        try {
            const threadExists = this.client.guilds.cache.get(thread.guild_id)?.channels.cache.get(thread.thread_id);
            await (threadExists as ThreadChannel).send("This thread has been archived and locked due to inactivity.")
            await (threadExists as ThreadChannel).setLocked(true)
            await (threadExists as ThreadChannel).setArchived(true);
        } catch (error: any) {
            this.client.logger.error(`Error archiving thread ${thread.thread_id} in guild ${thread.guild_id}:`, { label: 'CONTROLLER', error: error.stack });
        }

    }
}