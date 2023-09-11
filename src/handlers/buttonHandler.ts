import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BWC_Client } from "../lib/index.js";

async function buttonHandler(client: BWC_Client): Promise<void> {
    const buttonsPath = fileURLToPath(new URL('../buttons', import.meta.url));
    for (const folder of await readdir(buttonsPath)) {
        const folderPath = join(buttonsPath, folder);
        const buttonFiles = await readdir(folderPath)
            .then((files) => files.filter((file) => file.endsWith('.js') || file.endsWith('.ts')));

        for (const file of buttonFiles) {
            const filePath = join(folderPath, file);
            const button = await import(filePath);

            if ('data' in button && 'execute' in button) {
                client.buttons.set(button.data.customId, button);
            } else {
                client.logger.warn(`The button at ${filePath} is missing a required "data" or "execute" property.`, { label: 'DISCORD' });
            }
        }
    }
}

export default buttonHandler;