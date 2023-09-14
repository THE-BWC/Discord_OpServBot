import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder, Guild, GuildEmoji,
    PermissionsBitField, SlashCommandChannelOption, SlashCommandRoleOption,
    SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder,
    Snowflake, TextChannel
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { embedColor } from "../../envs.js";
import { DiscordChannelTypeEnum } from "../../interfaces/enums.interface.js";
import { BWC_Client } from "../../lib/index.js";

export const data =
    new SlashCommandBuilder()
        .setName('rapidresponse')
        .setDescription('Rapid Response')

        // Create
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('create')
                .setDescription('Create a Rapid Response control panel')
                .addChannelOption((option: SlashCommandChannelOption) =>
                    option
                        .setName('channel_id')
                        .setDescription('The channel ID to initiate the rapid response control panel in')
                        .setRequired(true)
                )
        )

        // Delete
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('delete')
                .setDescription('Delete a Rapid Response control panel')
                .addChannelOption((option: SlashCommandChannelOption) =>
                    option
                        .setName('channel_id')
                        .setDescription('The channel ID to delete the rapid response control panel in')
                        .setRequired(true)
                )
        )

        // List
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('list')
                .setDescription('List all Rapid Response control panels')
        )


        // Button Controls
        .addSubcommandGroup((group: SlashCommandSubcommandGroupBuilder) =>
            group
                .setName('button')
                .setDescription('Rapid Response button controls')

                // Create
                .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand
                        .setName('create')
                        .setDescription('Create a Rapid Response button for a control panel')
                        .addChannelOption((option: SlashCommandChannelOption) =>
                            option
                                .setName('channel_id')
                                .setDescription('The channel ID to create the rapid response button in')
                                .setRequired(true)
                        )
                        .addStringOption((option: SlashCommandStringOption) =>
                            option
                                .setName('label')
                                .setDescription('The label of the rapid response button')
                                .setRequired(true)
                        )
                        .addStringOption((option: SlashCommandStringOption) =>
                            option
                                .setName('emoji')
                                .setDescription('The emoji of the rapid response button')
                                .setRequired(true)
                        )
                        .addRoleOption((option: SlashCommandRoleOption) =>
                            option
                                .setName('role_id')
                                .setDescription('The role that will be pinged when the rapid response button is clicked')
                                .setRequired(true)
                        )
                )

                // Delete
                .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand
                        .setName('delete')
                        .setDescription('Delete a Rapid Response button from a control panel')
                        .addChannelOption((option: SlashCommandChannelOption) =>
                            option
                                .setName('channel_id')
                                .setDescription('The channel ID to delete the rapid response button from')
                                .setRequired(true)
                        )
                        .addStringOption((option: SlashCommandStringOption) =>
                            option
                                .setName('label')
                                .setDescription('The label of the rapid response button')
                                .setRequired(true)
                        )
                )

                // Edit
                .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
                    subcommand
                        .setName('edit')
                        .setDescription('Edit a Rapid Response button from a control panel')
                        .addChannelOption((option: SlashCommandChannelOption) =>
                            option
                                .setName('channel_id')
                                .setDescription('The channel ID to edit the rapid response button from')
                                .setRequired(true)
                        )
                        .addStringOption((option: SlashCommandStringOption) =>
                            option
                                .setName('old_label')
                                .setDescription('The label of the rapid response button that should be edited')
                                .setRequired(true)
                        )
                        .addStringOption((option: SlashCommandStringOption) =>
                            option
                                .setName('new_label')
                                .setDescription('The label of the rapid response button that should be edited')
                                .setRequired(true)
                        )
                        .addStringOption((option: SlashCommandStringOption) =>
                            option
                                .setName('new_emoji')
                                .setDescription('The emoji of the rapid response button')
                                .setRequired(true)
                        )
                        .addRoleOption((option: SlashCommandRoleOption) =>
                            option
                                .setName('new_role_id')
                                .setDescription('The role that will be pinged when the rapid response button is clicked')
                                .setRequired(true)
                        )
                )
        )




export const permission: bigint[] = [PermissionsBitField.Flags.Administrator];

export async function execute(interaction: ChatInputCommandInteraction) {

}