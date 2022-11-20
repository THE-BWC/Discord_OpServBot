const { Client, CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Sets the guild log channel')
        .addStringOption(channelid =>
            channelid.setName('channelid')
                .setDescription('Discord Channel ID')
                .setRequired(true)
        ),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply({ ephemeral: false })
            .then(async () => {
                const channelId = interaction.options.getString('channelid')

                await client.botProvider.setLogChannel(interaction.guild.id, channelId)

                await interaction.followUp({ content: `Log channel set` })
            })
    }
}
