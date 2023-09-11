import { botDatabase, BWC_Client, logger } from "../../lib/index.js";
import * as process from "process";
import {
    DiscordGuildModel,
    DiscordThreadModel
} from "./index.js";

export class BotDatabaseProvider {
    async init(client: BWC_Client, forceSync: boolean = false, alterSync: boolean = false) {

        DiscordGuildModel.hasMany(DiscordThreadModel, { foreignKey: 'guildId', onDelete: 'CASCADE' });
        DiscordThreadModel.belongsTo(DiscordGuildModel, { foreignKey: 'guildId' });

        try {
            await botDatabase.authenticate()
                .then(() => logger.info('Connected to the database!', { label: 'DATABASE' }))
        } catch (error: any) {
            logger.error('Unable to connect to the database:', { label: 'DATABASE', error: error.stack });
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
                await DiscordThreadModel.drop();
                await DiscordGuildModel.drop();

                await createTables();
            } catch (error: any) {
                logger.error('Unable to force sync database:', { label: 'DATABASE', error: error.stack });
                process.exit(1);
            }
        } else if (alterSync) {
            try {
                await createTables(true);
            } catch (error: any) {
                logger.error('Unable to alter sync database:', { label: 'DATABASE', error: error.stack });
                process.exit(1);
            }
        } else {
            try {
                await createTables();
            } catch (error: any) {
                logger.error('Unable to sync database:', { label: 'DATABASE', error: error.stack });
                process.exit(1);
            }
        }
    }
}