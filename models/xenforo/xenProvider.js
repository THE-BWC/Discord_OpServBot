const Sequelize = require('sequelize');
const { xenforo } = require('../database');
const { QueryTypes } = require("sequelize");

// noinspection JSUnresolvedFunction
class XenforoSettingProvider {
    async init(client) {
        this.client = client;

        //xenforo.sync({force: true}).catch(err => console.log(err))
        //xenforo.sync().catch(err => console.log(err))

        try {
            await xenforo.authenticate();
            this.client.logger.info('[DATABASE] - Successfully connected to the Xenforo DB');
        } catch (e) {
            this.client.logger.error(e.stack);
            process.exit(-1);
        }
    }

    async fetchDiscordLinkInfoDiscordUserId(userId) {
        return await xenforo.query(
            "SELECT " +
            "user_id, " +
            "discord_user_id " +
            "FROM opserv_discord_user_links " +
            "WHERE discord_user_id = " + userId, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchDiscordLinkInfoForumUserId(userId) {
        return await xenforo.query(
            "SELECT " +
            "user_id, " +
            "discord_user_id " +
            "FROM opserv_discord_user_links " +
            "WHERE user_id = " + userId, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchUserGroupIds(userId) {
        return await xenforo.query(
            "SELECT " +
            "CONVERT(secondary_group_ids USING utf8), " +
            "user_group_id " +
            "FROM bwcsvr_xenforo.xf_user " +
            "WHERE user_id = " + userId, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchUsername(userId) {
        return await xenforo.query(
            "SELECT " +
            "username " +
            "FROM xf_user " +
            "WHERE user_id = " + userId, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchOps() {
        return await xenforo.query(
            "SELECT " +
                "opserv_operations.operation_id, " +
                "opserv_operations.operation_name, " +
                "opserv_operations.is_completed, " +
                "opserv_operation_type.type_name, " +
                "opserv_operations.date_start, " +
                "opserv_operations.date_end, " +
                "xf_user.username AS leader_username, " +
                "opserv_operations.leader_user_id, " +
                "opserv_operations.game_id, " +
                "opserv_games.tag, " +
                "opserv_games.game_name, " +
                "opserv_operations.edited_date " +
            "FROM opserv_operations " +
            "INNER JOIN opserv_operation_type ON opserv_operations.type_id = opserv_operation_type.type_id " +
            "INNER JOIN xf_user ON opserv_operations.leader_user_id = xf_user.user_id " +
            "INNER JOIN opserv_games ON opserv_operations.game_id = opserv_games.game_id " +
            `WHERE opserv_operations.date_start >= ${Date.now()/1000} AND opserv_operations.is_completed = 0 ` +
            "ORDER BY opserv_operations.date_start;", { type: Sequelize.QueryTypes.SELECT})
    }

    async fetchGames() {
        return await xenforo.query(
            "SELECT " +
                "game_id, " +
                "game_name, " +
                "tag " +
            "FROM opserv_games " +
            "WHERE retired != 1;", { type: Sequelize.QueryTypes.SELECT})
    }
}

module.exports = XenforoSettingProvider;
