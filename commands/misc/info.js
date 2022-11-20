const { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder, version: djVersion } = require('discord.js');
const { version } = require('../../package.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Info about the bot'),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        await interaction.deferReply()
            .then(async () => {

                const owner = await interaction.guild.members.fetch(interaction.guild.ownerId)
                let embed = new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: client.user.username,
                        url: client.user.displayAvatarURL({
                            format: "png",
                            dynamic: true,
                            size: 128
                        })
                    })
                    .addFields(
                        { name: `**❯ Bot:**`, value: `${client.user.tag}`, inline: true },
                        { name: `**❯ Creation Date:**`, value: `<t:${parseInt(client.user.createdTimestamp / 1000, 10)}:F>`, inline: true },
                        { name: `**❯ Creator**`, value: `${owner.user.tag}`, inline: true },

                        { name: `**❯ Node.js:**`, value: `${process.version}`, inline: true },
                        { name: `**❯ Bot Version:**`, value: `v${version}`, inline: true },
                        { name: `**❯ Discord.js:**`, value: `v${djVersion}`, inline: true }
                    )
                    .setFooter({ text: `Uptime: ${client.utilities.duration(client.uptime)}` });

                await interaction.followUp({embeds: [embed]})
            })
    }
}
