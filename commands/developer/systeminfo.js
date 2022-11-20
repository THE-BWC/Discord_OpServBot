const { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const os = require('os');
const ms = require('ms');

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('systeminfo')
        .setDescription('system info of the server the bot is operating on'),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        await interaction.deferReply()
            .then(async () => {

                const core = os.cpus()[0];
                const embed = new EmbedBuilder()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor([200, 0, 0])
                    .addFields(
                        { name: `**❯ Platform:**`, value: process.platform, inline: true },
                        { name: `**❯ Uptime:**`, value: ms(os.uptime() * 1000, {long: true}), inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: `**❯ CPU:**`, value: `Cores: ${os.cpus().length}`
                                + `\nModel: ${core.model}`
                                + `\nSpeed: ${core.speed}Mhz`, inline: true },
                        { name: `**❯ Memory:**`, value: `Total: ${client.utilities.formatBytes(process.memoryUsage().heapTotal)}`
                                + `\nUsed: ${client.utilities.formatBytes(process.memoryUsage().heapUsed)}`, inline: true }
                    )
                    .setTimestamp()

                await interaction.followUp({embeds: [embed]})
            })
    }
};
