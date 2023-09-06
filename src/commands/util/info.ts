import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, ColorResolvable, version as djVersion } from "discord.js";
import {embedColor, version, creatorID} from "../../envs.js";

export const data =
    new SlashCommandBuilder()
        .setName('info')
        .setDescription('Info about the bot');

export async function execute(interaction: any) {
    interaction.deferReply()
        .then(async () => {
            const client = interaction.client;
            const owner = await interaction.guild.members.fetch(creatorID);

            let embed = new EmbedBuilder()
                .setColor(embedColor as ColorResolvable)
                .setAuthor({
                    name: `${client.user.username}`,
                    url: client.user.displayAvatarURL({
                        format: 'png',
                        dynamic: true,
                        size: 128
                    })
                })
                .addFields([
                    {name: '**❯ Bot:**', value: `${client.user.tag}`, inline: true},
                    {
                        name: '**❯ Creation Date:**',
                        value: `<t:${parseInt(String(client.user.createdTimestamp / 1000), 10)}:F>`,
                        inline: true
                    },
                    {name: '**❯ Creator**', value: `${owner.user}`, inline: true},

                    {name: '**❯ Node.js:**', value: `${process.version}`, inline: true},
                    {name: '**❯ Bot Version:**', value: `v${version}`, inline: true},
                    {name: '**❯ Discord.js:**', value: `v${djVersion}`, inline: true}
                ])
                .setFooter({text: `Uptime: ${client.utilities.duration(client.uptime)}`})

            interaction.followUp({embeds: [embed]});
        });
}