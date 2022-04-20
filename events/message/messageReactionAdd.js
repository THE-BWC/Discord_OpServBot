module.exports = {
    name: 'messageReactionAdd',
    async execute(client, reaction, user) {
        //noinspection Duplicates
        const roleChannel = '893031594728779787'
        const rulesChannel = '893075192367157278'

        const guestRole = reaction.message.guild.roles.cache.find(role => role.name === "Guest")
        const arma3Role = reaction.message.guild.roles.cache.find(role => role.name === "A3")

        if (reaction.message.channel.id === rulesChannel) {
            if (reaction.emoji.name === "✅") {
                await reaction.message.guild.members.cache.get(user.id).roles.add(guestRole)
            }
        }

        if (reaction.message.channel.id === roleChannel) {
            if (reaction.emoji.name === "arma3") {
                await reaction.message.guild.members.cache.get(user.id).roles.add(arma3Role)
            }
        }
    }
}
