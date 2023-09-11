import { ChannelType, ColorResolvable, EmbedBuilder, RoleData } from "discord.js";
import { embedColor } from "../../envs.js";

export const data = {
    custom_id: 'sc-rr-combat'
}

export async function execute(interaction: any) {
    if (interaction.customId !== data.custom_id) return;

    const location = interaction.fields.getTextInputValue('sc-rr-input-location');
    const description = interaction.fields.getTextInputValue('sc-rr-input-description');
    const voiceChannel = interaction.fields.getTextInputValue('sc-rr-input-voice-channel');

    const member = await interaction.client.users.fetch(interaction.member.user.id);
    const rapidResponseRole = interaction.guild.roles.cache.find((role: RoleData) => role.name === 'SC RR Combat');

    const embed = new EmbedBuilder()
        .setTitle('Rapid Response Requested!')
        .setDescription(`
            **Member:** ${member}
            **Location:** ${location}
            **Description:** ${description}
            **Voice Channel:** ${voiceChannel}`)
        .setColor(embedColor as ColorResolvable)
        .setTimestamp()

    const thread = await interaction.channel.threads.create({
        name: `${member.username}'s Combat Rapid Response`,
        autoArchiveDuration: 1440,
        reason: 'Combat Rapid Response Requested',
        type: ChannelType.PublicThread
    });

    await thread.send({
        content: `${rapidResponseRole}`,
        embeds: [embed],
        allowedMentions: {
            users: [member.id],
            roles: [rapidResponseRole.id]
        }
    });

    await thread.members.add(member);

    await interaction.client.discordThreadsController.createThread(interaction.client, thread);

    await interaction.reply({
        content: `Your Rapid Response Request has been created in ${thread}!`,
        ephemeral: true
    })
}