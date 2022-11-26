module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        if (client.threads.has(message.channelId)) {
            await client.discordThreadsController.updateThreadDeleteTime(client, message.channelId);
        }
    }
}
