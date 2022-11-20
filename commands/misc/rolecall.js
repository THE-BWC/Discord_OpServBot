const { Client, CommandInteraction, SlashCommandBuilder } = require('discord.js');
const Table = require("cli-table");

module.exports = {
    permission: ["MANAGE_ROLES"],
    data: new SlashCommandBuilder()
        .setName('rolecall')
        .setDescription('Displays all roles and the member count in each'),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    execute: async function (client, interaction, args) {
        interaction.deferReply()
            .then(() => {
                let roles = []
                roles.push(['Role Name', 'Count'], ['----------', '------'])

                let rolesSorted = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => [r.name, r.members.size]);
                rolesSorted.every(role => roles.push(role))

                let roleArray = []
                for (let role in roles) {
                    roleArray.push(roles[role])
                }

                let table = new Table({
                    chars: {
                        'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
                        'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
                        'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '',
                        'right': '', 'right-mid': '', 'middle': ''
                    },
                    colWidths: [25, 10],
                    rows: roleArray
                });


                interaction.editReply(`\`\`\`${table.toString()}\`\`\``)
            })

    }
}
