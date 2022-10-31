const { Client, CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('getopslist')
        .setDescription('Get list op ops.'),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply({ ephemeral: true })
            .then(async () => {
                await client.discordOpsecOpPosting.sendOpLists(client)
                await interaction.followUp({ content: 'Op list updated' , ephemeral: true})
            })
    }
}
