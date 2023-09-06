import {
    type RESTPostAPIChatInputApplicationCommandsJSONBody,
    type ChatInputCommandInteraction, Collection,
} from 'discord.js';

export interface CommandModule {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    permission?: string[];
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