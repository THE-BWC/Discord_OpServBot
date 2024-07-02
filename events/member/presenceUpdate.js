module.exports = {
    name: 'presenceUpdate',
    async execute(client, oldPresence, newPresence) {
        if (newPresence.guild.id === client.config.botMainDiscordServer) {
            let member = await newPresence.guild.members.fetch(newPresence.userId)
            if (member === undefined || member === null || member.user.bot) return;
        	
        	if (!member.roles.cache.find(role => role.id === client.config.bwcRole)) return;
            
	    	if (newPresence.activities.find(activity => activity.type === 1)) {
                member.roles.add(newPresence.guild.roles.cache.find(role => role.id === client.config.streamerRole))
            }
            if (newPresence.activities.find(activity => activity.type === 1) === undefined && member.roles.cache.find(role => role.id === client.config.streamerRole)) {
                member.roles.remove(newPresence.guild.roles.cache.find(role => role.id === client.config.streamerRole))
            }
        }
    }
}
