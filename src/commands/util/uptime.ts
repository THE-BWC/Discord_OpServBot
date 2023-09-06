import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, ColorResolvable } from "discord.js";
import { embedColor } from "../../envs.js";

export const data =
    new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Displays the bots uptime');

export async function execute(interaction: any) {
    interaction.deferReply()
        .then(() => {
            let client = interaction.client;
            let embed = new EmbedBuilder()
                .setColor(embedColor as ColorResolvable)
                .setTitle('Pong!')
                .setDescription(`I have been online for: ${client.utilities.duration(client.uptime)}`)
            interaction.followUp({ embeds: [embed] });
        });
}