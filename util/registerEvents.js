const fs = require('fs').promises
const path = require('path')

async function registerEvents(main_dir, dir, client) {
    let files = await fs.readdir(path.join(main_dir, dir))
    // Loop through each file.
    for(let file of files) {
        let stat = await fs.lstat(path.join(main_dir, dir, file))
        if(stat.isDirectory()) // If file is a directory, recursive call recurDir
            await registerEvents(client, path.join(dir, file))
        else {
            // Check if file is a .js file.
            if(file.endsWith(".js")) {
                try {
                    const event = require(path.join(main_dir, dir, file))
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(client, ...args))
                    } else {
                        client.on(event.name, (...args) => event.execute(client, ...args))
                    }
                }
                catch(err) {
                    client.logger.error(err.stack)
                }
            }
        }
    }
}

module.exports = {
    registerEvents
}