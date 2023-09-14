import {Collection} from "discord.js";

export interface TimeStamps extends Collection<string, number> {
    set(id: string, timestamp: number): this;
    delete(id: string): boolean;
    has(id: string): boolean;
    get(id: string): number;
}