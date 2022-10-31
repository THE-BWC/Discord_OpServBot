const Sequelize = require('sequelize');
const { bot } = require('../database');

const GameChannel = bot.define('game_channel', {
    game_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    channel_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = GameChannel;
