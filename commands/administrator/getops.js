const { Client, CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('getops')
        .setDescription('Get ops from DB.'),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply({ ephemeral: true })
            .then(async () => {
                await client.discordOpsecOpPosting.getOps(client)
                await interaction.followUp({ content: 'Operations acquired from DB', ephemeral: true })
            })
    }
}
