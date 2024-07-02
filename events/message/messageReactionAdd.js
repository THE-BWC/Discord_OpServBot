module.exports = {
    name: 'messageReactionAdd',
    async execute(client, reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;

        if (reaction.message.channel.id === '1040786857824358471') {
            if (reaction.emoji.name === 'emergencystar') {
                await reaction.message.guild.members.cache.get(user.id).roles.add('1041066364179316806');
            }
            if (reaction.emoji.name === 'logistics') {
                await reaction.message.guild.members.cache.get(user.id).roles.add('1041066445272010763');
            }
            if (reaction.emoji.name === 'prison') {
                await reaction.message.guild.members.cache.get(user.id).roles.add('1041066517325959288');
            }
            if (reaction.emoji.name === 'combat') {
                await reaction.message.guild.members.cache.get(user.id).roles.add('1041066631725600798');
            }
            if (reaction.emoji.name === 'economy') {
                await reaction.message.guild.members.cache.get(user.id).roles.add('1041066768321482892');
            }
        }
    }
}
