module.exports = {
    name: 'threadUpdate',
    async execute(client, oldThread, newThread) {
        if (oldThread.parentId === "1040786857824358471") {
            if (oldThread.locked === true && newThread.locked === false) {
                await client.discordThreadsController.createThread(client, newThread);
            }
            if (oldThread.locked === false && newThread.locked === true) {
                await client.discordThreadsController.threadClosed(client, newThread);
            }
        }
    }
}
