import { DiscordChannelModel } from "../database/models/bot/index.js";
import { DiscordChannelTypeEnum } from "./enums.interface.js";

export interface INTGuildService {
    getGuild(guildId: string): Promise<any>;
    getGuilds(): Promise<any>;
    addGuild(guildId: string): Promise<any>;
    updateGuild(guildId: string, data: any): Promise<any>;
    deleteGuild(guildId: string): Promise<any>;
    deleteAllGuilds(): Promise<any>;
}

export interface INTThreadService {
    getThread(threadId: string): Promise<any>;
    getThreads(): Promise<any>;
    getThreadsByGuild(guildId: string): Promise<any>;
    addThread(threadId: string, guildId: string, channelId: string, deleteAt: number): Promise<any>;
    updateThread(threadId: string, guildId: string, channelId: string, deleteAt?: number): Promise<any>;
    deleteThread(threadId: string): Promise<any>;
    deleteAllThreads(): Promise<any>;
}

export interface INTChannelService {
    getChannel(channelId: string): Promise<DiscordChannelModel | null>;
    getChannels(): Promise<DiscordChannelModel[]>;
    getChannelsByTypeAndGuild(type: DiscordChannelTypeEnum, guildId: string): Promise<DiscordChannelModel[]>;
    addChannel(channelId: string, type: DiscordChannelTypeEnum, guildId: string): Promise<DiscordChannelModel>;
    updateChannel(channelId: string, type: DiscordChannelTypeEnum, guildId: string): Promise<[affectedCount: number]>;
    deleteChannel(channelId: string): Promise<any>;
    deleteAllChannels(): Promise<any>;
}