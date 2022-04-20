const { settings_clientId, settings_guildId } = require('./settings.json')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')
require('dotenv').config()

const commands = []
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`)
//     commands.push(command.data.toJSON())
// }

const commandFolders = fs.readdirSync('./commands')
for (const folder of commandFolders) {
    const loadedFolder = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))
    for (const file of loadedFolder) {
        const command = require(`./commands/${folder}/${file}`)
        console.log(command)
        commands.push(command.data.toJSON())
    }
}

const clientId = settings_clientId
const guildId = settings_guildId //"891359038657396787"

// noinspection JSClosureCompilerSyntax,JSCheckFunctionSignatures
const rest = new REST({ version: 9}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        // Use to register slash commands in a specific guild.
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        )

        // Use to register slash commands in all guilds.
        // await rest.put(
        //     Routes.applicationCommands(clientId),
        //     { body: commands },
        // )

        console.log('Successfully reloaded application (/) commands.')
    } catch (err) {
        console.error(err)
    }
})()
