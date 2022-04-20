const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedColor } = require('../../settings.json')
const { duration } = require('../../functions')

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
                let embed = new MessageEmbed()
                    .setColor(embedColor)
                    .setTitle('Uptime!')
                    .setDescription(`I have been online for: ${duration(client.uptime)}`)


                await interaction.followUp({embeds: [embed]})
            })
    }
}
