const Sequelize = require('sequelize');
const { bot } = require('../database');

const DiscordEvents = bot.define('discord_events', {
    event_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    operation_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    operation_edited_date: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = DiscordEvents;
