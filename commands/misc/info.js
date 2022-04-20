const { Client, CommandInteraction, MessageEmbed, version: djVersion } = require('discord.js');
const { version } = require('../../package.json')
const { Creator, embedColor } = require('../../settings.json')
const { duration } = require('../../functions/index')
const moment = require('moment')
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Info about the bot'),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        await interaction.deferReply()
            .then(async () => {

                moment.locale(interaction.guild.id)
                let embed = new MessageEmbed()
                    .setColor(embedColor)
                    .setAuthor({
                        name: client.user.username,
                        url: client.user.displayAvatarURL({
                            format: "png",
                            dynamic: true,
                            size: 128
                        })
                    })

                    .addField(`**❯ Bot:**`, `${client.user.tag}`, true)
                    .addField(`**❯ Creation Date:**`, `${moment(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`, true)
                    .addField(`**❯ Creator**`, `${Creator}`, true)

                    .addField(`**❯ Node.js:**`, `${process.version}`, true)
                    .addField(`**❯ Bot Version:**`, `v${version}`, true)
                    .addField(`**❯ Discord.js:**`, `v${djVersion}`, true)

                    .setFooter({ text: `Uptime: ${duration(client.uptime)}` });

                await interaction.followUp({embeds: [embed]})
            })
    }
}
