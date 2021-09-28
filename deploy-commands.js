const { registerCommands } = require('./util/registerCommands')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, botMainDiscordServer} = require('./settings.json');
require('dotenv').config();

const commands = [];
async function functionWrapper() {
    await registerCommands(__dirname, './commands', true)
    .then(command => {
        commands.push(command)
        commands.push({
            name: 'test',
            description: "Testing unknown command",
            options: [],
            default_permission: undefined
        })
    })

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(clientId, botMainDiscordServer), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
}
functionWrapper()