const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const { embedColor } = require('../../settings.json')

module.exports = {
    name: 'messageUpdate',
    async execute(client, oldMessage, newMessage) {
        let logChannel;

        if (await client.botProvider.fetchGuild(newMessage.guild.id, "log") === true) {
            logChannel = await client.botProvider.fetchGuild(newMessage.guild.id, "log_channel")
        }

        if (!logChannel) return;

        if (client.channels.cache.some(c => c.id === logChannel)) {
            const guildChannel = client.channels.cache.find(c => c.id === logChannel);
            if (oldMessage.content === undefined || null) return;
            if (oldMessage.author.bot === true || null || undefined) return;

            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setAuthor(`${oldMessage.author.tag}`, oldMessage.author.displayAvatarURL({format: "png", dynamic: true, size: 128}))
                .setDescription(`**Message edited in ${oldMessage.channel}** [Jump to Message](${oldMessage.url})`)
                .addField('**Before**', oldMessage.content)
                .addField('**After**', newMessage.content)

            embed.setFooter(`User ID: ${oldMessage.author.id} • ${moment().format('[Today at] hh:mma')}`)
            guildChannel.send({ embeds: [embed] })
            return;
        }
        client.logger.info(`Could not find the specified log channel. Please check that the right id is in the config file`)
    }
}
