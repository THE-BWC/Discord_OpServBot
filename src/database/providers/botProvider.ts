import { BWC_Client } from "../../lib/index.js";
import { botDatabase } from "../databaseConnection.js";
import * as process from "process";
import {
    DiscordGuildModel,
    DiscordThreadModel,
    DiscordChannelModel,
    DiscordRapidResponseButtonModel
} from "../models/bot/index.js";
import { guildService, threadService, channelService } from "../services/index.js";
import {
    INTChannelService,
    INTGuildService,
    INTThreadService
} from "../../interfaces/services.interface.js";

export class BotDatabaseProvider {
    public guildService: INTGuildService;
    public threadService: INTThreadService;
    public channelService: INTChannelService;

    constructor() {
        this.guildService = guildService;
        this.threadService = threadService;
        this.channelService = channelService;
    }

    async init(client: BWC_Client, forceSync: boolean = false, alterSync: boolean = false) {

        DiscordGuildModel.hasMany(DiscordThreadModel, { foreignKey: 'guild_id' });
        DiscordThreadModel.belongsTo(DiscordGuildModel, { foreignKey: 'guild_id' });

        DiscordGuildModel.hasMany(DiscordChannelModel, { foreignKey: 'guild_id' });
        DiscordChannelModel.belongsTo(DiscordGuildModel, { foreignKey: 'guild_id' });

        DiscordGuildModel.hasMany(DiscordRapidResponseButtonModel, { foreignKey: 'guild_id' });
        DiscordRapidResponseButtonModel.hasOne(DiscordGuildModel, { foreignKey: 'guild_id' });

        DiscordChannelModel.hasMany(DiscordRapidResponseButtonModel, { foreignKey: 'channel_id' });
        DiscordRapidResponseButtonModel.belongsTo(DiscordChannelModel, { targetKey: 'channel_id', foreignKey: 'channel_id' });

        try {
            await botDatabase.authenticate()
                .then(() => client.logger.info('Connected to the database!', { label: 'DATABASE' }))
        } catch (error: any) {
            client.logger.error('Unable to connect to the database:', { label: 'DATABASE', error: error.stack });
            process.exit(1);
        }

        async function createTables( alter: boolean = false ) {
            await botDatabase.sync({ alter: alter })
        }

        if (forceSync) {
            // WARNING: This will drop all tables in the correct order and recreate them
            // This is required since the built-in sync({ force: true }) does not work
            // correctly with associations and ends up dropping the tables in the wrong order
            try {
                await DiscordRapidResponseButtonModel.drop();
                await DiscordThreadModel.drop();
                await DiscordChannelModel.drop();
                await DiscordGuildModel.drop();

                await createTables();
            } catch (error: any) {
                client.logger.error('Unable to force sync database:', { label: 'DATABASE', error: error.stack });
                process.exit(1);
            }
        } else if (alterSync) {
            try {
                await createTables(true);
            } catch (error: any) {
                client.logger.error('Unable to alter sync database:', { label: 'DATABASE', error: error.stack });
                process.exit(1);
            }
        } else {
            try {
                await createTables();
            } catch (error: any) {
                client.logger.error('Unable to sync database:', { label: 'DATABASE', error: error.stack });
                process.exit(1);
            }
        }

        // Add guilds to the database if they are not already there
        client.guilds.cache.forEach((guild) => {
            try {
                DiscordGuildModel.findOrCreate({
                    where: {
                        guild_id: guild.id
                    },
                    defaults: {
                        guild_id: guild.id,
                        log_channel_id: null,
                        created_date: Date.now()
                    }
                }).then(() => client.logger.info(`Found or Added guild ${guild.id} to the database!`, { label: 'DATABASE' }));
            } catch (error: any) {
                client.logger.error(`Unable to add guild ${guild.id} to the database:`, { label: 'DATABASE', error: error.stack });
            }
        });
    }
}