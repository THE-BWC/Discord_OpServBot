// noinspection JSUnresolvedFunction

const { Client, CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { chunkArray } = require('../../functions')
const Table = require("cli-table");

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('getgames')
        .setDescription('Get list of games'),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply({ ephemeral: false })
            .then(async () => {
                let data = await client.xenProvider.fetchGames()
                let chunkedArray = chunkArray(data, 35);

                for (let i = 0; i < chunkedArray.length; i++) {
                    const table = new Table({
                        chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
                            'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
                            'left': '' ,'left-mid': '' ,'mid': '' ,'mid-mid': '',
                            'right': '' ,'right-mid': '' ,'middle': ''},
                        colWidths: [5, 8, 35]
                    });
                    for (let j = 0; j < chunkedArray[i].length; j++) {
                        if (j === 0) table.push(['ID','Tag','Game Name']);
                        table.push([chunkedArray[i][j].game_id, chunkedArray[i][j].tag, chunkedArray[i][j].game_name])
                    }
                    await interaction.followUp({ content: `\`\`\`${table.toString()}\`\`\`` })
                }
            })
    }
}
