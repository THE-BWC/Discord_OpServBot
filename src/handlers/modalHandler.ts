import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BWC_Client } from "../lib/index.js";

async function modalHandler(client: BWC_Client) {
    const modalsPath = fileURLToPath(new URL('../modals', import.meta.url));
    for (const folder of await readdir(modalsPath)) {
        const folderPath = join(modalsPath, folder);
        const modalFiles = await readdir(folderPath)
            .then((files) => files.filter((file) => file.endsWith('.js') || file.endsWith('.ts')));

        for (const file of modalFiles) {
            const filePath = join(folderPath, file);
            const modal = await import(filePath);

            if ('data' in modal && 'execute' in modal) {
                client.modals.set(modal.data.customId, modal);
            } else {
                client.logger.warn(`The modal at ${filePath} is missing a required "data" or "execute" property.`, { label: 'DISCORD' });
            }
        }
    }
}

export default modalHandler;