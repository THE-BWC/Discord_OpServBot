import {
    ButtonInteraction,
    type ChatInputCommandInteraction, ModalSubmitInteraction,
    type RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";

export interface CommandModule {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    permission?: bigint[];

    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface ButtonModule {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    permission?: string[];
    cooldown: number;

    execute(interaction: ButtonInteraction): Promise<void>;
}

export interface ModalModule {
    data: {
        customId?: string,
        customType?: string
    };
    permission?: string[];
    cooldown: number;

    execute(interaction: ModalSubmitInteraction): Promise<void>;
}