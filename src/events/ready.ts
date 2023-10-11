import { Events } from 'discord.js';
import { BWC_Client } from "../lib/index.js";

export const data = {
    name: Events.ClientReady,
    once: true
};

export async function execute(client: BWC_Client) {
    client.logger.info(`Logged in as ${client.user?.tag}!`, { label: 'DISCORD' });

    const forceSync = false, alterSync = false;
    client.botDatabaseProvider.init(client, forceSync, alterSync)
        .catch((err: Error) => client.logger.error('Error initializing database:', { label: 'DATABASE', error: err.stack }));

    client.API.init(client)
        .catch((err: Error) => client.logger.error('Error initializing API:', { label: 'API', error: err.stack }));

    client.cronJobs.archive10Min(client).start();
    client.logger.info(`Archive old threads every 10 minutes - Started`, { label: 'CRON' });

    client.threadController.syncThreads()
        .catch((err: Error) => client.logger.error('Error syncing threads:', { label: 'CONTROLLER', error: err.stack }));

    client.logger.info(`Bot is online!`, { label: 'DISCORD' });
}