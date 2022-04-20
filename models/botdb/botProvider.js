const Sequelize = require('sequelize')
const { bot } = require('../database')
const Guild = require('./guild')
const Warn = require('./warn')
const Duncecap = require('./duncecap')
const Locked_channel = require('./locked_channel')
const Omit_channel_lock = require('./omit_channel_lock')
const Omit_channel_lock_role = require('./omit_channel_lock_role')
const Assignable_roles = require('./assignable_roles')
const Badwords = require('./badword')
const Operation = require('./operation')
const GameChannel = require('./gamechannel')

// noinspection JSUnresolvedFunction
class BotSettingsProvider {
    async init(client) {
        this.client = client

        Guild.hasMany(Warn)
        Guild.hasMany(Duncecap)
        Guild.hasMany(Locked_channel)
        Guild.hasMany(Omit_channel_lock)
        Guild.hasMany(Omit_channel_lock_role)
        Guild.hasMany(Assignable_roles)
        Guild.hasMany(GameChannel)
        Guild.hasOne(Badwords)

        //bot.sync({force: true}).catch(err => console.log(err))
        //bot.sync().catch(err => console.log(err))

        try {
            await bot.authenticate();
            this.client.logger.info('[DATABASE] - Successfully connected to the bot DB');
        } catch (e) {
            this.client.logger.error(e.stack)
            process.exit(-1)
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

    // Fetches id, prefix, log, log-channel
    async fetchGuild(guildId, key) {
        if (!guildId && !key) {
            return await Guild.findAll({ })
                .catch(err => this.client.logger.error(err.stack))
        }
        if (!key) {
            return await Guild.findByPk(guildId)
                .catch(err => this.client.logger.error(err.stack))
        } else {
            return await Guild.findByPk(guildId)
                .then(result => result.getDataValue(key))
                .catch(err => this.client.logger.error(err.stack))
        }
    }

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

    // Fetches id, user_id, reason, guildId - Comes from the guild table
    async fetchWarns(guildId, userId, warnId) {
        if (guildId && !userId && !warnId) {
            return await Warn.findAll({
                where: {guildId: guildId}
            }).catch(err => this.client.logger.error(err.stack))
        } else if (guildId && userId && !warnId) {
            return await Guild.findByPk(guildId)
                .then(guild => {
                    return guild.getWarns({where: { user_id: userId } })
                }).catch(err => this.client.logger.error(err.stack))
        } else {
            return await Guild.findByPk(guildId)
                .then(guild => {
                    return guild.getWarns({where: { user_id: userId, id: warnId}})
                }).catch(err => this.client.logger.error(err.stack))
        }
    };

    async createWarning(guildId, userId, reason, modId) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createWarn({user_id: userId, reason: reason, mod_id: modId})
            }).catch(err => this.client.logger.error(err.stack))
    }

    async removeWarning(guildId, warning) {
        return await Guild.findByPk(guildId)
            .then(guild => {
                guild.removeWarn(warning)
            })
            .catch(err => this.client.logger.error(err.stack))
    }

    async removeWarnings(guildId, userId) {
        return await Guild.findByPk(guildId)
            .then(async guild => {
                let warns = await guild.getWarns({where: {user_id: userId}});
                for (let warn in warns) {
                    guild.removeWarn(warns[warn].dataValues.id)
                }
            })
            .catch(err => this.client.logger.error(err.stack))
    }

    // Fetches id, user_id, user_roles, time, reason, guildId - Comes from the guild table
    // Possible optimization.
    async fetchDunceCaps(guildId, userId) {
        if (guildId && !userId) {
            return await Duncecap.findAll({
                where: {guildId: guildId}
            }).catch(err => this.client.logger.error(err.stack))
        } else {
            return await Duncecap.findAll({
                where: {guildId: guildId, user_id: userId}
            }).catch(err => this.client.logger.error(err.stack))
        }
    };

    async createDunce(guildId, userId, userRoles, time, reason) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createDuncecap({user_id: userId, user_roles: userRoles, time: time, reason: reason})
            }).catch(err => this.client.logger.error(err.stack))
    }

    async removeDuncecap(guildId, dunce) {
        await Guild.findByPk(guildId)
            .then(guild => {
                guild.removeDunce(dunce)
            })
            .catch(err => this.client.logger.error(err.stack))
    }

    // Fetches id, role_id, guildId - Comes from the guild table
    async fetchAssignableRoles(guildId) {
        return await Assignable_roles.findAll({
            where: {guildId: guildId}
        }).catch(err => this.client.logger.error(err.stack))
    };

    // Fetches id, channel_id, reason, message_id, guildId - Comes from the guild table
    async fetchLockedChannels(guildId) {
        return await Locked_channel.findAll({
            where: {guildId: guildId}
        }).catch(err => this.client.logger.error(err.stack))
    };

    // Fetches id, channel_id, guildId - Comes from the guild table
    async fetchOmitLockedChannels(guildId) {
        return await Omit_channel_lock.findAll({
            where: {guildId: guildId}
        }).catch(err => this.client.logger.error(err.stack))
    };

    // Fetches id, role_id, guildId - Comes from the guild table
    async fetchOmitLockedChannelsRoles(guildId) {
        return await Omit_channel_lock_role.findAll({
            where: {guildId: guildId}
        }).catch(err => this.client.logger.error(err.stack))
    };

    async fetchOps(where) {
        if (!where) {
            return await Operation.findAll({
                order: Sequelize.col('date_start')
            }).catch(err => this.client.logger.error(err.stack))
        }
        if (where) {
            return await Operation.findAll({
                where: { game_id: { [Sequelize.Op.notIn]: (where) }},
                order: Sequelize.col('date_start')
            }).catch(err => this.client.logger.error(err.stack))
        }
    }

    async createOpEntry(ops) {
        let currentDBOps = (await this.fetchOps()).map(r => r.dataValues)

        let oldops = currentDBOps.filter(r => !ops.find(r2 => r.operation_id === r2.operation_id))
        for (let oldop of oldops) {
            await Operation.destroy({ where: { operation_id: oldop.operation_id }})
        }

        for (let operation in ops) {
            ops[operation].notified = 0
        }

        await Operation.bulkCreate(ops, { updateOnDuplicate: ["is_completed","operation_name","type_name","date_start","date_end","leader_username", "game_id", "tag", "game_name", "edited_date"] })
            .catch(err => this.client.logger.error(err.stack))
    }

    async updateOpEntry(op_id) {
        Operation.findByPk(op_id)
            .then(result => result.update({ notified: 1 }))
            .catch(err => this.client.logger.error(err.stack))
    }

    async createGameChannelEntry(guildId, gameId, channelId) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createGame_channel({id: gameId, channel_id: channelId}, { updateOnDuplicate: ["id", "channel_id"] })
            }).catch(err => this.client.logger.error(err.stack))
    }

    async fetchGameChannels(guildId, id) {
        if (!id) {
            return await GameChannel.findAll({
                where: { guildId: guildId}
            }).catch(err => this.client.logger.error(err.stack))
        }
        if (guildId && id) {
            return await GameChannel.findAll({
                where: { guildId: guildId, id: id}
            }).catch(err => this.client.logger.error(err.stack))
        }
    }

}

module.exports = BotSettingsProvider;
