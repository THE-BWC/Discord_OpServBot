import { BWC_Client } from "../../lib/index.js";
import { xenDatabase } from "../databaseConnection.js";
import * as process from "process";

import {
    userService,
    xenDiscordService,
    xenOperationService
} from "../services/index.js";

import {
    INTXenUserService,
    INTXenDiscordService,
    INTXenOperationService
} from "../../interfaces/services.interface.js";

export class XenDatabaseProvider {
    public xenUserService: INTXenUserService;
    public xenDiscordService: INTXenDiscordService
    public xenOperationService: INTXenOperationService;

    constructor() {
        this.xenUserService = userService;
        this.xenDiscordService = xenDiscordService;
        this.xenOperationService = xenOperationService;
    }

    async init(client: BWC_Client) {
        try {
            await xenDatabase.authenticate()
                .then(() => client.logger.info('Connected to the Xenforo database!', { label: 'DATABASE' }))
        } catch (error: any) {
            client.logger.error('Unable to connect to the Xenforo database:', { label: 'DATABASE', error: error.stack });
            process.exit(1);
        }
    }
}