import {BWC_Client} from "../lib/index.js";
import {INTChannelService, INTGuildService, INTThreadService} from "./services.interface.js";
import {DiscordChannelTypeEnum, DiscordModalTypeEnum} from "./enums.interface.js";


export interface INTUtilities {
    chunkNumber(number: number, n: number): number[];
    chunkArray<T>(array: { length: number; slice: (arg0: number, arg1: any) => any; }, size: number): T[][];
    unixFormat(unix: number): string;
    duration(ms: number): string;
    notifyTime(ms: number): string;
}

export interface INTCronJobs {
    archive10Min(client: BWC_Client): any;
}

export interface INTBotDatabaseProvider {
    init(client: BWC_Client, forceSync?: boolean, alterSync?: boolean): Promise<void>;
    guildService: INTGuildService;
    threadService: INTThreadService;
    channelService: INTChannelService;
}

export interface INTThread {
    id: string;
    thread_id: string;
    guild_id: string;
    channel_id: string;
    created_date: number;
    delete_at: number;
}

export interface INTDiscordChannel {
    id: number;
    channel_id: string;
    type: DiscordChannelTypeEnum;
    guild_id: string;
    created_date: number;
}

export interface INTRapidResponseButton {
    id: number;
    label: string;
    emoji: string;
    role_id: string;
    modal_type: DiscordModalTypeEnum;
    channel_id: string;
    guild_id: string;
    created_date: number;
}