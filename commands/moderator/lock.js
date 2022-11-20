const { Client, CommandInteraction, SlashCommandBuilder, MessageEmbed} = require('discord.js');
const { omitLockdownRoles, embedColor } = require('../../settings.json');


channelsLocked = [];
message = [];

module.exports = {
    permission: ["MANAGE_CHANNELS"],
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('🔒 Locks the current channel')
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Options')
                .addChoices(
                    { name: 'Lock', value: 'lock' },
                    { name: 'Unlock', value: 'unlock' },
                    { name: 'List', value: 'list' },
                )),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {

        await interaction.deferReply()
            .then(async () => {

                const role = interaction.guild.roles.cache.map(role => role);
                const channel = interaction.guild.channels.cache
                    .filter(c => c.type === 0)
                    .filter(c => c.id === interaction.channel.id)
                    .map(channel => channel)


                if ((interaction.options.getString('options') === 'lock')) {

                    if (channelsLocked.includes(channel[0].id)) {
                        await interaction.followUp({ content: 'Channel is already locked'})
                        return;
                    }

                    const embed = new MessageEmbed()
                        .setColor(embedColor)
                        .setTitle('Channel Locked')
                        .setDescription(`🔒 ⛔ **Channel Locked** ⛔

            This channel has been locked by C&S.`)
                    await channel[0].permissionOverwrites.create(interaction.guild.roles.everyone, { SEND_MESSAGES: false })
                    for (let i = 0; i < omitLockdownRoles.length; i++) {
                        await channel[0].permissionOverwrites.create(role.find(r => r.id === omitLockdownRoles[i]), { SEND_MESSAGES: true });
                    }

                    channelsLocked.push(channel[0].id);
                    await interaction.followUp({embeds: [embed]}).then(m => message.push([channel[0].id,m]));

                    return;
                }

                if ((interaction.options.getString('options') === 'unlock' && channelsLocked.includes(channel[0].id))) {
                    await channel[0].permissionOverwrites.create(interaction.guild.roles.everyone, { SEND_MESSAGES: null })
                    for (let i = 0; i < omitLockdownRoles.length; i++) {
                        await channel[0].permissionOverwrites.create(role.find(r => r.id === omitLockdownRoles[i]), { SEND_MESSAGES: null })
                    }
                    for (let i = 0; i < message.length; i++) {
                        if (message[i][0] === channel[0].id) {
                            message[i][1].delete()
                            message.splice(i,1);
                            break;
                        }
                    }
                    for (let i = 0; i < channelsLocked.length; i++) {
                        if (channelsLocked[i] === channel[0].id) {
                            channelsLocked.splice(i,1);
                            break;
                        }
                    }
                    interaction.followUp('**Channel Unlocked**').then(m => m.delete({timeout: 6000}))
                }

                if (interaction.options.getString('options') === 'list' ) {
                    if (channelsLocked.length === 0) {
                        await interaction.followUp('**No Channels currently locked**').then(m => m.delete({timeout: 6000}))
                        return;
                    }
                    // Lock the name of the channels that are still locked.
                    await interaction.followUp(`${channelsLocked}`)
                }

                if (interaction.options.getString('options') === null) {
                    await interaction.followUp({ content: 'You need to supply an option' })
                }

            })
    }
}
