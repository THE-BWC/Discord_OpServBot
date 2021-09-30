const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: "reactionrole",
	description: "Setup ReactionRole Embed",
	type: 'CHAT_INPUT',
	/**
	 * 
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const channel = '893031594728779787'
        const arma3 = interaction.guild.roles.cache.find(role => role.name === "A3")
        
        const arma3Emoji = client.emojis.cache.find(emoji => emoji.name === "arma3")

        let embed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('**Game Roles:**')
            .setDescription(`Once you have accepted our rules and received the ${interaction.guild.roles.cache.find(role => role.name === "Guest")} role.
            You will be able to add our game roles.

            **React with the following emotes for:**
            ${arma3Emoji} - ${arma3}`)

        let messageEmbed = await interaction.followUp({ embeds: [embed] })
        messageEmbed.react(arma3Emoji)
    }
}