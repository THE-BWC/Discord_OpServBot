const { embedColor } = require('../settings.json')
const { MessageEmbed } = require('discord.js')
const client = require('../bot')

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {})

        const cmd = client.slashCommands.get(interaction.commandName)
        if (!cmd) {
            const embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(`${client.user.username} Help`, interaction.guild.iconURL())
            .setFooter(`Requested by ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL())
            .setThumbnail(client.user.avatarURL())
            .setTimestamp()
            .setTitle('Unknown Command')
            .setDescription(`Use \`/help\` to view the command list`)

            await interaction.reply({ephemeral: true, embeds: [embed] })
        }

        const args = []
        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name)
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value)
                })
            } else if (option.value) args.push(option.value)
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id)

        cmd.run(client, interaction, args)
    }

    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: fale })
        const command = client.slashCommands.get(interaction.commandName)
        if (command) command.run(client, interaction)
    }
})

// module.exports = {
// 	name: 'interactionCreate',
// 	once: false,
// 	async execute(client, interaction) {
// 		if (!interaction.isCommand()) return

//         const command = client.commands.get(interaction.commandName)

//         if (!command) {
//             const embed = new MessageEmbed()
//             .setColor(embedColor)
//             .setAuthor(`${client.user.username} Help`, interaction.guild.iconURL())
//             .setFooter(`Requested by ${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL())
//             .setThumbnail(client.user.avatarURL())
//             .setTimestamp()
//             .setTitle('Unknown Command')
//             .setDescription(`Use \`/help\` to view the command list`)

//             await interaction.reply({ephemeral: true, embeds: [embed] })
//         } else {
//             try {
//                 await command.execute(interaction)
//             } catch (err) {
//                 await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
//                 client.logger.error(err.stack)
//             }
//         }       
// 	}
// };