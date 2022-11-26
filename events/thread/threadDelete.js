module.exports = {
    name: 'threadDelete',
    async execute(client, thread) {
        if (client.threads.has(thread.id)) {
            await client.discordThreadsController.threadClosed(client, thread);
        }
    }
}
