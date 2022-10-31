const Sequelize = require('sequelize');
const { bot } = require('../database');

const DiscordOpsecRoles = bot.define('discord_opsec_roles', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    opsec_role_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    game_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = DiscordOpsecRoles;
