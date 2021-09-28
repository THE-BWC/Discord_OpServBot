const fs = require('fs').promises
const path = require('path')

async function registerCommands(main_dir, dir, deploy = false, client) {
    let files = await fs.readdir(path.join(main_dir, dir))
    // Loop through each file.
    for(let file of files) {
        let stat = await fs.lstat(path.join(main_dir, dir, file))
        if(stat.isDirectory()) // If file is a directory, recursive call recurDir
            await registerCommands(main_dir, path.join(dir, file), deploy, client)
        else {
            // Check if file is a .js file.
            if(file.endsWith(".js")) {
                try {
                    if (deploy === true) {
                        const command = await require(path.join(main_dir, dir, file))
                        return command.data.toJSON()
                    } else {
                        const command = require(path.join(main_dir, dir, file))
                        client.commands.set(command.data.name, command)
                    }
                }
                catch(err) {
                    if (deploy === true) {
                        console.log(err.stack)
                    } else {
                        client.logger.error(err.stack)
                    }
                }
            }
        }
    }
}

module.exports = {
    registerCommands
}