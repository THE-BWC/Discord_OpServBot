const { Client, EmbedBuilder, CommandInteraction, SlashCommandBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays info about the guild!'),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply()
            .then(async () => {

                const filterLevels = {
                    DISABLED: 'off',
                    MEMBERS_WITHOUT_ROLES: 'No Role',
                    ALL_MEMBERS: 'Everyone'
                };

                const verificationLevels = {
                    NONE: 'None',
                    LOW: 'Low',
                    MEDIUM: 'Medium',
                    HIGH: '(╯°□°）╯︵ ┻━┻',
                    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
                };

                const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role);
                const members = interaction.guild.members.cache;
                const owner = await interaction.guild.members.fetch(interaction.guild.ownerId)
                const channels = interaction.guild.channels.cache;
                const emojis = interaction.guild.emojis.cache;
                const Tonline = client.emojis.cache.find(emoji => emoji.name === "Tonline")
                const Tidle = client.emojis.cache.find(emoji => emoji.name === "Tidle")
                const Tdnd = client.emojis.cache.find(emoji => emoji.name === "Tdnd")
                const Toffline = client.emojis.cache.find(emoji => emoji.name === "Toffline")
                let fields = [];

                fields.push({
                    name: 'General',
                    value:
                        `**❯ Name:** ${interaction.guild.name}
                        **❯ ID:** ${interaction.guild.id}
                        **❯ Owner:** ${owner.user.tag} (${owner.id})
                        **❯ Boost Tier:** ${interaction.guild.premiumTier ? `Tier ${interaction.guild.premiumTier}` : 'None'}
                        **❯ Explicit Filter:** ${filterLevels[interaction.guild.explicitContentFilter]}
                        **❯ Verification Level:** ${verificationLevels[interaction.guild.verificationLevel]}
                        **❯ Time Created:** ${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} ${moment(interaction.guild.createdTimestamp).fromNow()}`,
                    inline: true
                },
                {
                    name: 'Statistics',
                    value:
                        `**❯ Role Count:** ${roles.length}
                        **❯ Emoji Count:** ${emojis.size}
                        **❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}
                        **❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}
                        **❯ Member Count:** ${interaction.guild.memberCount}
                        **❯ Humans:** ${members.filter(member => !member.user.bot).size}
                        **❯ Bots:** ${members.filter(member => member.user.bot).size}
                        **❯ Text Channels:** ${channels.filter(channel => channel.type === 0).size}
                        **❯ Voice Channels:** ${channels.filter(channel => channel.type === 2).size}
                        **❯ Boost Count:** ${interaction.guild.premiumSubscriptionCount || '0'}`
                    ,
                    inline: true
                })

                let memberOffline = []
                let memberOther = [];

                members.each(member => {
                    if (member.presence !== null) memberOther.push(member.presence)
                    if (member.presence === null) memberOffline.push(member.presence)
                })

                fields.push({
                    name: 'Presence',
                    value: `${Tonline} Online: ${memberOther.filter(member => member.status === 'online').length} |${Tidle} Idle: ${memberOther.filter(member => member.status === 'idle').length} | ${Tdnd} Do Not Disturb: ${memberOther.filter(member => member.status === 'dnd').length} | ${Toffline} Offline: ${memberOffline.length}`,
                    inline: false
                })

                if (roles.length > 40) {
                    let chunkedRoles = client.utilities.chunkArray(roles, 40)
                    fields.push({
                        name: `Roles [${roles.length - 1}]`,
                        value: `${chunkedRoles[0].join(' ')}`
                    })
                    for (let i = 1; i < chunkedRoles.length; i++) {
                        fields.push({
                            name: `Roles Continued`,
                            value: `${chunkedRoles[i].join(' ')}`
                        })
                    }
                } else {
                    fields.push({
                        name: `Roles [${roles.length - 1}]`,
                        value: `${roles.length ? roles.join(" ") : 'None'}`
                    })
                }

                let embed = new EmbedBuilder()
                    .setDescription(`**Guild information for __${interaction.guild.name}__**`)
                    .setColor(client.config.embedColor)
                    .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                    .addFields(fields)
                    .setTimestamp();

                await interaction.followUp({embeds: [embed]})
            })
    }
}
