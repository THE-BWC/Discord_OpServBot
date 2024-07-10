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
					.addField(`**Bot Latency:**`, `${ping / 1000}s`, true)
					.addField(`**API Latency:**`, `${interaction.client.ws.ping / 1000}s`, true)
					.addField(`**Bot Region:**`, client.config.server_location, true)
				
				await interaction.followUp({ embeds: [pEmbed] })
			})
	}
}
