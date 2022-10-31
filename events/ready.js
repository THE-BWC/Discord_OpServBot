module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.logger.info(`[DISCORD] - Logged in as ${client.user.tag}`);

		client.xenProvider.init(client)
			.catch(err => client.logger.error(err.stack))
		client.botProvider.init(client)
			.catch(err => client.logger.error(err.stack))
		client.botApi.init(client)
			.catch(err => client.logger.error(err.stack))

		// Log that the bot is ready to post.
		client.logger.info('[DISCORD] - Bot is online');

		// Syncs valid Operations with Discord
		client.discordEventsController.sync(client)
			.catch(err => client.logger.error(err.stack));

		// Start cron jobs for OPSEC Operation Posting.
		client.cron.at19_oClock(client).start();
		client.logger.info(`[CRONJOB] - Cron job at 19:00 started`);

		client.cron.every30min(client).start();
		client.logger.info(`[CRONJOB] - Cron job every 30 minutes started`);

		client.cron.notify5min(client).start();
		client.logger.info(`[CRONJOB] - Cron job every 5 minutes started`);

		// Grabs OPSEC Operations from Xenforo DB
		client.discordOpsecOpPosting.getOps(client)
			.catch(err => client.logger.error(err.stack));
	},
};
