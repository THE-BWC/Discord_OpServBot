import { Events } from 'discord.js';
import { BWC_Client } from "../lib/index.js";

export const data = {
    name: Events.ClientReady,
    once: true
};

export async function execute(client: BWC_Client) {
    client.logger.info(`Logged in as ${client.user?.tag}!`);
}