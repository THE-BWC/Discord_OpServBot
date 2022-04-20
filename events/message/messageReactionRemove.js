module.exports = {
    name: "messageReactionRemove",
    async execute(client, reaction, user) {
        //noinspection Duplicates
        const roleChannel = '893031594728779787'

        const arma3Role = reaction.message.guild.roles.cache.find(role => role.name === "A3")

        if (reaction.message.channel.id === roleChannel) {
            if (reaction.emoji.name === "arma3") {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(arma3Role)
            }
        }
    }
}
