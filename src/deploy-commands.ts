import { REST, Routes } from 'discord.js';
import { discordClientID, discordServer, token } from "./envs.js";
import { commandHandler } from "./handlers/index.js";
import { logger } from "./lib/index.js";

const commands = await commandHandler(null, true, logger)
// const commands: never[] = []

const rest = new REST().setToken(token);

try {
    logger.info('Started refreshing application (/) commands.');

    const data = await rest.put(Routes.applicationGuildCommands(discordClientID, discordServer), { body: commands });
    // const data = await rest.put(Routes.applicationCommands(discordClientID), { body: commands });

    // const data = await rest.delete(Routes.applicationGuildCommands(discordClientID, discordServer));
    // const data = await rest.delete(Routes.applicationCommands(discordClientID));

    // @ts-ignore
    logger.info(`Successfully reloaded ${data?.length} application (/) commands.`);
} catch (error) {
    logger.error(error);
}