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
    getOpsAndInsertToDB(): Promise<void>;
    sendOpLists(): Promise<void>;
    notifyOps(): Promise<void>;
}

export interface INTDiscordNicknameController {
    setNickname(forumUserId: string): Promise<{ message: string }>;
}

export interface INTDiscordChannelController {
    getAllVoiceChannels(): Promise<{ id: string; name: string; }[]>;
}

export interface INTDiscordEventController {
    syncEvents(): Promise<void>;
    createEvent(opId: number): Promise<void>;
    updateEvent(opId: number): Promise<void>;
    deleteDiscordEvent(opId: number): Promise<void>;
}

export interface INTDiscordRolesController {
    syncRolesByForumUserId(forumUserId: string): Promise<{ message: string }>;
    syncRolesByDiscordUserId(discordUserId: string): Promise<{ message: string }>;
}