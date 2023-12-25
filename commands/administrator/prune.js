const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	permission: ["ADMINISTRATOR"],
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Bulk deletes messages from a channel.')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Amount of messages to delete')
				.setRequired(true)),

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	async execute(client, interaction, args) {

		await interaction.reply({ content: 'Pruning...', ephemeral: true })

		const amount = interaction.options.getInteger('amount');
		if (amount <= 1 || amount > 100) {
			return interaction.editReply({ content: 'You need to input a number between 1 and 99.' });
		}

		await interaction.channel.bulkDelete(amount, true)
			.catch(err => {
				console.error(err);
				interaction.channel.send('There was an error trying to prune messages in this channel!');
			});

		await interaction.editReply({ content: `Successfully pruned \`${amount}\` messages.` })
	}
}