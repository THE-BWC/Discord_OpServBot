const { Client, CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Notify users x minutes before op'),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply({ ephemeral: true })
            .then(async () => {
                await client.discordOpsecOpPosting.notify(client)
                await interaction.followUp({content: 'Notify Command ran', ephemeral: true})
            })
    }
}
