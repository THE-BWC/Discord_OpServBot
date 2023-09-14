import { GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import { BWC_Client } from './lib/index.js';
import { isDevelopment, token, owners, botDBHost, botDBPort, botDBName, botDBUsername, botDBPassword, xenDBHost, xenDBPort, xenDBName, xenDBUsername, xenDBPassword } from './envs.js';
import { logger } from './lib/index.js';

import * as process from "process";
import dotenv from "dotenv";

if (isDevelopment) {
    dotenv.config();
}

if (!token) {
    logger.error('You forgot to enter your Discord token! You can get this token from the following page: https://discordapp.com/developers/applications/');
    process.exit(42);
}

if (!owners) {
    logger.error('You have to supply at least one owner ID, separated by commas if there are multiple owners!');
    process.exit(42);
}

if (!botDBHost || !botDBPort || !botDBName || !botDBUsername || !botDBPassword) {
    logger.error('[BOT DB] You forgot to enter your bot database credentials!');
    process.exit(42);
}

if (!xenDBHost || !xenDBPort || !xenDBName || !xenDBUsername || !xenDBPassword) {
    logger.error('[XEN DB] You forgot to enter your xenforo database credentials!');
    process.exit(42);
}

const client: BWC_Client = new BWC_Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [
        Partials.GuildMember,
        Partials.Reaction,
        Partials.User,
        Partials.Message,
    ],
    presence: {
        activities: [{
            name: 'OpServ',
            type: ActivityType.Watching
        }],
        status: "online",
    }
});

client.login(token)
    .catch((err) => client.logger.error(err));