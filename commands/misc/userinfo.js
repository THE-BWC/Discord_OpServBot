const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { embedColor, creatorId, developers } = require('../../settings.json')
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays info about the user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user to lookup')
                .setRequired(true)),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply()
            .then(async () => {

                moment.locale(interaction.guild.id)

                const user = await interaction.options.getUser('user')
                const member = await interaction.guild.members.fetch(user.id);

                const role = member.roles.cache
                    .filter(role => role.id !== interaction.guild.id)
                    .map(role => role)
                    .join(" ") || "none";

                // noinspection SpellCheckingInspection
                const flags = {
                    DISCORD_EMPLOYEE: 'Discord Employee',
                    PARTNERED_SERVER_OWNER: 'Partnered Server Owner',
                    DISCORD_PARTNER: 'Discord Partner', // Deprecated
                    BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
                    BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
                    HYPESQUAD_EVENTS: 'HypeSquad Events',
                    HOUSE_BRAVERY: 'House of Bravery',
                    HOUSE_BRILLIANCE: 'House of Brilliance',
                    HOUSE_BALANCE: 'House of Balance',
                    EARLY_SUPPORTER: 'Early Supporter',
                    TEAM_USER: 'Team User',
                    SYSTEM: 'System',
                    VERIFIED_BOT: 'Verified Bot',
                    EARLY_VERIFIED_BOT_DEVELOPER: 'Early Verified Bot Developer',
                    VERIFIED_DEVELOPER: 'Verified Bot Developer' // Deprecated
                }

                const keyTranslations = {
                    ADMINISTRATOR: 'Administrator',
                    MANAGE_GUILD: 'Manage Server',
                    MANAGE_ROLES: 'Manage Roles',
                    MANAGE_CHANNELS: 'Manage Channels',
                    MANAGE_MESSAGES: 'Manage Messages',
                    MANAGE_WEBHOOKS: 'Manage Webhooks',
                    MANAGE_NICKNAMES: 'Manage Nicknames',
                    MANAGE_EMOJIS: 'Manage Emojis',
                    KICK_MEMBERS: 'Kick Members',
                    BAN_MEMBERS: 'Ban Members',
                    VIEW_AUDIT_LOG: 'View Audit Log',
                    VIEW_GUILD_INSIGHTS: 'View Guild Insights',
                    MENTION_EVERYONE: 'Mention Everyone'
                }

                let acknowledge;
                // noinspection JSCheckFunctionSignatures
                if (member.permissions.has('MANAGE_ROLES' || 'MANAGE_CHANNELS' || 'MANAGE_GUILD' || 'MANAGE_MESSAGES' || 'MANAGE_NICKNAMES' || 'MANAGE_WEBHOOKS' || 'MANAGE_EMOJIS')) acknowledge = "Server Moderator";
                if (member.permissions.has('ADMINISTRATOR')) acknowledge = "Server Administrator";
                if (member.user.id === interaction.guild.ownerId) acknowledge = "Server Owner";

                let botCreator = "";
                if (member.user.id === creatorId) botCreator = "**Bot Creator**";

                const membersJoinedTimestamp = interaction.guild.members.cache
                    .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                    .map(member => member)

                let joinPosition;
                for (let i = 1; i < membersJoinedTimestamp.length; i++) {
                    if (membersJoinedTimestamp[i - 1].id === member.id) joinPosition = i;
                }

                let status;
                if (!member.presence) {
                    status = "offline"
                } else {
                    status = `${member.presence.status.charAt(0).toUpperCase() + member.presence.status.slice(1)}`
                }

                let embed = new MessageEmbed()
                    .setColor(embedColor)
                    .setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))
                    .setAuthor({
                        name: member.user.tag,
                        iconURL: member.user.displayAvatarURL({
                            format: "png",
                            dynamic: true,
                            size: 128
                        })
                    })

                    .addField(
                        `**Member Information:**`,
                        `**Display Name:**\n <@${member.user.id}>
                        **Join Position:** ${joinPosition}
                        **Joined at:**\n ${moment(member.joinedTimestamp).format('Do MMMM YYYY HH:mm:ss')}`, true)
                    .addField(
                        `**User Information:**`,
                        `**ID:** ${member.user.id}
                        **Discord Tag:** ${member.user.discriminator}
                        **Status:** ${status}
                        **Created at:**\n ${moment(member.user.createdAt).format('Do MMMM YYYY HH:mm:ss')}`, true
                    )

                if (member.user.flags !== null) {
                    const memberFlags = member.user.flags.toArray();
                    if (memberFlags.length > 0)
                        embed.addField(`**Flags: **`, memberFlags.map(flag => flags[flag]).join(', '))
                }
                embed.addField(`**Roles [${member.roles.cache.size - 1}]:**`, role, false)

                const keyPermissions = member.permissions ? member.permissions.toArray() : null;

                if (keyPermissions.some(perm => keyTranslations[perm]) && keyPermissions.length > 0)
                    embed.addField(`**Key Permissions:**`, keyPermissions.filter(perm => keyTranslations[perm]).map(perm => keyTranslations[perm]).join(', '), false)
                if (developers.some(dev => dev === member.user.id))
                    embed.setTitle(`**Bot Team:** Developer`);
                if (acknowledge)
                    embed.addField(`**Acknowledgements:**`, `${botCreator ? botCreator + ',' : ''} ${acknowledge}`, false);
                if (member.presence.activities && member.presence.activities.join(", ") !== "")
                    embed.addField('**Currently Playing**', `**Name:** ${member.presence.activities.filter(activities => activities.type !== "CUSTOM_STATUS").join(", ")}`);

                embed.setFooter({ text: member.displayName, iconURL: member.user.displayAvatarURL()})
                embed.setTimestamp()


                await interaction.followUp({embeds: [embed]})
            })
    }
}
