import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import { BWC_Client } from "../../lib/index.js";

export default class Observer extends EventEmitter {
    constructor() {
        super();
    }

    public watchFolder(folder: string, client: BWC_Client) {
        try {
            client.logger.info(`Watching folder ${folder}`, { label: 'OBSERVER' });
            let watcher = chokidar.watch(folder, { persistent: true });
            watcher.on('change', async filePath => {
                this.emit('cert-changed', {
                    message: filePath
                })
            })
        } catch (error: any) {
            client.logger.error(`Error watching folder ${folder}`, { label: 'OBSERVER', error: error.stack });
        }
    }
}