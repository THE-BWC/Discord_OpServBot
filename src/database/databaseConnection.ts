import { Sequelize } from 'sequelize';
import {
    botDBHost, botDBName, botDBPassword, botDBPort, botDBUsername,
    xenDBHost, xenDBName, xenDBPassword, xenDBPort, xenDBUsername
} from "../envs.js"
import { logger } from "../lib/index.js";

const botDatabase = new Sequelize(botDBName, botDBUsername, botDBPassword,{
    host: botDBHost,
    port: botDBPort,
    dialect: "mysql",
    define: {
        timestamps: false,
    },
    logging: (msg) => logger.debug(msg)
})

const xenDatabase = new Sequelize(xenDBName, xenDBUsername, xenDBPassword,{
    host: xenDBHost,
    port: xenDBPort,
    dialect: "mysql",
    define: {
        timestamps: false,
    },
    logging: (msg) => logger.debug(msg)
})

export {
    botDatabase,
    xenDatabase
}