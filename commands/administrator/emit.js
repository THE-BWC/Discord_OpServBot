const { Client, CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('emit')
        .setDescription('Emits a specific event'),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {

        //client.emit('messageUpdate', interaction.member, interaction.member)
        // let discordLink = await client.xenProvider.fetchDiscordLinkInfo(299192199843676171)
        // console.log(discordLink)
        await client.discordEventController.CreateEvent(client)
            .catch(err => client.logger.error(err.stack))
    }
}
