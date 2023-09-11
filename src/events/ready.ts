import { Events } from 'discord.js';
import { BWC_Client } from "../lib/index.js";

export const data = {
    name: Events.ClientReady,
    once: true
};

export async function execute(client: BWC_Client) {
    client.logger.info(`Logged in as ${client.user?.tag}!`, { label: 'DISCORD' });

    client.botDatabaseProvider.init(client, true, false)
        .catch((err: Error) => client.logger.error(err.stack, { label: 'DISCORD' }));

    client.logger.info(`Bot is online!`, { label: 'DISCORD' });
}