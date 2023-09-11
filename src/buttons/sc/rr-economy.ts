import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export const data = {
    customId: 'sc-rr-econ',
    name: 'Economy',
    cooldown: 10800
}

export async function execute(interaction: any) {
    if (interaction.customId !== data.customId) return;

    const modal = new ModalBuilder()
        .setCustomId('sc-rr-econ')
        .setTitle('Rapid Response Request')

    const location = new TextInputBuilder()
        .setCustomId('sc-rr-input-location')
        .setLabel('Your Location')
        .setStyle(TextInputStyle.Short)

    const description = new TextInputBuilder()
        .setCustomId('sc-rr-input-description')
        .setLabel('Quick Description')
        .setStyle(TextInputStyle.Paragraph)

    const voiceChannel = new TextInputBuilder()
        .setCustomId('sc-rr-input-voice-channel')
        .setLabel('Voice Channel')
        .setStyle(TextInputStyle.Short)

    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(location);
    const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(description);
    const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(voiceChannel);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal)
}