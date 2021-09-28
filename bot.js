const { Client, Intents, Collection } = require('discord.js')
const Winston = require('winston')
const { registerCommands } = require('./util/registerCommands.js')
const { registerEvents } = require('./util/registerEvents.js')
require('dotenv').config()

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: [
        "GUILD_MEMBER", 
        "MESSAGE", 
        "REACTION", 
        "USER"
    ],
    presence: {
        activities: [{
            name: 'A Moose Fight!',
            type: "WATCHING"
        }],
        status: 'online'
    }
})

// Logger:
client.logger = Winston.createLogger({
    transports: [
        new Winston.transports.File({ filename: 'moosebot.log' })
    ],
    format: Winston.format.printf((log) => `[${new Date().toLocaleString()}] - [${log.level.toUpperCase()}] - ${log.message}`)
})

if (process.env.NODE_ENV !== 'production') {
    client.logger.add(new Winston.transports.Console({
        format: Winston.format.simple()
    }))
}

client.commands = new Collection();

registerEvents(__dirname, './events', client)
    .catch(e => client.logger.error(e.stack))
registerCommands(__dirname, './commands', false, client)
    .catch(e => client.logger.error(e.stack))

client.login(process.env.TOKEN)
    .catch(err => client.logger.error(err))