const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: {
        custom_id: 'rr-combat',
    },

    execute: async function (client, interaction) {
        if (interaction.customId === 'rr-combat') {
            const location = interaction.fields.getTextInputValue('rr-input-location');
            const description = interaction.fields.getTextInputValue('rr-input-description');
            const voiceChannel = interaction.fields.getTextInputValue('rr-input-vc');

            const member = await client.users.fetch(interaction.member.user.id);
            const rapidResponseRole = interaction.guild.roles.cache.find(role => role.name === 'SC RR Combat');

            const embed = new EmbedBuilder()
                .setTitle('Rapid Response Requested!')
                .setDescription(`
                    **Member:** ${member}
                    **Location:** ${location}
                    **Description:** ${description}
                    **Voice Channel:** ${voiceChannel}`)
                .setColor(client.config.embedColor)
                .setTimestamp()

            const thread = await interaction.channel.threads.create({
                name: `${member.username}'s Combat Rapid Response`,
                autoArchiveDuration: 1440,
                reason: 'Rapid Response',
                type: ChannelType.PublicThread,
            });

            await thread.send({
                content: `${rapidResponseRole}`,
                embeds: [embed],
                allowedMentions: {
                    users: [member.id],
                    roles: [rapidResponseRole.id]
                },
            });

            await thread.members.add(member);

            await client.discordThreadsController.createThread(client, thread);

            await interaction.reply({
                content: `Your Rapid Response has been created in ${thread}`,
                ephemeral: true,
            });

            // const embed = new EmbedBuilder()
            //     .setTitle('Rapid Response Requested!')
            //     .setDescription(`
            //     **Member:** ${member}
            //     **Location:** ${location}
            //     **Description:** ${description}
            //     **Voice Channel:** ${voiceChannel}`)
            //     .setColor(client.config.embedColor)
            //     .setTimestamp();
            //
            // interaction.reply({ content: `${rapidResponseRole}`, embeds: [embed], allowedMentions: { users: [member.id], roles: [rapidResponseRole.id] } });
        }
    }
}
