import {
    ActionRowBuilder, ButtonInteraction,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {DiscordModalTypeEnum} from "../../interfaces/enums.interface.js";

export const data = {
    customId: DiscordModalTypeEnum.Rapid_Response,
    cooldown: 10800
}

export async function execute(interaction: ButtonInteraction) {
    if (interaction.customId !== data.customId) return;

    const modal = new ModalBuilder()
        .setCustomId(DiscordModalTypeEnum.Rapid_Response)
        .setTitle('Rapid Response Request')

    const location = new TextInputBuilder()
        .setCustomId('location')
        .setLabel('Your Location')
        .setStyle(TextInputStyle.Short)

    const description = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Quick Description')
        .setStyle(TextInputStyle.Paragraph)

    const voiceChannel = new TextInputBuilder()
        .setCustomId('voice_channel')
        .setLabel('Voice Channel')
        .setStyle(TextInputStyle.Short)

    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(location);
    const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(description);
    const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(voiceChannel);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal)
}