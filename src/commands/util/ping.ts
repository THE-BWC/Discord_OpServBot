import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, ColorResolvable } from "discord.js";
import { embedColor, serverLocation } from "../../envs.js";

export const data =
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the latency of the bot');

export async function execute(interaction: any) {
    let pingInitialization = Date.now();

    interaction.deferReply()
        .then(() => {
            let ping = pingInitialization - interaction.createdTimestamp;
            let embed = new EmbedBuilder()
                .setColor(embedColor as ColorResolvable)
                .setTitle('Pong!')
                .addFields([
                    { name: '**Bot Latency:**', value: `${ping / 1000}s`, inline: true },
                    { name: '**API Latency:**', value: `${interaction.client.ws.ping / 1000}s`, inline: true },
                    { name: '**Bot Region:**', value: serverLocation, inline: true }
                ]);
            interaction.followUp({ embeds: [embed] });
        });
}