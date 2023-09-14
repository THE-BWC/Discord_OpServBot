import { Events, ThreadChannel } from 'discord.js';
import { BWC_Client } from "../../lib/index.js";

export const data = {
    name: Events.ThreadDelete
}

export async function execute(client: BWC_Client, thread: ThreadChannel) {
    if (thread.parentId === "1040069005303631893") {
        await client.threadController.removeThread(thread);
    }
}