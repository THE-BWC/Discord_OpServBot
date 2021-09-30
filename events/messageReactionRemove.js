const client = require('../bot')

client.on('messageReactionRemove', async (reaction, user) => {
    const channel = '893031594728779787'
    const arma3Role = reaction.message.guild.roles.cache.find(role => role.name === "A3")

    if (reaction.message.channel.id == channel) {
        if (reaction.emoji.name === "arma3") {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(arma3Role)
        }
    }
})