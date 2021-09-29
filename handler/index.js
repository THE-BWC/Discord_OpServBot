const { Client } = require('discord.js')
const { glob } = require('glob')
const { promisify } = require('util')

const globPromise = promisify(glob)

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`)
    // commandFiles.map((value) => {
    //     const file = require(value)
    //     const splitted = value.split('/')
    //     const directory = splitted[splitted.length - 2]
    
    //     if (file.name) {
    //         const properties = { directory, ...file }
    //         client.commands.set(file.name, properties)
    //     }
    // });

    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`)
    eventFiles.map((event) => require(event))

    const slashCommands = await globPromise(
        `${process.cwd()}/commands/**/*.js`
    )

    const arrayOfSlashCommands = []
    slashCommands.map((value) => {
        const file = require(value)
        if (!file?.name) return
        client.slashCommands.set(file.name, file)

        if (["MESSAGE", "USER"].includes(file.type)) delete file.desciption;
        arrayOfSlashCommands.push(file)
    })

    client.on('ready', async () => {
        await client.guilds.cache
            .get("565959084990267393")
            .commands.set(arrayOfSlashCommands)
    })
}