const { Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency of the bot'),

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	async execute(client, interaction, args) {
		let pingInitialization = Date.now()

		interaction.deferReply()
			.then(async () => {
				let ping = pingInitialization - interaction.createdTimestamp;
				let pEmbed = new EmbedBuilder()
					.setColor([200,0,0])
					.setTitle("Pong!")
					.addFields({ name: `**Latency:**`, value: `${ping}ms`, inline: true })
					.addFields({ name: `**API Latency:**`, value: `${interaction.client.ws.ping}ms`, inline: true})
					.addFields({ name: `**Bot Region:**`, value: client.config.server_location, inline: true})
				
				await interaction.followUp({ embeds: [pEmbed] })
			})
	}
}
