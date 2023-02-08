const { Client, CommandInteraction, SlashCommandBuilder } = require('discord.js')
const Table = require('cli-table')

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('setgamechannel')
        .setDescription('Sets a games annoucement channel for OpServ OPSEC announcements')
        .addStringOption(gameid =>
            gameid.setName('gameid')
                .setDescription('Opserv Game ID')
                .setRequired(true)
        )
        .addStringOption(channelid =>
            channelid.setName('channelid')
                .setDescription('Discord Channel ID')
                .setRequired(true)
        ),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply({ ephemeral: false })
            .then(async () => {
                const gameId = interaction.options.getString('gameid')
                const channelId = interaction.options.getString('channelid')

                await client.botProvider.createGameChannelEntry(interaction.guild.id, gameId, channelId)

                let gameChannels = await client.botProvider.fetchGameChannels(interaction.guild.id)
                let gameInfo = await client.xenProvider.fetchGames()
                let games = []

                for (let id in gameChannels) {
                    let data = gameInfo.find(r => r.game_id === parseInt(gameChannels[id].game_id))
                    data.channel_id = gameChannels[id].channel_id
                    games.push(data)
                }

                const table = new Table({
                    chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
                        'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
                        'left': '' ,'left-mid': '' ,'mid': '' ,'mid-mid': '',
                        'right': '' ,'right-mid': '' ,'middle': ''},
                    colWidths: [10, 8]
                })

                table.push(['Game ID', 'TAG', 'Channel ID'])
                for (let game in games) {
                    table.push([games[game].game_id, games[game].tag, games[game].channel_id])
                }

                await interaction.followUp({ content: `\`\`\`${table.toString()}\`\`\`` })
            })
    }
}
