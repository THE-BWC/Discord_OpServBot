// Basic imports
import { Client, ClientOptions, Collection } from "discord.js";
import { Logger } from "winston";
import { logger, utilities } from "./index.js";
import { buttonHandler, commandHandler, eventHandler, modalHandler } from "../handlers/index.js";
import * as CronJobs from "../cron/cronjobs.js";

// Database imports
import { BotDatabaseProvider } from "../database/providers/botProvider.js";

// Controller imports
import { DiscordThreadController } from "../controller/index.js";

// API imports
import { API } from "../api/app.js";

// Interface imports
import {
    INTBotDatabaseProvider,
    INTCronJobs,
    INTUtilities
} from "../interfaces/main.interface.js";
import { ButtonModule, CommandModule, ModalModule } from "../interfaces/modules.interface.js";
import { INTDiscordThreadController } from "../interfaces/controllers.interface.js";


export default class BWC_Client extends Client {
    public logger: Logger;
    public utilities: INTUtilities;
    public cronJobs: INTCronJobs;

    public botDatabaseProvider: INTBotDatabaseProvider;

    public threadController: INTDiscordThreadController;

    public API: any;

    public commands: Collection<String, CommandModule>
    public buttons: Collection<String, ButtonModule>
    public modals: Collection<String, ModalModule>

    constructor(options: ClientOptions) {
        super(options);

        this.logger = logger;
        this.utilities = utilities;
        this.cronJobs = CronJobs;

        this.botDatabaseProvider = new BotDatabaseProvider();

        this.threadController = new DiscordThreadController(this);

        this.API = new API();

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