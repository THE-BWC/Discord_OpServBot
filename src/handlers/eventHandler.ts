import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BWC_Client } from "../lib/index.js";

async function eventHandler(client: BWC_Client) {
    const eventsPath = fileURLToPath(new URL('../events', import.meta.url));
    const eventFiles = await readdir(eventsPath)
        .then((files) => files.filter((file) => file.endsWith('.js') || file.endsWith('.ts')));

    for (const file of eventFiles) {
        const filePath = join(eventsPath, file);
        const event = await import(filePath);

        if (event.data && event.data.once) {
            client.once(event.data.name, (...args) => event.execute(client, ...args));
        } else if (event.data) {
            client.on(event.data.name, (...args) => event.execute(client, ...args));
        } else {
            client.logger.warn(`Event file found, but could not be loaded! '${file}'`, { label: 'DISCORD' });
        }
    }
}

export default eventHandler;