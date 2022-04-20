const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { omitLockdownChannels, omitLockdownRoles, embedColor } = require('../../settings.json');

let lockdown = false;
let message = [];

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('🔒 Lockdowns the server'),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        await interaction.deferReply()
            .then(async () => {

                const role = interaction.guild.roles.cache.map(role => role);
                const textChannels = interaction.guild.channels.cache
                    .filter(c => c.type === "GUILD_TEXT")
                    .filter((channel) => !omitLockdownChannels.includes(channel.id))
                    .map(channel => channel)

                if (lockdown === false) {
                    const embed = new MessageEmbed()
                        .setColor(embedColor)
                        .setTitle('Channel Locked')
                        .setDescription(`🔒 ⛔ **Server Lockdown** ⛔
            
                        This server has been put into lockdown.
                        Please await further info from C&S.
                        
                        ***This channel will remain locked until the issue has been dealt with***`)
                    for (let channel in textChannels) {
                        await textChannels[channel].permissionOverwrites.create(role.find(r => r.name === '@everyone'), { SEND_MESSAGES: false })
                        for (let i = 0; i < omitLockdownRoles.length; i++) {
                            await textChannels[channel].permissionOverwrites.create(role.find(r => r.id === omitLockdownRoles[i]), { SEND_MESSAGES: true })
                        }
                        await textChannels[channel].send({ embeds: [embed] }).then(m => message.push(m))
                    }

                    lockdown = true;

                    await interaction.followUp({ content: '🔒 Server Locked!' })
                    return;
                }

                if (lockdown === true) {
                    for (let channel in textChannels) {
                        await textChannels[channel].permissionOverwrites.create(role.find(r => r.name === '@everyone'), { SEND_MESSAGES: null })
                        for (let i = 0; i < omitLockdownRoles.length; i++) {
                            await textChannels[channel].permissionOverwrites.create(role.find(r => r.id === omitLockdownRoles[i]), { SEND_MESSAGES: null })
                        }
                        textChannels[channel].send({ content: '**Lockdown Lifted**' }).then(m => m.delete({timeout: 6000}))
                    }
                    for (let i = 0; i < message.length; i++) {
                        await message[i].delete()
                    }
                    message = []
                    lockdown = false;

                    await interaction.followUp({ content: '🔓 Server Unlocked!' })
                }
            })
    }
}
