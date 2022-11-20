const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require("discord.js");
const { TextInputStyle } = require("discord-api-types/v10");
module.exports = {
    data: {
        custom_id: 'rr-combat'
    },

    execute: async function (client, interaction) {
        if (interaction.customId === 'rr-combat') {
            const modal = new ModalBuilder()
                .setCustomId('rr-modal-combat')
                .setTitle('Rapid Response Request')

            const location = new TextInputBuilder()
                .setCustomId('rr-input-location')
                .setLabel('Your Location')
                .setStyle(TextInputStyle.Short)

            const description = new TextInputBuilder()
                .setCustomId('rr-input-description')
                .setLabel('Quick Description')
                .setStyle(TextInputStyle.Paragraph)

            const voiceChannel = new TextInputBuilder()
                .setCustomId('rr-input-vc')
                .setLabel('What Voice Channel you in?')
                .setStyle(TextInputStyle.Short)

            const firstActionRow = new ActionRowBuilder().addComponents(location)
            const secondActionRow = new ActionRowBuilder().addComponents(description)
            const thirdActionRow = new ActionRowBuilder().addComponents(voiceChannel)

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow)

            await interaction.showModal(modal);
        }
    }
}
