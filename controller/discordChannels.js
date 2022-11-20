class DiscordChannelsController {
    async getAllVoiceChannels(client) {
        const guild = await client.guilds.fetch(client.config.settings_guildId_dev2)
        let voiceChannels = await guild.channels.cache.filter(channel => channel.type === 2)

        let formattedChannelInfo = []
        for (let channel of voiceChannels) {
            formattedChannelInfo.push({ id: channel[1].id, name: channel[1].name })
        }

        formattedChannelInfo.sort(function(a, b) {
            let textA = a.name.toUpperCase();
            let textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })

        return formattedChannelInfo
    }
}

module.exports = DiscordChannelsController
