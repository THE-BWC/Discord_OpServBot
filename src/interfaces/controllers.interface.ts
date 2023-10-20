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

export interface INTDiscordOpsecOpPostingController {
    getOps(): Promise<void>;
    sendOpLists(): Promise<void>;
    notifyOps(): Promise<void>;
}

export interface INTDiscordNicknameController {
    setNickname(forumUserId: string): Promise<{ message: string }>;
}