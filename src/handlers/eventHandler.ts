import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BWC_Client } from "../lib/index.js";

async function eventHandler(client: BWC_Client) {
    const eventsPath = fileURLToPath(new URL('../events', import.meta.url));

    // Load events from the root events folder
    await loadEventsFromFolder(client, eventsPath);

    // Load events from subfolders
    for (const folder of await readdir(eventsPath)) {
        stat(join(eventsPath, folder)).then(async (stats) => {
            if (stats.isDirectory()) {
                await loadEventsFromFolder(client, join(eventsPath, folder));
            }
        })
    }
}

async function loadEventsFromFolder(client: BWC_Client, folderPath: string) {
    const eventFiles = await readdir(folderPath)
        .then((files) => files.filter((file) => file.endsWith('.js') || file.endsWith('.ts')));

    for (const file of eventFiles) {
        const filePath = join(folderPath, file);
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