const Sequelize = require('sequelize');
const { xenforo } = require('../database');
const { QueryTypes } = require("sequelize");

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

    async fetchUserByUsername(username) {
        return await xenforo.query(
            `SELECT
            user_id,
            username
            FROM xf_user
            WHERE username = '${username}';`, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchAllDiscordLinkInfo() {
        return await xenforo.query(
            `SELECT
            user_id,
            discord_user_id,
            discord_username,
            discord_discrim
            FROM opserv_discord_user_links`, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchDiscordLinkInfoForumUserId(userId) {
        return await xenforo.query(
            `SELECT
            user_id,
            discord_user_id
            FROM opserv_discord_user_links
            WHERE user_id = ` + userId, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchUserGroupIds(userId) {
        return await xenforo.query(
            `SELECT
            CONVERT(secondary_group_ids USING utf8),
            user_group_id
            FROM bwcsvr_xenforo.xf_user
            WHERE user_id = ` + userId, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchUsername(userId) {
        return await xenforo.query(
            `SELECT
            username
            FROM xf_user
            WHERE user_id = ` + userId, { type: QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchOps(opsec = false) {
        if (opsec === false) {
            return await xenforo.query(
                `SELECT opserv_operations.operation_id
                 FROM opserv_operations
                 WHERE opserv_operations.date_start >= ${Date.now() / 1000}
                   AND opserv_operations.is_completed = 0
                   AND opserv_operations.is_opsec = 0
                 ORDER BY opserv_operations.date_start`, {type: Sequelize.QueryTypes.SELECT})
                .catch(err => this.client.logger.error(err.stack))
        }
        if (opsec === true) {
            return await xenforo.query(
                `SELECT
                    opserv_operations.operation_id,
                    opserv_operations.operation_name,
                    opserv_operations.is_completed,
                    opserv_operation_type.type_name,
                    opserv_operations.date_start,
                    opserv_operations.date_end,
                    xf_user.username AS leader_username,
                    opserv_operations.leader_user_id,
                    opserv_operations.game_id,
                    opserv_games.tag,
                    opserv_games.game_name,
                    opserv_operations.edited_date
                FROM opserv_operations
                INNER JOIN opserv_operation_type ON opserv_operations.type_id = opserv_operation_type.type_id
                INNER JOIN xf_user ON opserv_operations.leader_user_id = xf_user.user_id
                INNER JOIN opserv_games ON opserv_operations.game_id = opserv_games.game_id
                WHERE opserv_operations.date_start >= ${Date.now() / 1000} AND opserv_operations.is_completed = 0
                ORDER BY opserv_operations.date_start`, { type: Sequelize.QueryTypes.SELECT})
        }
    }

    async fetchOperationById(operationId, opsec = false) {
        return await xenforo.query(
                `SELECT
                    opserv_operations.operation_id,
                    opserv_operations.operation_name,
                    opserv_operations.is_completed,
                    opserv_operations.date_start,
                    opserv_operations.date_end,
                    opserv_operations.leader_user_id,
                    opserv_operations.game_id,
                    opserv_operations.description,
                    opserv_operations.discord_voice_channel_id,
                    opserv_operations.discord_event_location,
                    opserv_games.tag,
                    opserv_games.game_name,
                    opserv_operations.edited_date
                FROM opserv_operations
                INNER JOIN opserv_games ON opserv_operations.game_id = opserv_games.game_id
                WHERE operation_id = ${operationId} AND is_opsec = ${opsec ? 1 : 0}`,{ type: Sequelize.QueryTypes.SELECT })
            .catch(err => this.client.logger.error(err.stack))
    }

    async fetchGames() {
        return await xenforo.query(
            `SELECT
                game_id,
                game_name,
                tag
            FROM opserv_games
            WHERE retired != 1`, { type: Sequelize.QueryTypes.SELECT }
        )
    }

///////////////////// Discord KEY Roles /////////////////////
    /**
     * Fetches a Discord Key role in the Discord Key Role Table
     *
     * @param {String}     name The name of the role to fetch
     *
     * @returns {Promise.<Object>}
     */
    async fetchKeyRole(name) {
        return await xenforo.query(
            `SELECT
                role_id
            FROM opserv_discord_key_roles
             WHERE name like '${name}';`, { type: Sequelize.QueryTypes.SELECT})
            .catch(err => this.client.logger.error(err.stack))
    }

    /**
     * Fetches all Discord Key roles in the Discord Key Role Table
     *
     * @returns {Promise.<Object>}
     */
    async fetchAllKeyRoles() {
        return await xenforo.query(
            `SELECT
                role_id,
                name
            FROM opserv_discord_key_roles;`, { type: Sequelize.QueryTypes.SELECT})
            .catch(err => this.client.logger.error(err.stack))
    }

    async setDiscordLinkInfo(user_id, discord_user_id, discord_username, discord_discrim) {
        await xenforo.query(
            `INSERT INTO
            bwcsvr_xenforo.opserv_discord_user_links
            (user_id, discord_user_id, discord_username, discord_discrim)
            VALUES (${user_id}, '${discord_user_id}', '${discord_username}', '${discord_discrim}')`
        )
    }
}

module.exports = XenforoSettingProvider;
