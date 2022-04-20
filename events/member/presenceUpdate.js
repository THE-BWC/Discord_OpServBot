module.exports = {
    name: 'presenceUpdate',
    async execute(client, oldPresence, newPresence) {
        if (newPresence.guild.id === client.config.settings_guildId_dev2) {
            let member = await newPresence.guild.members.fetch(newPresence.userId)
            if (newPresence.activities.find(activity => activity.type === 'STREAMING')) {
                member.roles.add(newPresence.guild.roles.cache.find(role => role.id === client.config.streamerRole))
            }
            if (newPresence.activities.find(activity => activity.type === 'STREAMING') === undefined && member.roles.cache.find(role => role.id === client.config.streamerRole)) {
                member.roles.remove(newPresence.guild.roles.cache.find(role => role.id === client.config.streamerRole))
            }
        }
    }
}
