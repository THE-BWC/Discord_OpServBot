import { DiscordChannelTypeEnum } from "./enums.interface.js";
import {
    DiscordChannelModel,
    OperationModel,
    DiscordEventModel
} from "../database/models/bot/index.js";
import {
    XenOpservOperationModel,
    XenUserModel,
    XenDiscordUserLinks,
    XenDiscordKeyRoles
} from "../database/models/xen/index.js";

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
    getChannelsByGameIdAndGuild(gameId: number, guildId: string): Promise<DiscordChannelModel[]>;
    addChannel(channelId: string, type: DiscordChannelTypeEnum, guildId: string): Promise<DiscordChannelModel>;
    updateChannel(channelId: string, type: DiscordChannelTypeEnum, guildId: string): Promise<[affectedCount: number]>;
    deleteChannel(channelId: string): Promise<any>;
    deleteAllChannels(): Promise<any>;
}

export interface INTOperationService {
    getAllOperations(): Promise<OperationModel[]>;
    getOperationsByGameId(gameId: number): Promise<OperationModel[]>;
    insertOperations(operations: OperationModel[]): Promise<OperationModel[]>;
    deleteOperations(operationIds: number[]): Promise<number>;
    setOperationNotificationStatus(operationId: number, isNotified: boolean): Promise<[affectedCount: number]>;
}

export interface INTEventService {
    getEventByOpId(opId: number): Promise<DiscordEventModel | null>;
    getAllEvents(): Promise<DiscordEventModel[]>;
    addEvent(event_id: string, opId: number, opEditedDate: number, guildId: string): Promise<DiscordEventModel>;
    updateEvent(opId: number, opEditedDate: number): Promise<[affectedCount: number]>;
    deleteEvent(opId: number): Promise<number>;
}

export interface INTXenOperationService {
    getUpcomingOperations(): Promise<XenOpservOperationModel[]>;
    getUpcomingOpsecOperations(): Promise<XenOpservOperationModel[]>;
    getOperationByOpId(opId: number): Promise<XenOpservOperationModel | null>;
}

export interface INTXenUserService {
    getUserByUsername(username: string): Promise<XenUserModel | null>;
    getUserByUserId(userId: string): Promise<XenUserModel | null>;
    getUserGroupsByUserId(userId: string): Promise<XenUserModel | null>;
}

export interface INTXenDiscordService {
    getAllDiscordLinkInfo(): Promise<XenDiscordUserLinks[]>;
    getDiscordLinkInfoByForumUserId(userId: string): Promise<XenDiscordUserLinks | null>;
    getDiscordKeyRoleByRoleName(roleName: string): Promise<XenDiscordKeyRoles | null>;
    getAllDiscordKeyRoles(): Promise<XenDiscordKeyRoles[]>;
    setDiscordLinkInfoByForumUserId(userId: number, discordUserId: string, discordUsername: string, discordDiscrim: string): Promise<XenDiscordUserLinks | null>;
}