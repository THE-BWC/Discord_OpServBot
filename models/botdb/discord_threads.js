const sequelize = require('sequelize');
const { bot } = require('../database');

const DiscordThreads = bot.define('discord_threads', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    thread_id: {
        type: sequelize.STRING,
        allowNull: false
    },
    channel_id: {
        type: sequelize.STRING,
        allowNull: false
    },
    created_at: {
        type: sequelize.DATE,
        allowNull: false
    },
    delete_at: {
        type: sequelize.DATE,
        allowNull: false
    }
});

module.exports = DiscordThreads;
