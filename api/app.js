const https = require('https');
const fs = require('fs');
const express = require('express')
const basicAuth = require('express-basic-auth')
const Observer = require('./services/observer')

class API {
    async init(client, enableHttps = false) {
        let app = express();
        app.set('client', client)

        let server,
            observer = new Observer(),
            options = {}

        if (enableHttps === true) {
            if (process.env.NODE_EXTRA_CA_CERTS) {
                https.globalAgent.options.ca = [
                    fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS),
                ]
            }

            options = {
                cert: fs.readFileSync(`${client.config.SSLFolder}/${client.config.SSLDomain}.crt`),
                key: fs.readFileSync(`${client.config.SSLFolder}/${client.config.SSLDomain}.key`)
            };
        }

        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        app.use(basicAuth({
            users: {'opserv': 'test1234'},
            unauthorizedResponse: getUnauthorizedResponse
        }))

        function getUnauthorizedResponse(req) {
            return req.auth
                ? ('ERROR - Incorrect API credentials provided')
                : 'ERROR - No API credentials provided'
        }

        app.get('/', async (req, res) => {
            res.json({
                message: "Hello There"
            })
        })

        const routerV1 = require('./routes/routerV1')
        app.use('/bot/api/v1', routerV1)

        try {
            if (enableHttps === true) {
                server = https.createServer(options, app).listen(client.config.apiPort, () => {
                    client.logger.info(`[API] - Api running on port ${client.config.apiPort}`)
                })
            } else {
                server = app.listen(client.config.apiPort, () => {
                    client.logger.info(`[API] - Api running on port ${client.config.apiPort}`)
                })
            }
        } catch (err) {
            client.logger.error(err.stack)
        }

        if (enableHttps === true) {
            observer.on('cert-changed', () => {
                setTimeout(() => {
                    let cert = fs.readFileSync(`${client.config.SSLFolder}/${client.config.SSLDomain}.crt`),
                        key = fs.readFileSync(`${client.config.SSLFolder}/${client.config.SSLDomain}.key`)
                    updateContext(cert, key)
                }, 5000)
            })

            observer.watchFolder(client.config.SSLFolder, client)

            function updateContext(cert, key) {
                try {
                    server.setSecureContext({
                        cert: cert,
                        key: key
                    })
                    client.logger.info('[API] - [CERTIFICATE] - Certificate has been updated')
                } catch (err) {
                    client.logger.error(err.stack)
                }
            }
        }
    }
}

module.exports = API