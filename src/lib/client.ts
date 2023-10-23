// Basic imports
import {
    Client,
    ClientOptions,
    Collection } from "discord.js";
import { Logger } from "winston";
import { logger, utilities } from "./index.js";
import {
    buttonHandler,
    commandHandler,
    eventHandler,
    modalHandler } from "../handlers/index.js";
import * as CronJobs from "../cron/cronjobs.js";

// Database imports
import { BotDatabaseProvider } from "../database/providers/botProvider.js";
import { XenDatabaseProvider } from "../database/providers/xenProvider.js";

// Controller imports
import {
    DiscordThreadController,
    OpsecOpPostingController,
    DiscordNicknameController,
    DiscordChannelController,
    DiscordEventController,
    DiscordRolesController
} from "../controller/index.js";

// API imports
import { API } from "../api/app.js";

// Interface imports
import {
    INTBotDatabaseProvider,
    INTXenDatabaseProvider,
    INTCronJobs,
    INTUtilities,
    INTApi
} from "../interfaces/main.interface.js";
import {
    ButtonModule,
    CommandModule,
    ModalModule
} from "../interfaces/modules.interface.js";
import {
    INTDiscordChannelController,
    INTDiscordEventController,
    INTDiscordNicknameController,
    INTDiscordOpsecOpPostingController,
    INTDiscordRolesController,
    INTDiscordThreadController
} from "../interfaces/controllers.interface.js";


export default class BWC_Client extends Client {
    public logger: Logger;
    public utilities: INTUtilities;
    public cronJobs: INTCronJobs;

    public botDatabaseProvider: INTBotDatabaseProvider;
    public xenDatabaseProvider: INTXenDatabaseProvider;

    public threadController: INTDiscordThreadController;
    public opsecOpPostingController: INTDiscordOpsecOpPostingController;
    public nicknameController: INTDiscordNicknameController;
    public channelController: INTDiscordChannelController;
    public eventController: INTDiscordEventController;
    public rolesController: INTDiscordRolesController;

    public API: INTApi;

    public commands: Collection<String, CommandModule>
    public buttons: Collection<String, ButtonModule>
    public modals: Collection<String, ModalModule>

    constructor(options: ClientOptions) {
        super(options);

        this.logger = logger;
        this.utilities = utilities;
        this.cronJobs = CronJobs;

        this.botDatabaseProvider = new BotDatabaseProvider();
        this.xenDatabaseProvider = new XenDatabaseProvider();

        this.threadController = new DiscordThreadController(this);
        this.opsecOpPostingController = new OpsecOpPostingController(this);
        this.nicknameController = new DiscordNicknameController(this);
        this.channelController = new DiscordChannelController(this);
        this.eventController = new DiscordEventController(this);
        this.rolesController = new DiscordRolesController(this);

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

    public getMainGuildId() {
        // TODO: Return the main guild id from the database
        return "565959084990267393";
    }

    public getStreamerRole() {
        // TODO: Return the streamer role id from the database
        return "1147536903575453807";
    }

    public getBWCRole() {
        // TODO: Return the BWC role id from the database
        return "799033636249927690";
    }
}