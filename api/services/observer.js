const chokidar = require('chokidar')
const { EventEmitter } = require('events')


class Observer extends EventEmitter {
    constructor() {
        super();
    }
    watchFolder(folder, client) {
        try {
            client.logger.info(`[API] - [SERVICE] - [WATCHER] - [CERTIFICATE] - Watching for folder changes on ${folder}`)
            let watcher = chokidar.watch(folder, { persistent: true })
            watcher.on('change', async filePath => {
                this.emit('cert-changed', {
                    message: filePath
                })
            })
        } catch (err) {
            client.logger.error(err.stack)
        }
    }
}

module.exports = Observer
