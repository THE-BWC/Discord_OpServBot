const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: "ping",
	description: "Returns websocket ping",
	type: 'CHAT_INPUT',
	/**
	 * 
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		interaction.followUp({ content: `${client.ws.ping}ms!` })
	}
}

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('ping')
// 		.setDescription('Replies with Pong!'),
// 	async execute(interaction) {
// 		await interaction.reply('Pong!');
// 	},
// };
