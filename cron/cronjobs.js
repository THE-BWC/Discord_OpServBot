const CronJob = require('cron').CronJob;

class CronJobs {
    // Sends operation list every day at 19:00:00 Opserv Time
    at19_oClock(client) {
        return new CronJob('00 00 19 * * *', () => {
            client.discordOpsecOpPosting.sendOpLists(client)
                .catch(err => client.logger.error(err.stack))
        }, null, true, 'America/New_York');
    }

    // Grab new Operations every 30 minutes
    every30min(client) {
        return new CronJob('0 */30 * * * *', () => {
            client.discordOpsecOpPosting.getOps(client)
                .catch(err => client.logger.error(err.stack))
        }, null, true, 'America/New_York');
    }

    // Checks every 5 minutes for any ops that require notifications to be sent.
    notify5min(client) {
        return new CronJob('0 */1 * * * *', () => {
            client.discordOpsecOpPosting.notify(client)
                .catch(err => client.logger.error(err.stack))
        }, null, true, 'America/New_York');
    }
}

module.exports = CronJobs
