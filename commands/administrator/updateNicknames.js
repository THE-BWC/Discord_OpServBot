const { Client, CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('updatenicknames')
        .setDescription('Update nicknames of all users in the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('all')
                .setDescription('Update nicknames of all users in the server')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Update nickname of a specific user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to update the nickname for')
                        .setRequired(true)
                )
        ),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply({ ephemeral: true })
            .then(async () => {
                let guild = await client.guilds.fetch(client.config.botMainDiscordServer)
                    .catch(err => {
                        client.logger.error(err.stack)
                        return { message: `ERROR - Failed to fetch WMKR Discord Server from Bot. Please verify correct Server ID in Settings file` }
                    })

                if (!guild) {
                    return { message: `ERROR - Failed to fetch WMKR Discord Server from Bot. Please verify correct Server ID in Settings file` }
                }

                if (interaction.options.getSubcommand() === 'user') {
                    // Use the discordRoles.js controller to update the nickname of a specific user
                    let user = interaction.options.getUser('user')
                    let member = await guild.members.fetch(user.id)
                        .catch(err => {
                            client.logger.error(err.stack)
                            return { message: `ERROR - Failed to fetch user from WMKR Discord Server` }
                        })
                    if (!member) {
                        return { message: `ERROR - Failed to fetch user from WMKR Discord Server` }
                    }
                    let forumUsersToDiscord = await client.xenProvider.fetchAllDiscordLinkInfo()
                    let userInfo = forumUsersToDiscord.find(user => user.discord_user_id === member.user.id)
                    if (!userInfo) {
                        return { message: `ERROR - Failed to fetch user from WMKR Discord Server` }
                    }

                    // Call the syncRole function to update the nickname
                    await client.discordRolesController.syncRole(client, userInfo.user_id)
                        .then(result => {
                            interaction.followUp({ content: result.message, ephemeral: true })
                        })

                }

                if (interaction.options.getSubcommand() === 'all') {

                    let members = await guild.members.fetch()
                    let forumUsersToDiscord = await client.xenProvider.fetchAllDiscordLinkInfo()
                    for (const member of members.values()) {
                        if (member.user.id !== member.guild.ownerId) {
                            let user = forumUsersToDiscord.find(user => user.discord_user_id === member.user.id)
                            if (user) {
                                let user_username = await client.xenProvider.fetchUsername(user.user_id)
                                let new_username = `[WMKR] ${user_username[0].username}`
                                try {
                                    await member.setNickname(new_username)
                                } catch (err) {
                                    client.logger.error(err.stack)
                                    return { message: "ERROR - Failed to set Nickname" }
                                }
                            }
                        }
                    }
                    await interaction.followUp({ content: 'Nicknames updated', ephemeral: true })
                }
            })
    }
}
