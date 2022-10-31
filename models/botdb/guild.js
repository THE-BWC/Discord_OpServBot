const Sequelize = require('sequelize');
const { bot } = require('../database');

const Guild = bot.define('guild', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    prefix: {
        type: Sequelize.CHAR(10),
        defaultValue: ".",
        allowNull: false
    },
    log: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    log_channel: {
        type: Sequelize.STRING,
        allowNull: true
    },
    announcement_channel: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = Guild;
