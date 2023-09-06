import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BWC_Client } from "../lib/index.js";

async function commandHandler(client: BWC_Client | null, deploy: boolean = false, logger: any): Promise<void | any[]> {
    const commands = [];
    const commandsPath = fileURLToPath(new URL('../commands', import.meta.url));
    for (const folder of await readdir(commandsPath)) {
        const folderPath = join(commandsPath, folder);
        const commandFiles = await readdir(folderPath)
            .then((files) => files.filter((file) => file.endsWith('.js') || file.endsWith('.ts')));

        for (const file of commandFiles) {
            const filePath = join(folderPath, file);
            const command = await import(filePath);

            if ('data' in command && 'execute' in command) {
                if (deploy) {
                    commands.push(command.data);
                } else {
                    client?.commands.set(command.data.name, command);
                }
            } else {
                if (deploy) {
                    logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
                } else {
                    client?.logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    }

    if (deploy) {
        return commands;
    }
}

export default commandHandler;