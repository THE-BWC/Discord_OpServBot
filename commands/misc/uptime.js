const { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Displays the bots uptime'),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        console.log()
        interaction.deferReply()
            .then(async () => {
                let embed = new EmbedBuilder()
                    .setColor(client.settings.embedColor)
                    .setTitle('Uptime!')
                    .setDescription(`I have been online for: ${client.utilities.duration(client.uptime)}`)


                await interaction.followUp({embeds: [embed]})
            })
    }
}
