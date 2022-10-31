const { Client, MessageEmbed, CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
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

                let embed = new MessageEmbed()
                    .setDescription(`**Guild information for __${interaction.guild.name}__**`)
                    .setColor(client.settings.embedColor)
                    .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                    .addField('General',
                        `**❯ Name:** ${interaction.guild.name} | ID: ${interaction.guild.id}\n` +
                        `**❯ Owner:** ${owner.user.username} | ID: ${interaction.guild.ownerId}\n` +
                        `**❯ Boost Tier:** ${interaction.guild.premiumTier ? `Tier ${interaction.guild.premiumTier}` : 'None'}\n` +
                        `**❯ Explicit Filter:** ${filterLevels[interaction.guild.explicitContentFilter]}\n` +
                        `**❯ Verification Level:** ${verificationLevels[interaction.guild.verificationLevel]}\n` +
                        `**❯ Time Created:** ${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} ${moment(interaction.guild.createdTimestamp).fromNow()}`
                        ,)
                    .addField('Statistics',
                        `**❯ Role Count:** ${roles.length}\n` +
                        `**❯ Emoji Count:** ${emojis.size}\n` +
                        `**❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}\n` +
                        `**❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}\n` +
                        `**❯ Member Count:** ${interaction.guild.memberCount}\n` +
                        `**❯ Humans:** ${members.filter(member => !member.user.bot).size}\n` +
                        `**❯ Bots:** ${members.filter(member => member.user.bot).size}\n` +
                        `**❯ Text Channels:** ${channels.filter(channel => channel.type === 'GUILD_TEXT').size}\n` +
                        `**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'GUILD_VOICE').size}\n` +
                        `**❯ Boost Count:** ${interaction.guild.premiumSubscriptionCount || '0'}\n`
                        ,)
                    .setTimestamp();

                let memberOffline = []
                let memberOther = [];

                members.each(member => {
                    if (member.presence !== null) memberOther.push(member.presence)
                    if (member.presence === null) memberOffline.push(member.presence)
                })

                embed.addField('Presence',
                    `${Tonline} Online: ${memberOther.filter(member => member.status === 'online').length} |${Tidle} Idle: ${memberOther.filter(member => member.status === 'idle').length} | ${Tdnd} Do Not Disturb: ${memberOther.filter(member => member.status === 'dnd').length} | ${Toffline} Offline: ${memberOffline.length}`
                    ,)

                if (roles.length > 45) {
                    let chunkedRoles = client.utilities.chunkArray(roles, 40)
                    embed.addField(`Roles [${roles.length - 1}]`, chunkedRoles[0].join(" "),)
                    for (let i = 1; i < chunkedRoles.length; i++) {
                        embed.addField(`Roles Continued`, chunkedRoles[i].join(" "),)
                    }
                } else {
                    embed.addField(`Roles [${roles.length - 1}]`, roles.length ? roles.join(" ") : 'None',)
                }

                await interaction.followUp({embeds: [embed]})
            })
    }
}
