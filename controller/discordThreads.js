class DiscordThreadsController {
    // Sync threads in DB with threads in Discord
    async sync(client) {
        await DiscordThreadsController.#getThreadsFromDB(client)
        await DiscordThreadsController.#getUpdatedThreadsFromDiscord(client)

        // Delete threads in DB that are not in Discord
        for (const thread of client.threads.values()) {
            if (!client.threads.has(thread.id)) {
                await client.botProvider.deleteThreadEntry(thread.id)
            }
        }

        // Check if a thread is beyond the deleteAt date and if so, archive it and delete it from the DB and cache
        await this.archiveExpiredThreads(client)
    }

    async updateThreadDeleteTime(client, thread_id) {
        const thread = client.threads.get(thread_id)
        if (!thread) return
        const delete_at = new Date(Date.now() + 1000 * 60 * 60 * 3)
        await client.botProvider.updateThreadEntry(thread_id, delete_at)
        thread.delete_at = delete_at
    }

    async archiveExpiredThreads(client) {
        for (const thread of client.threads.values()) {
            if (thread.delete_at && thread.delete_at.getTime() < Date.now() && thread.id !== undefined) {
                await DiscordThreadsController.#archiveThread(client, thread)
                await this.threadClosed(client, thread)
            }
        }
    }

    async threadClosed(client, thread) {
        await client.botProvider.deleteThreadEntry(thread.id)
        client.threads.delete(thread.id)
        if (thread.parent) {
            const parent = await client.channels.fetch(thread.parent.id)
            if (parent) {
                const messages = await parent.messages.fetch({ limit: 100 })
                const message = await messages.find(m => m.id === thread.id)
                if (message) {
                    await message.delete()
                }
            }
        }
    }

    async createThread(client, thread) {
        await client.botProvider.createThreadEntry(thread.guild.id, thread.id, thread.parentId, Date.now(), Date.now() + 1000 * 60 * 60 * 3);
        client.threads.set(thread.id, {
            thread_id: thread.id,
            channel_id: thread.parentId,
            created_at: new Date(Date.now()),
            delete_at: new Date(Date.now() + 1000 * 60 * 60 * 3),
            guildId: thread.guild.id
        })
    }

    static async #getThreadsFromDB(client) {
        const threads = await client.botProvider.fetchAllThreadEntries();
        // Insert threads into cache
        for (const thread of threads) {
            client.threads.set(thread.thread_id, thread);
        }
    }

    static async #getUpdatedThreadsFromDiscord(client) {
        for (const arrayGuild of client.guilds.cache.keys()) {
            const guild = client.guilds.cache.get(arrayGuild);
            const threads = await client.botProvider.fetchGuildThreadEntries(guild.id);
            for (const thread of threads) {
                const threadExists = await guild.channels.fetch(thread.thread_id)
                if ((threadExists && threadExists.archived) || !threadExists) {
                    // delete thread from cache and DB
                    await client.botProvider.deleteThreadEntry(thread.thread_id)
                    client.threads.delete(thread.thread_id)
                }
            }
        }
    }

    // Archive thread from Discord
    static async #archiveThread(client, thread) {
        try {
            const guild = client.guilds.cache.get(thread.guildId);
            const channel = guild.channels.cache.get(thread.thread_id);
            await channel.send(`This thread has been archived and locked due to inactivity.`);
            await channel.setLocked(true);
            await channel.setArchived(true);
        } catch (err) {
            client.logger.error(err.stack);
        }
    }
}

module.exports = DiscordThreadsController;
