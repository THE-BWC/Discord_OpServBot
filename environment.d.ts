declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test'

            TOKEN: string
            DISCORD_CLIENT_ID: string
            DISCORD_SERVER: string
            OWNERS: string
            DEVELOPERS: string
            EMBED_COLOR: string

            API_URL: string
            API_PORT: string
            SSL_DOMAIN: string
            SSL_FOLDER: string

            BOT_DB_HOST: string
            BOT_DB_PORT: string
            BOT_DB_NAME: string
            BOT_DB_USERNAME: string
            BOT_DB_PASSWORD: string

            XEN_DB_HOST: string
            XEN_DB_PORT: string
            XEN_DB_NAME: string
            XEN_DB_USERNAME: string
            XEN_DB_PASSWORD: string
        }
    }
}

export {}