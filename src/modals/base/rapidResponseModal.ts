import {
    ChannelType,
    ColorResolvable,
    EmbedBuilder,
    ModalSubmitInteraction,
    RoleData
} from "discord.js";
import { embedColor } from "../../envs.js";
import { DiscordModalTypeEnum } from "../../interfaces/enums.interface.js";
import { BWC_Client } from "../../lib/index.js";

export const data = {
    customId: DiscordModalTypeEnum.Rapid_Response
}

export async function execute(interaction: ModalSubmitInteraction) {
    if (interaction.customId !== data.customId) return;
    const client = interaction.client as BWC_Client;

    const location = interaction.fields.getTextInputValue('location')
    const description = interaction.fields.getTextInputValue('description')
    const voiceChannel = interaction.fields.getTextInputValue('voice_channel')

    const member = await interaction.client.users.fetch(interaction.user.id);

    const role = interaction.guild?.roles.cache.find((role: RoleData) => role.name === 'SC RR Combat');
    if (!role) {
        await interaction.editReply({ content: `The required role is missing or invalid!` });
        client.logger.error('The required role is missing or invalid!', { label: 'DISCORD' });
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle('Rapid Response Requested!')
        .setDescription(`
            **Member:** ${member}
            **Location:** ${location}
            **Description:** ${description}
            **Voice Channel:** ${voiceChannel}`)
        .setColor(embedColor as ColorResolvable)
        .setTimestamp()

    const parentChannel = interaction.guild?.channels.cache.find((channel) => channel.id === interaction.channel?.id)
    if (!parentChannel || parentChannel.type !== ChannelType.GuildText) {
        await interaction.editReply({ content: `The parent channel is missing or invalid!` });
        client.logger.error('The parent channel is missing or invalid!', { label: 'DISCORD' });
        return;
    }

    const thread = await parentChannel.threads.create({
        name: `${member.username}'s Combat Rapid Response`,
        autoArchiveDuration: 1440,
        reason: 'Combat Rapid Response Requested',
        type: ChannelType.PublicThread
    })

    await thread.send({
        content: `${role}`,
        embeds: [embed],
        allowedMentions: {
            users: [member.id],
            roles: [role.id]
        }
    })

    await thread.members.add(member)

    await client.threadController.addThread(thread)

    await interaction.editReply({
        content: `Your Rapid Response Request has been created in ${thread}!`
    })
}