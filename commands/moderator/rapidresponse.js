const { Client, CommandInteraction, SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder} = require('discord.js');
const { ButtonStyle } = require("discord-api-types/v10");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rapidresponse')
        .setDescription('Rapid Response'),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        //const channel = interaction.options.getChannel('channel');
        const channel = interaction.guild.channels.cache.get('1040069005303631893');
        const embed = new EmbedBuilder()
            .setTitle('Rapid Response')
            .setColor(client.config.embedColor)
            .setDescription(`
            - All BWC members with OPsec clearance may request for combat, medical, or logistical assistance in the Rapid Response channel by filling out the requisite form. Any abuse or excessive spam of the channel will waive your request and may result in disciplinary action. The Rapid Response channel is a privilege, not a right.\n
            - When making an assistance request, you must be in a BWC-SC voice channel in order to coordinate with the responders. Failure to do so waives your request, as safeguarding our first responders comes first.`)
            .setTimestamp()

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rr-medical')
                    .setLabel('Medical!')
                    .setEmoji('1041065437405925489')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('rr-logistics')
                    .setLabel('Logistics!')
                    .setEmoji('1041065417147420742')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('rr-prison')
                    .setLabel('Prison!')
                    .setEmoji('1041065403545301072')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('rr-combat')
                    .setLabel('Combat!')
                    .setEmoji('1041065389452435456')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('rr-econ')
                    .setLabel('Economy!')
                    .setEmoji('1041065454338318416')
                    .setStyle(ButtonStyle.Primary)
            )

        const medicalEmoji = interaction.guild.emojis.cache.find(emoji => emoji.name === 'emergencystar');
        const logisticsEmoji = interaction.guild.emojis.cache.find(emoji => emoji.name === 'logistics');
        const prisonEmoji = interaction.guild.emojis.cache.find(emoji => emoji.name === 'prison');
        const combatEmoji = interaction.guild.emojis.cache.find(emoji => emoji.name === 'combat');
        const econEmoji = interaction.guild.emojis.cache.find(emoji => emoji.name === 'economy');

        const message = await channel.send({ embeds: [embed], components: [row] })
        await interaction.reply({ content: 'Sent!', ephemeral: true, fetchReply: true })

        await message.react(medicalEmoji)
        await message.react(logisticsEmoji)
        await message.react(prisonEmoji)
        await message.react(combatEmoji)
        await message.react(econEmoji)
    }
}
