import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from "discord.js";
import {BWC_Client} from "../../lib/index.js";

export const data =
    new SlashCommandBuilder()
        .setName('sync')
        .setDescription('synchronize your/another user\'s roles and nickname')
        .addUserOption(option => option.setName('user').setDescription('The user to synchronize'));

export async function execute(interaction: ChatInputCommandInteraction) {
    interaction.deferReply()
        .then(() => {
            const client = interaction.client as BWC_Client;
            const user = interaction.options.getUser('user');
            if (user) {
                client.nicknameController.setNickname(user.id)
                    .then(result => {
                        interaction.followUp({ content: result.message, ephemeral: true })
                    })
                    .catch(error => {
                        interaction.followUp({ content: error.message, ephemeral: true })
                    })

                client.rolesController.syncRolesByDiscordUserId(user.id)
                    .then(result => {
                        interaction.followUp({ content: result.message, ephemeral: true })
                    })
                    .catch(error => {
                        interaction.followUp({ content: error.message, ephemeral: true })
                    })
            } else {
                client.nicknameController.setNickname(interaction.user.id)
                    .then(result => {
                        interaction.followUp({ content: result.message, ephemeral: true })
                    })
                    .catch(error => {
                        interaction.followUp({ content: error.message, ephemeral: true })
                    })

                client.rolesController.syncRolesByDiscordUserId(interaction.user.id)
                    .then(result => {
                        interaction.followUp({ content: result.message, ephemeral: true })
                    })
                    .catch(error => {
                        interaction.followUp({ content: error.message, ephemeral: true })
                    })
            }
        })
}