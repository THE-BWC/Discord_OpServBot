# Opserv Integration - Discord
Main Discord bot for the Opserv Integration project. This bot allows for Opserv to be integrated with Discord by providing a bridge between the two platforms.

## Requirements
- Node.js (https://nodejs.org/en/download/) (v16.9.0 or higher)
- Discord.js (https://discord.js.org/#/) (v13.3.1 or higher)
- NPM (https://www.npmjs.com/get-npm) (should be installed with Node.js)
- PM2 (https://pm2.keymetrics.io/docs/usage/quick-start/) (Optional) - Used to run the application as a service.
- Discord Bot Token (https://discord.com/developers/applications) - Used to authenticate the bot with Discord.
- Access to the Opserv Database
- Access to the Forum Database

## Installation
It's HIGHLY recommended running the application as a service. This will allow the application to run in the background and automatically restart if it crashes.
### Run in terminal
1. Download the latest release from the releases page.
2. Extract the zip file to a directory of your choice.
3. Open a terminal window and navigate to the directory where you extracted the zip file.
4. Run `npm install` to install the required dependencies.
5. Run `npm run start` to start the application.
6. The application will now be running in the terminal window. You can close the terminal window if you wish.
7. To stop the application, press `CTRL + C` in the terminal window.

### Run as a service
1. Download the latest release from the releases page.
2. Extract the zip file to a directory of your choice.
3. Open a terminal window and navigate to the directory where you extracted the zip file.
4. Run `npm install` to install the required dependencies.
5. Run `pm2 start ecosystem.config.json` to start the application as a service. You can then use `pm2 stop <name>/<id>` to stop the application, and `pm2 restart name>/<id>` to restart the application.
6. If you wish to run the application as a service on startup, you can use PM2 to do so. Run `pm2 startup` to generate the startup command for your system. Then run the command that was generated to enable PM2 to run on startup. Then run `pm2 save` to save the current PM2 configuration. You can then use `pm2 stop name>/<id>` to stop the application, and `pm2 restart name>/<id>` to restart the application.

### Database
The application requires access to the Xenforo Database and the Bot Database.

#### Xenforo Database
The application requires access to the Xenforo Database to fetch the user's forum username. The application will only fetch the user's forum username if the user has linked their forum account to their Discord account from OpServ.

#### Bot Database
The application requires access to the Bot Database to store the user's Discord ID and their forum username. The application will only store the user's forum username if the user has linked their forum account to their Discord account from OpServ.  
The application will self create the required tables if they do not exist. The application will also self populate the required data if it does not exist.  
If the application is crashing on startup due to database tables missing relationships, columns, or tables you can access the file `models/botdb/botProvider.js` and set `forceSync` to `true`. This will **FORCE** the application to **DROP ALL TABLES** and recreate them. This will also **DELETE ALL DATA STORED** in the database.  
**DO NOT** set `forceSync` to `true` if you have data in the database that you wish to keep. If possible, please create a backup of the database before setting `forceSync` to `true`.

## Configuration
### settings.json
- `NODE_ENV` - The environment that the application is running in. This can be set to development or production. This is used to change the logging output between file (production) and console (development). The default value is production. This should not be changed unless you are developing the application.
- `SSLDomain` - The domain that the application is running on. This is used to generate the SSL certificate. The default value is localhost. This should not be changed unless you are developing the application.
- `SSLFolder` - The folder that the SSL certificate is stored in. The default value is nodecerts. This should not be changed unless you are developing the application.
- `apiPort` - The port that the application is running on. The default value is 4500. This should not be changed unless you are developing the application.
- `owners` - The Discord IDs of the owners of the bot. This is used to allow the owners to run commands that are restricted to the owners. This should be set to the Discord IDs of the owners of the bot.
- `developers` - The Discord IDs of the developers of the bot. This is used to allow the developers to run commands that are restricted to the developers. This should be set to the Discord IDs of the developers of the bot.
- `settings_clientId` - The client ID of the Discord bot. This is used to authenticate the bot with Discord when deploying new slash commands. This should be set to the client ID of the Discord bot that you created.
- `botMainDiscordServer` - The Discord ID of the main Discord server that the bot is running on. This is used to allow the bot to send messages to the main Discord server. This should be set to the Discord ID of the main Discord server that the bot is running on.
- `streamerRole` - The Discord ID of the streamer role. This is used to allow the bot to assign the streamer role to users when they go live. This should be set to the Discord ID of the streamer role.
- `embedColor` - The color of the embeds that the bot sends. This is used to change the color of the embeds that the bot sends. This should be set to a RGB color.
- `omitLockdownChannels` - The channels that the bot shouldn't lock down when the lockdown command is run. This is used to allow the bot to not lock down certain channels when the lockdown command is run. This should be set to an array of Discord channel IDs.
- `omitLockdownRoles` - The roles that the bot shouldn't prevent from messaging in lockdown channels when the lockdown command is run. This should be set to an array of Discord role IDs.
- `creatorId` - The Discord ID of the creator of the bot.
- `version` - The version of the bot.
- `library` - The library that the bot is using.
- `Creator` - The Discord username of the creator.
- `website` - The website of the bot.
- `discord` - The Discord invite link of the bot.
- `server_location` - The location of the server that the bot is running on.

### ecosystem.config.json
- `name` - The name of the application. This is used to identify the application in PM2. The default value is `Discord_Bot_Opserv_Integration`. This should not be changed unless you are developing the application.
- `script` - The script that is run to start the application. The default value is `bot.js`. This should not be changed unless you are developing the application.
- `NODE_ENV` - The environment that the application is running in. This can be set to development or production. This is used to change the logging output between file (production) and console (development). The default value is production. This should not be changed unless you are developing the application.
- `NODE_EXTRA_CA_CERTS` - The path to the SSL certificate. The default value is `<path-to-nodecerts>/nodecerts/cabundle.pem`. This file should be the cabundle.pem file for the website that the application is running on.
- `TOKEN` - The Discord bot token. This is used to authenticate the bot with Discord. This should be set to the Discord bot token that you created.
- `DB1` - This should be the connection to the Xenforo database.
  - `DB_HOST1` - This should be set to the host URL of the database.
  - `DB_NAME1` - This should be set to the name of the database.
  - `DB_PORT1` - This should be set to the port of the database.
  - `DB_USER1` - This should be set to the username of the database.
  - `DB_PASS1` - This should be set to the password of the database.
- `DB2` - This should be the connection to the Bot database.
  - `DB_HOST2` - This should be set to the host URL of the database.
  - `DB_NAME2` - This should be set to the name of the database.
  - `DB_PORT2` - This should be set to the port of the database.
  - `DB_USER2` - This should be set to the username of the database.
  - `DB_PASS2` - This should be set to the password of the database.

## Commands
### Miscellaneous
- `info` - Displays information about the bot.
- `rolecall` - Displays the roles that the bot has.
- `serverinfo` - Displays information about the server.
- `userinfo` - Displays information about the user.
- `uptime` - Displays the uptime of the bot.

### Moderation
- `lock` - Locks down the channel that the command was run in.

### Administration
- `emit` - Emits an event.
- `getOps` - Gets the operations from the Xenforo DB.
- `getOpsList` - Sends the operations lists to the different games announcement channels.
- `lockdown` - Locks down the server.
- `notify` - Sends operation notifications for all operations starting in the next 30 minutes.
- `setAnnouncementChannel` - Sets the announcement channel for the specified game.
- `setGameChannel` - Sets the game channel for the specified game.
- `setLogChannel` - Sets the log channel for the bot.

### Developer
- `systeminfo` - Displays information about the system that the bot is running on.

### Utility
- `ping` - Pings the bot and a random API endpoint.

## Logging
The application uses the `winston` logger to log messages to the console and to a log file. The log file is named `DiscordIntegration.log`.

## Contributing
1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes.
4. Create a pull request.
5. Enjoy!

## Contact
If you have any questions, feel free to contact me on:
- [BWC Discord](https://discord.com/invite/the-bwc) `[BWC] Patrick`
- [BWC Forums](https://the-bwc.com/forum/index.php) `Patrick`.

## Credits
- [Discord.js](https://discord.js.org/#/)
- [Node.js](https://nodejs.org/en/)
- [Node.js MySQL2](https://www.npmjs.com/package/mysql2)
- [Node.js Winston](https://www.npmjs.com/package/winston)
- [Node.js Sequelize](https://www.npmjs.com/package/sequelize)
- [Node.js Express](https://www.npmjs.com/package/express)
- [PM2](https://pm2.keymetrics.io/)
- [Xenforo](https://xenforo.com/)
- [MySQL](https://www.mysql.com/)
