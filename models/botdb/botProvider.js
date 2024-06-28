const { bot } = require('../database')
const { Sequelize, Op } = require("sequelize");
const Guild = require('./guild')
const Locked_channel = require('./locked_channel')
const Omit_channel_lock = require('./omit_channel_lock')
const Omit_channel_lock_role = require('./omit_channel_lock_role')
const DiscordEvents = require('./discord_events')
const DiscordThreads = require('./discord_threads')
const DiscordOpsecRoles = require('./discord_opsec_roles')
const Operation = require('./operation')
const GameChannel = require('./game_channel')

class BotSettingsProvider {
    async init(client, forceSync = false) {
        this.client = client

        Guild.hasMany(Locked_channel)
        Guild.hasMany(Omit_channel_lock)
        Guild.hasMany(Omit_channel_lock_role)
        Guild.hasMany(DiscordEvents)
        Guild.hasMany(DiscordThreads)
        Guild.hasMany(DiscordOpsecRoles)
        Guild.hasMany(GameChannel)

        try {
            await bot.authenticate();
            this.client.logger.info('[DATABASE] - Successfully connected to the bot DB');
        } catch (e) {
            this.client.logger.error(e.stack)
            process.exit(-1)
        }

        if (forceSync) {
            await bot.sync({ force: true })
                .catch(err => console.log(err))
        } else {
            await bot.sync()
                .catch(err => console.log(err))
        }


        for (const guild in this.client.guilds.cache.map(guild => guild)) {
            try {
                const result = await Guild.findByPk(this.client.guilds.cache.map(guild => guild)[guild].id)

                if (!result) {
                    // Insert guild into guild table
                    await Guild.create({ id: this.client.guilds.cache.map(guild => guild)[guild].id})
                }
            } catch (e) {
                this.client.logger.error(e.stack)
            }
        }
    }

    ///////////////////// Guild /////////////////////
    // Fetches id, prefix, log, log-channel
    async fetchGuilds() {
        return await Guild.findAll({ raw: true })
            .catch((err) => {
                this.client.logger.error(err.stack)
            return false
            })
        }

    ///////////////////// Set Channels /////////////////////
    async setAnnouncementChannel(guildId, channelId) {
        await Guild.findByPk(guildId)
            .then(guild => guild.update({ announcement_channel: channelId }))
            .catch(err => this.client.logger.error(err.stack))
    }

    async setLogChannel(guildId, channelId) {
        await Guild.findByPk(guildId)
            .then(guild => guild.update({ log_channel: channelId }))
            .catch(err => this.client.logger.error(err.stack))
    }

    ///////////////////// Locked Channels /////////////////////
    // Fetches id, channel_id, reason, message_id, guildId - Comes from the guild table
    async fetchLockedChannels(guildId) {
        return await Locked_channel.findAll({
            where: { guildId: guildId },
            raw: true
        }).catch(err => this.client.logger.error(err.stack))
    };

    // Fetches id, channel_id, guildId - Comes from the guild table
    async fetchOmitLockedChannels(guildId) {
        return await Omit_channel_lock.findAll({
            where: { guildId: guildId },
            raw: true
        }).catch(err => this.client.logger.error(err.stack))
    };

    // Fetches id, role_id, guildId - Comes from the guild table
    async fetchOmitLockedChannelsRoles(guildId) {
        return await Omit_channel_lock_role.findAll({
            where: { guildId: guildId },
            raw: true
        }).catch(err => this.client.logger.error(err.stack))
    };


    ///////////////////// Discord Events /////////////////////
    /**
     * Creates a Discord Event Entry in the Discord Event Table
     *
     * @param   {String | Number}   guildId     The ID of the Guild in which the Event was created
     * @param   {String | Number}   eventId     The ID of the created Event
     * @param   {String | Number}   operationId The ID of the Operation whose Event got created
     * @param   {Number}            editedDate  The timestamp(Epoch) of the last edit to the operation
     *
     * @returns {Promise.<void>}
     */
    async createEventEntry(guildId, eventId, operationId, editedDate) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createDiscord_event({ event_id: eventId, operation_id: operationId, operation_edited_date: editedDate })
            }).catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Fetches a Discord Event Entry in the Discord Event Table
     *
     * @param {String | Number}     operationId The Operation ID of the operation to fetch
     *
     * @returns {Promise.<Object>}
     */
    async fetchEventEntry(operationId) {
        return await DiscordEvents.findByPk(operationId, { raw: true })
            .catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Updates a Discord Event Entry in the Discord Event Table
     *
     * @param {String | Number}     operationId The ID of the Operation to update
     * @param {Number}              editedDate  The new operation edit date
     *
     * @returns {Promise<void>}
     */
    async updateEventEntry(operationId, editedDate) {
        await DiscordEvents.findByPk(operationId)
            .then(event => {
                event.update({ operation_edited_date: editedDate })
            })
    }

    /**
     * Deletes a Discord Event Entry in the Discord Event Table
     *
     * @param {String | Number}     operationId The ID of the Operation to Delete
     *
     * @returns {Promise<void>}
     */
    async deleteEventEntry(operationId) {
        return await DiscordEvents.destroy({
            where: { operation_id: operationId }
        }).catch(err => this.client.logger.error(err.stack))
    }

    ///////////////////// Discord OPSEC Roles /////////////////////
    /**
     * Fetches an OPSEC role in the Discord OPSEC Role Table
     *
     * @param {String | Number}     gameId The Game ID of the game to fetch OPSEC role for
     *
     * @returns {Promise.<Object>}
     */
    async fetchOpsecRole(gameId) {
        return await DiscordOpsecRoles.findByPk(gameId, { raw: true })
            .catch(err => this.client.logger.error(err.stack))
    }

    ///////////////////// OPSEC Operations /////////////////////
    /**
     * Fetches OPSEC operations from the Bot Database
     *
     * @param {Number}     gameId Optional - The ID of the Game to fetch Ops for. Leave blank for all games.
     *
     * @returns {Promise.<Object>}
     */
    async fetchOps(gameId) {
        if (!gameId) {
            return await Operation.findAll({
                order: Sequelize.col('date_start'),
                raw: true
            }).catch(err => this.client.logger.error(err.stack))
        }
        if (gameId) {
            return await Operation.findAll({
                where: { game_id: { [Op.notIn]: (gameId) }},
                order: Sequelize.col('date_start'),
                raw: true
            }).catch(err => this.client.logger.error(err.stack))
        }
    }

    /**
     * Creates op entries in the bot DB
     *
     * @param {object[]}     ops Array of Ops in Object format to create entries for.
     *
     * @returns {Promise.<Object>}
     */
    async createOpsEntry(ops) {
        let currentDBOps = await this.fetchOps()
        let oldOps = currentDBOps.filter(r => !ops.find(r2 => r.operation_id === r2.operation_id))
        for (let oldOp of oldOps) {
            await Operation.destroy({ where: { operation_id: oldOp.operation_id }})
        }

        for (let operation in ops) {
            ops[operation].notified = 0
        }
        await Operation.bulkCreate(ops, { updateOnDuplicate: ["is_completed","type_id","type_name","date_start","date_end","leader_user_id", "game_id", "tag", "game_name", "edited_date"] })
            .catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Updates an op entry to set the Notified state to true
     *
     * @param {Number}     op_id ID of the Operation.
     *
     * @returns {Promise.<Object>}
     */
    async setOpNotified(op_id) {
        Operation.findByPk(op_id)
            .then(r => r.update({ notified: 1 }))
            .catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Creates a game channel entry in the bot DB so we know the channel id of the channel to post in for the respective game.
     *
     * @param {Number}     guildId   ID of the guild.
     * @param {Number}     gameId    ID of the game.
     * @param {Number}     channelId ID of the channel.
     *
     * @returns {Promise.<Object>}
     */
    async createGameChannelEntry(guildId, gameId, channelId) {
        await Guild.findByPk(guildId)
            .then(guild => { return guild.createGame_channel({ game_id: gameId, channel_id: channelId}, { updateOnDuplicate: ["game_id", "channel_id"]}) })
            .catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Fetches the game channel id(s) for the respective game or all games.
     *
     * @param {Number}     guildId ID of the guild.
     * @param {Number}     id      Optional - ID of the game.
     *
     * @returns {Promise.<Object>}
     */
    async fetchGameChannels(guildId, id) {
        if (!id) {
            return await GameChannel.findAll({
                where: { guildId: guildId },
                raw: true
            }).catch(err => this.client.logger.error(err.stack))
        }
        if (id) {
            return await GameChannel.findAll({
                where: { guildId: guildId, game_id: id },
                raw: true
            }).catch(err => this.client.logger.error(err.stack))
        }
    }

    ///////////////////// Discord Threads /////////////////////
    /**
     * Fetches all Discord Thread Entries in the Discord Thread Table
     *
     * @returns {Promise.<Object>}
     */
    async fetchAllThreadEntries() {
        return await DiscordThreads.findAll({raw: true})
            .catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Fetch all Discord Thread Entries in the Discord Thread Table for a specific Guild
     */
    async fetchGuildThreadEntries(guildId) {
        return await DiscordThreads.findAll({
            where: { guildId: guildId },
            raw: true
        }).catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Creates a Discord Thread Entry in the Discord Thread Table
     *
     * @param {String}  guildId The Guild ID of the thread to create
     * @param {String}  threadId The Thread ID of the thread to create
     * @param {String}  channelId The Channel ID of the thread to create
     * @param {Date}    createdAt The Created At Date of the thread to create
     * @param {Date}    deleteAt The Delete At Date the thread to create
     *
     * @returns {Promise.<Object>}
     */
    async createThreadEntry(guildId, threadId, channelId, createdAt, deleteAt) {
            return DiscordThreads.create({
                thread_id: threadId,
                channel_id: channelId,
                created_at: createdAt,
                delete_at: deleteAt,
                guildId: guildId },
                { updateOnDuplicate: ["thread_id", "channel_id", "created_at", "delete_at", "guildId"]
                })
            .catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Deletes a Discord Thread Entry in the Discord Thread Table
     *
     * @param {String}  threadId The Thread ID of the thread to delete
     *
     * @returns {Promise.<Object>}
     */
    async deleteThreadEntry(threadId) {
        return await DiscordThreads.destroy({where: {thread_id: threadId}})
            .catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Updates a Discord Thread Entry in the Discord Thread Table
     *
     * @param {String}  threadId The Thread ID of the thread to update
     * @param {Date}    deleteAt The Delete At Date the thread to update
     *
     * @returns {Promise.<Object>}
     */
    async updateThreadEntry(threadId, deleteAt) {
        return await DiscordThreads.findOne({where: {thread_id: threadId}})
            .then(thread => {
                return thread.update({
                    delete_at: deleteAt
                })
            })
            .catch(err => this.client.logger.error(err.stack))
    }

}

module.exports = BotSettingsProvider;
