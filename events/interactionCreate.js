const { Collection } = require('discord.js')
const cooldowns = new Map()

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(client, interaction) {
		if (interaction.isCommand()){
            const command = client.commands.get(interaction.commandName)

            if (!command) return

            // COOLDOWN HANDLER
            if (!cooldowns.has(interaction.commandName)){
                cooldowns.set(interaction.commandName, new Collection())
            }

            const currentTime = Date.now()
            const timeStamps = cooldowns.get(interaction.commandName)
            const cooldownAmount = (command.cooldown) * 1000

            if (timeStamps.has(interaction.user.id)) {
                const expirationTime = timeStamps.get(interaction.user.id) + cooldownAmount

                if (currentTime < expirationTime) {
                    const timeLeft = (expirationTime - currentTime) / 1000
                    return interaction.reply(`Please wait ${timeLeft.toFixed(1)} seconds before using ${interaction.commandName}`)
                }
            }

            timeStamps.set(interaction.user.id, currentTime)
            setTimeout(() => timeStamps.delete(interaction.user.id), cooldownAmount)

            // PERMISSIONS CHECK
            if (command.permission) {
                let author = interaction.guild.members.cache.get(interaction.user.id)
                if (!author.permissions.has(command.permission)) {
                    if (interaction.deferred) {
                        await interaction.followUp({ content: "You don't have the right permissions for this command.", ephemeral: true });
                        return
                    }
                    await interaction.reply({ content: "You don't have the right permissions for this command.", ephemeral: true });
                    return
                }
            }

            try {
                await command.execute(client, interaction)
            } catch (err) {
                if (interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                    client.logger.error(err.stack)
                    return
                }
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                client.logger.error(err.stack)
            }
        }

        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId)

            if (!button) return

            try {
                await button.execute(client, interaction)
            } catch (err) {
                if (interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this button!', ephemeral: true });
                    client.logger.error(err.stack)
                    return
                }
                await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
                client.logger.error(err.stack)
            }
        }

        if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId)

            if (!modal) return

            try {
                await modal.execute(client, interaction)
            } catch (err) {
                if (interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this modal!', ephemeral: true });
                    client.logger.error(err.stack)
                    return
                }
                await interaction.reply({ content: 'There was an error while executing this modal!', ephemeral: true });
                client.logger.error(err.stack)
            }
        }
	}
};
