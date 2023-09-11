import {
    type RESTPostAPIChatInputApplicationCommandsJSONBody,
    type ChatInputCommandInteraction, Collection,
} from 'discord.js';
import {BWC_Client} from "../lib/index.js";

export interface CommandModule {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    permission?: bigint[];
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface ButtonModule {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    permission?: string[];
    cooldown: number;
    execute(interaction: any): Promise<void>;
}

export interface ModalModule {
    data: any;
    permission?: string[];
    cooldown: number;
    execute(client: any, ...args: any[]): Promise<void>;
}

export interface TimeStamps extends Collection<string, number> {
    set(id: string, timestamp: number): this;
    delete(id: string): boolean;
    has(id: string): boolean;
    get(id: string): number;
}

export interface INTBotDatabaseProvider {
    init(client: BWC_Client, forceSync?: boolean, alterSync?: boolean): Promise<void>;
}

export interface INTUtilities {
    chunkNumber(number: number, n: number): number[];
    chunkArray<T>(array: { length: number; slice: (arg0: number, arg1: any) => any; }, size: number): T[][];
    unixFormat(unix: number): string;
    duration(ms: number): string;
    notifyTime(ms: number): string;
}