import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder, Guild, GuildEmoji,
    PermissionsBitField,
    SlashCommandStringOption,
    Snowflake, TextChannel
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { embedColor } from "../../envs.js";
import { DiscordChannelTypeEnum } from "../../interfaces/enums.interface.js";
import { BWC_Client } from "../../lib/index.js";


export const data =
    new SlashCommandBuilder()
        .setName('oldrapidresponse')
        .setDescription('Rapid Response')
        .addStringOption((event: SlashCommandStringOption) =>
            event.setName('channel_id')
                .setDescription('The channel ID to initiate the rapid response control panel in')
                .setRequired(true)
        )

export const permission: bigint[] = [PermissionsBitField.Flags.Administrator];

export async function execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client;

    await interaction.deferReply({ ephemeral: true })
        .then(async () => {
            const guild = interaction.guild as Guild;
            const channel = guild.channels.cache.get(<Snowflake>interaction.options.getString('channel_id'));

            if (!channel) {
                await interaction.editReply({content: `The channel ID you provided is invalid!`});
                new Error('Channel ID is invalid')
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('Rapid Response')
                .setColor(embedColor as ColorResolvable)
                .setDescription(`
            - All BWC members with OPsec clearance may request for combat, medical, or logistical assistance in the Rapid Response channel by filling out the requisite form. Any abuse or excessive spam of the channel will waive your request and may result in disciplinary action. The Rapid Response channel is a privilege, not a right.\n
            - When making an assistance request, you must be in a BWC-SC voice channel in order to coordinate with the responders. Failure to do so waives your request, as safeguarding our first responders comes first.`)
                .setTimestamp()

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('sc-rr-medical')
                        .setLabel('Medical!')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('sc-rr-logistics')
                        .setLabel('Logistics!')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('sc-rr-prison')
                        .setLabel('Prison!')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('sc-rr-combat')
                        .setLabel('Combat!')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('sc-rr-economy')
                        .setLabel('Economy!')
                        .setStyle(ButtonStyle.Primary)
                )

            const medicalEmoji = interaction.client.emojis.cache.find((emoji: any) => emoji.name === 'emergencystar');
            const logisticsEmoji = interaction.client.emojis.cache.find((emoji: any) => emoji.name === 'logistics');
            const prisonEmoji = interaction.client.emojis.cache.find((emoji: any) => emoji.name === 'prison');
            const combatEmoji = interaction.client.emojis.cache.find((emoji: any) => emoji.name === 'combat');
            const econEmoji = interaction.client.emojis.cache.find((emoji: any) => emoji.name === 'economy');

            await (client as BWC_Client).botDatabaseProvider.channelService.addChannel(channel.id, DiscordChannelTypeEnum.Rapid_Response, channel.guild.id);

            const message = await (channel as TextChannel)?.send({embeds: [embed], components: [row]});

            await message.react((medicalEmoji as GuildEmoji));
            await message.react((logisticsEmoji as GuildEmoji));
            await message.react((prisonEmoji as GuildEmoji));
            await message.react((combatEmoji as GuildEmoji));
            await message.react((econEmoji as GuildEmoji));

            await interaction.editReply({content: `Rapid Response control panel created in ${channel}!`});
        })
        .catch(async (error: any) => {
            await interaction.editReply({content: `There was an error creating the Rapid Response control panel!`});
            (client as BWC_Client).logger.error(`Error creating Rapid Response control panel:`, { label: 'COMMAND', error: error.stack });
        })
}