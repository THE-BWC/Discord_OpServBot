const { embedColor } = require('../settings.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(client, interaction) {
		if (!interaction.isCommand()) return

        const command = client.commands.get(interaction.commandName)

        if (!command) {
            const embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(`${client.user.username} Help`, interaction.guild.iconURL())
            .setFooter(`Requested by ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL())
            .setThumbnail(client.user.avatarURL())
            .setTimestamp()
            .setTitle('Unknown Command')
            .setDescription(`Use \`/help\` to view the command list`)

            await interaction.reply({ephemeral: true, embeds: [embed] })
        } else {
            try {
                await command.execute(interaction)
            } catch (err) {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
                client.logger.error(err.stack)
            }
        }       
	}
};