// const { MessageEmbed } = require('discord.js')
// const { chunkArray } = require('../functions')
// const { embedColor } = require('../settings.json')
// const { unixFormat, notifyTime } = require('../functions')

// noinspection JSUnresolvedVariable
class DiscordEventsController {
    async CreateEvent(client) {
        let data = await client.botProvider.fetchOps()
        if (data === undefined || !data.length || data.length === 0) return;

        let guildData = await client.botProvider.fetchGuild('891359038657396787')
        let guild = await client.guilds.fetch(guildData.dataValues.id)





        await guild.scheduledEvents.create({
            name: 'Name given as string',
            description: 'Description given as string',
            scheduledStartTime: new Date(1650369600*1000),
            scheduledEndTime: new Date(1650376800*1000),
            entityType: "EXTERNAL",
            privacyLevel: "GUILD_ONLY",
            reason: 'This is a reason??',
            entityMetadata: {
                location: 'Location as a string'
            }
        })

        client.logger.info(`- [FUNCTION] - CreateEvents function used`);
    }
}

module.exports = DiscordEventsController
