import dotenv from 'dotenv';
dotenv.config();

// Node
const env = process.env.NODE_ENV || 'development'
const isDevelopment = env === 'development'
const isTest = env === 'test'

// Bot
const token: string = process.env.TOKEN || ''
const discordClientID: string = process.env.DISCORD_CLIENT_ID || '881597230165946408'

const discordServer: string = process.env.DISCORD_SERVER || '565959084990267393'

const owners: string[] = process.env.OWNERS ? process.env.OWNERS.split(',') : ['299192199843676171']
const developers: string[] = process.env.DEVELOPERS ? process.env.DEVELOPERS.split(',') : ['299192199843676171']

const embedColor: string = process.env.EMBED_COLOR || '#ff0000'

const creatorID: string = '299192199843676171'
const version: string = '2.0.0'
const library: string = 'Discord.js'
const creator: string = '[BWC] Patrick'
const website: string = 'https://the-bwc.com'
const serverLocation: string = 'New York, NY, USA'

// API Base
const apiUrl: string = process.env.API_URL || 'localhost'
const apiPort: number = Number(process.env.API_PORT || '3000')
const sslDomain: string = process.env.SSL_DOMAIN || 'server'
const sslFolder: string = process.env.SSL_FOLDER || '/home/patrickpedersen/sslcert'

// Bot Database
const botDBHost: string = process.env.BOT_DB_HOST || '127.0.0.1'
const botDBPort: number = Number(process.env.BOT_DB_PORT || '3306')
const botDBName: string = process.env.BOT_DB_NAME || 'vue_gallery'
const botDBUsername: string = process.env.BOT_DB_USERNAME || 'gallery'
const botDBPassword: string = process.env.BOT_DB_PASSWORD || 'Development'

// Xen Database
const xenDBHost: string = process.env.XEN_DB_HOST || '127.0.0.1'
const xenDBPort: number = Number(process.env.XEN_DB_PORT || '3306')
const xenDBName: string = process.env.XEN_DB_NAME || 'vue_gallery'
const xenDBUsername: string = process.env.XEN_DB_USERNAME || 'gallery'
const xenDBPassword: string = process.env.XEN_DB_PASSWORD || 'Development'

export {
    env,
    isDevelopment,
    isTest,
    token,
    discordClientID,
    discordServer,
    owners,
    developers,
    embedColor,
    creatorID,
    version,
    library,
    creator,
    website,
    serverLocation,
    apiUrl,
    apiPort,
    sslDomain,
    sslFolder,
    botDBHost,
    botDBPort,
    botDBName,
    botDBUsername,
    botDBPassword,
    xenDBHost,
    xenDBPort,
    xenDBName,
    xenDBUsername,
    xenDBPassword
}