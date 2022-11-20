const { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
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

                const badges = {
                    1: 'Discord Staff',
                    2: 'Partnered Server Owner',
                    4: 'HypeSquad Events',
                    8: 'Bug Hunter (Level 1)',
                    64: 'House of Bravery',
                    128: 'House of Brilliance',
                    256: 'House of Balance',
                    512: 'Early Supporter',
                    1024: 'Team User',
                    16384: 'Bug Hunter (Level 2)',
                    65536: 'Verified Bot',
                    131072: 'Early Verified Bot Developer',
                    262144: 'Discord Certified Moderator',
                    4194304: 'Active Bot Developer',
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
                if (member.permissions.has('MANAGE_ROLES' || 'MANAGE_CHANNELS' || 'MANAGE_GUILD' || 'MANAGE_MESSAGES' || 'MANAGE_NICKNAMES' || 'MANAGE_WEBHOOKS' || 'MANAGE_EMOJIS')) acknowledge = "Server Moderator";
                if (member.permissions.has('ADMINISTRATOR')) acknowledge = "Server Administrator";
                if (member.user.id === interaction.guild.ownerId) acknowledge = "Server Owner";

                let botCreator = "";
                if (member.user.id === client.config.creatorId) botCreator = "**Bot Creator**";

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

                let fields = [];
                fields.push({
                    name: `**Member Information:**`,
                    value: `**Display Name:**\n <@${member.user.id}>
                        **Join Position:** ${joinPosition}
                        **Joined at:**\n ${moment(member.joinedTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
                    inline: true
                },
                {
                    name: `**User Information:**`,
                    value: `**ID:** ${member.user.id}
                        **Username:** ${member.user.username}
                        **Discriminator:** ${member.user.discriminator}
                        **Bot:** ${member.user.bot}
                        **Status:** ${status}
                        **Account Created:**\n ${moment(member.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
                    inline: true
                })

                if (member.user.flags !== null) {
                    const memberBitField = member.user.flags.bitfield;
                    if (memberBitField > 0) {
                        let flagsArray = [];
                        for (const flag in badges) {
                            if (memberBitField & flag) flagsArray.push(badges[flag]);
                        }
                        fields.push({
                            name: `**Badges: **`,
                            value: flagsArray.join(', ')
                        })
                    }
                }
                fields.push({
                    name: `**Roles [${member.roles.cache.size - 1}]:**`,
                    value: role,
                    inline: false
                })

                const keyPermissions = member.permissions ? member.permissions.toArray() : null;

                if (keyPermissions.some(perm => keyTranslations[perm]) && keyPermissions.length > 0)
                    fields.push({
                        name: `**Key Permissions:**`,
                        value: keyPermissions.filter(perm => keyTranslations[perm]).map(perm => keyTranslations[perm]).join(', '),
                        inline: false
                    })
                if (acknowledge)
                    fields.push({
                        name: `**Acknowledgements:**`,
                        value: `${botCreator ? botCreator + ',' : ''} ${acknowledge}`,
                        inline: false
                    })
                if (member.presence.activities && member.presence.activities.join(", ") !== "")
                    fields.push({
                        name: '**Currently Playing**',
                        value: `**Name:** ${member.presence.activities.filter(activities => activities.type !== 4).join(", ")}`
                    })

                let embed = new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))
                    .setAuthor({
                        name: member.user.tag,
                        iconURL: member.user.displayAvatarURL({
                            format: "png",
                            dynamic: true,
                            size: 128
                        })
                    })
                    .addFields(fields)
                    .setFooter({ text: member.displayName, iconURL: member.user.displayAvatarURL()})
                    .setTimestamp()

                if (client.config.developers.some(dev => dev === member.user.id))
                    embed.setTitle(`**Bot Team:** Developer`);

                await interaction.followUp({embeds: [embed]})
            })
    }
}
