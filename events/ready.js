module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
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
		// client.discordEventsController.sync(client)
		// 	.catch(err => client.logger.error(err.stack));

		// Start cron jobs for OPSEC Operation Posting.
		client.cron.at19_oClock(client).start();
		client.logger.info(`[CRONJOB] - Send Ops list at 19:00 - Started`);

		client.cron.getOps30min(client).start();
		client.logger.info(`[CRONJOB] - Get Ops every 30 minutes - Started`);

		client.cron.notify5min(client).start();
		client.logger.info(`[CRONJOB] - Notify every 5 minutes - Started`);

		client.cron.archive10min(client).start();
		client.logger.info(`[CRONJOB] - Archive old threads every 10 minutes - Started`);

		// Grabs OPSEC Operations from Xenforo DB
		client.discordOpsecOpPosting.getOps(client)
			.catch(err => client.logger.error(err.stack));

		client.discordThreadsController.sync(client)
			.catch(err => client.logger.error(err.stack));
	},
};
