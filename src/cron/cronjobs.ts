// @ts-ignore
import { CronJob } from "cron";
import { BWC_Client } from "../lib/index.js";

export function archive10Min(client: BWC_Client) {
    return new CronJob('0 */10 * * * *', async () => {
        await client.threadController.archiveExpiredThreads()
            .catch((err: Error) => client.logger.error('Error archiving threads', { label: 'CRON', error: err.stack }));
    }, null, true, 'America/New_York');
}