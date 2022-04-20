const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
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
                const embed = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor([200, 0, 0])
                    .addField(`**❯ Platform:**`, process.platform, true)
                    .addField(`**❯ Uptime:**`, ms(os.uptime() * 1000, {long: true}), true)
                    .addField('\u200B', '\u200B', true)
                    .addField(`**❯ CPU:**`,
                        `Cores: ${os.cpus().length}`
                        + `\nModel: ${core.model}`
                        + `\nSpeed: ${core.speed}Mhz`)
                    .addField(`**❯ Memory:**`,
                        `Total: ${client.functions.formatBytes(process.memoryUsage().heapTotal)}`
                        + `\nUsed: ${client.functions.formatBytes(process.memoryUsage().heapUsed)}`)
                    .setTimestamp()

                await interaction.followUp({embeds: [embed]})
            })
    }
};
