const { Collection } = require('discord.js')
const moment = require('moment')

const commandCooldown = new Map()
const buttonCooldown = new Map()

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(client, interaction) {
		if (interaction.isCommand()){
            const command = client.commands.get(interaction.commandName)

            if (!command) return

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

            // COOLDOWN HANDLER
            const currentTime = Date.now()
            const timeStamps = buttonCooldown.get(interaction.customId) || new Collection()
            const cooldownAmount = (button.data.cooldown) * 1000
            if (timeStamps.has(interaction.user.id)) {
                const expirationTime = timeStamps.get(interaction.user.id) + cooldownAmount

                if (currentTime < expirationTime) {
                    const timeLeft = (expirationTime - currentTime)
                    const time = moment.utc(timeLeft).format('HH:mm:ss')
                    return interaction.reply({ content: `Please wait ${time} before using ${button.data.name}`, ephemeral: true })
                }
            }

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

            // COOLDOWN HANDLER
            const button = client.buttons.get(interaction.customId)
            if (!buttonCooldown.has(interaction.customId)){
                buttonCooldown.set(interaction.customId, new Collection())
            }

            const currentTime = Date.now()
            const timeStamps = buttonCooldown.get(interaction.customId)
            const cooldownAmount = (button.data.cooldown) * 1000

            timeStamps.set(interaction.user.id, currentTime)
            setTimeout(() => timeStamps.delete(interaction.user.id), cooldownAmount)

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
