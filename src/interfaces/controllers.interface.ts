import {DiscordThreadModel} from "../database/models/bot/index.js";
import {ThreadChannel} from "discord.js";

export interface INTDiscordThreadController {
    syncThreads(): Promise<void>;
    getThread(threadId: string): Promise<DiscordThreadModel>;
    addThread(thread: ThreadChannel): Promise<void>;
    removeThread(thread: ThreadChannel): Promise<void>;
    updateThreadDeleteAt(thread: ThreadChannel): Promise<void>;
    archiveExpiredThreads(): Promise<void>;
}