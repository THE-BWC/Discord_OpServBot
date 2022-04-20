const { Client, CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    permission: ["ADMINISTRATOR"],
    data: new SlashCommandBuilder()
        .setName('getchannel')
        .setDescription('Check whether the bot can see the assigned channel or not.'),

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args) {
        interaction.deferReply({ ephemeral: true })
            .then(async () => {
                let target_channel = interaction.client.channels.cache.get(await client.botProvider.fetchGuild(interaction.guild.id, "announcement_channel"))
                console.log(target_channel)

                if (!target_channel) {
                    await interaction.followUp({
                        content: 'No announcement channel set',
                        ephemeral: true
                    })
                }

                if (target_channel) {
                    target_channel.send("Channel Found!")
                        .then(await interaction.followUp({
                            content: 'Channel Found!',
                            ephemeral: true
                        }))
                        .catch(async (err) => {
                            if (err.message === 'Missing Access') return interaction.followUp({ content: "Can\'t see the channel boss :(\nPlease verify that I have permissions to view the respective channel."});
                            await interaction.followUp({ content: "There was an error. Could not perform the requested action. Please check your log for further info"})
                            client.logger.error(err.stack)
                        })
                }
            })
    }
}
