const Sequelize = require('sequelize');
const { bot } = require('../database');

const Operation = bot.define('operations', {
    operation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    operation_name: {
        type: Sequelize.CHAR(255),
        allowNull: false
    },
    is_completed: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    type_name: {
        type: Sequelize.CHAR(255),
        allowNull: false
    },
    date_start: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date_end: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    leader_username: {
        type: Sequelize.CHAR(255),
        allowNull: false
    },
    game_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tag: {
        type: Sequelize.CHAR(255),
        allowNull: false
    },
    game_name: {
        type: Sequelize.CHAR(255),
        allowNull: false
    },
    edited_date: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    notified: {
        type: Sequelize.TINYINT,
        allowNull: false,
        default: 0
    }
});

module.exports = Operation;
