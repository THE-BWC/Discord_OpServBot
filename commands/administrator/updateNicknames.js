const { Client, CommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('updatenicknames')
        .setDescription('Update nicknames of all users in the server'),

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
            })
    }
}
