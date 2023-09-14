import { Events, ThreadChannel } from 'discord.js';
import { BWC_Client } from "../../lib/index.js";

export const data = {
    name: Events.ThreadUpdate
}

export async function execute(client: BWC_Client, oldThread: ThreadChannel, newThread: ThreadChannel) {
    if (oldThread.parentId === "1040069005303631893") {
        if (oldThread.locked === true && newThread.locked === false) {
            await client.threadController.addThread(newThread);
        }
        if (oldThread.locked === false && newThread.locked === true) {
            await client.threadController.removeThread(newThread);
        }
    }
}