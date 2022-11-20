const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        custom_id: 'rr-modal-medical'
    },

    execute: async function (client, interaction) {
        if (interaction.customId === 'rr-modal-medical') {
            const location = interaction.fields.getTextInputValue('rr-input-location');
            const description = interaction.fields.getTextInputValue('rr-input-description');
            const voiceChannel = interaction.fields.getTextInputValue('rr-input-vc');

            const member = await client.users.fetch(interaction.member.user.id);
            const rapidResponseRole = interaction.guild.roles.cache.find(role => role.name === 'SC RR Medical');

            const embed = new EmbedBuilder()
                .setTitle('Rapid Response Requested!')
                .setDescription(`
                **Member:** ${member}
                **Location:** ${location}
                **Description:** ${description}
                **Voice Channel:** ${voiceChannel}`)
                .setColor(client.config.embedColor)
                .setTimestamp();

            interaction.reply({ content: `${rapidResponseRole}`, embeds: [embed], allowedMentions: { users: [member.id], roles: [rapidResponseRole.id] } });
        }
    }
}
