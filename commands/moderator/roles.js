const { Client, CommandInteraction, MessageEmbed, Message } = require('discord.js');

module.exports = {
	name: "serverroles",
	description: "Setup Role Embed",
	type: 'CHAT_INPUT',
	/**
	 * 
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const channel = '893031594728779787'

        let embed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('**Roles:**')
            .setDescription(`
            <@&893040301684437022> - Our Discord Administrators.

            <@&566259980982812692> - Community Leader.
            <@&566260057298305024> - BWC Actuals right hand.
            <@&566260088365514762> - BWC NCO leader and Actuals right hands left hand.

            <@&566259420657614887> Our Administrative Team.
            <@&566639939907878932> - The Administrative Teams Adjutants/Moderators.
            <@&893040903839703092> - The IT Team of the community.
            <@&893041083452375081> - Our Social Media Team.

            <@&798644423100858408> - Our Games Company Command Teams.
            <@&566259367133970443> - Our Games Company Staff.
            <@&566259231288852480> - Our Devoted NBR NCOs who help uphold our standards and rules.

            <@&566175011933519882> - Our BWC Members Role
            <@&566635575558406164> - Ambassadors from other communities or game representatives
            <@&799037907167346768> - Non-Members/Guests Role. Is given upon accepting our 📖│rules 

            <@&806202647006806078> - The mute/You broke the rules role.
            `)

        let messageEmbed = await interaction.followUp({ embeds: [embed] })
        messageEmbed.react(arma3Emoji)
    }
}