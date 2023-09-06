import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionsBitField, SlashCommandStringOption } from "discord.js";

export const data =
    new SlashCommandBuilder()
        .setName('emit')
        .setDescription('Emits a specific event')
        .addStringOption((event: SlashCommandStringOption) =>
            event.setName('event')
                .setDescription('The event to emit')
                .setRequired(true)
        )

export const permission = [PermissionsBitField.Flags.Administrator];

export async function execute(interaction: any) {
    interaction.client.emit(interaction.options.getString('event') as any, interaction);
    interaction.reply({ content: `Emitted ${interaction.options.getString('event')} event!`, ephemeral: true });
}