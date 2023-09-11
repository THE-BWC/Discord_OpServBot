import { Client, ClientOptions, Collection } from "discord.js";
import { logger } from "./index.js";
import { utilities } from "./index.js";
import { CommandModule, ButtonModule, ModalModule, INTBotDatabaseProvider, INTUtilities } from "../types/index.js";
import { commandHandler, eventHandler, buttonHandler, modalHandler } from "../handlers/index.js";
import { BotDatabaseProvider } from "../models/bot/botProvider.js";


export default class BWC_Client extends Client {
    public logger: any;
    public utilities: INTUtilities;
    public botDatabaseProvider: INTBotDatabaseProvider;

    public commands: Collection<String, CommandModule>
    public buttons: Collection<String, ButtonModule>
    public modals: Collection<String, ModalModule>

    constructor(options: ClientOptions) {
        super(options);
        this.logger = logger;
        this.utilities = utilities;
        this.botDatabaseProvider = new BotDatabaseProvider();

        this.commands = new Collection<String, CommandModule>();
        this.buttons = new Collection<String, ButtonModule>();
        this.modals = new Collection<String, ModalModule>();

        this.loadCommands();
        this.loadButtons();
        this.loadModals();
        this.loadEvents();
    }

    private loadCommands() {
        commandHandler(this, false, null).then(() => this.logger.info(`Loaded ${this.commands.size} commands!`, { label: 'DISCORD' }));
    }

    private loadButtons() {
        buttonHandler(this).then(() => this.logger.info(`Loaded ${this.buttons.size} buttons!`, { label: 'DISCORD' }));
    }

    private loadModals() {
        modalHandler(this).then(() => this.logger.info(`Loaded ${this.modals.size} modals!`, { label: 'DISCORD' }));
    }

    private loadEvents() {
        // -1 because of the shardDisconnect event
        eventHandler(this).then(() => this.logger.info(`Loaded ${this.eventNames().length - 1} events!`, { label: 'DISCORD' }));
    }

    public getStreamerRole() {
        return "1147536903575453807";
    }

    public getBWCRole() {
        return "799033636249927690";
    }
}