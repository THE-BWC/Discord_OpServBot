const https = require('https');
const fs = require('fs');
const express = require('express')
const basicAuth = require('express-basic-auth')
const Observer = require('./services/observer')

class API {
    init(client) {
        let app = express();
        app.set('client', client)

        if (process.env.NODE_EXTRA_CA_CERTS) {
            https.globalAgent.options.ca = [
                fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS),
            ]
        }

        const options = {
            cert: fs.readFileSync(`${client.config.SSLFolder}\\${client.config.SSLDomain}.crt`),
            key: fs.readFileSync(`${client.config.SSLFolder}\\${client.config.SSLDomain}.key`)
        };

        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(basicAuth({
            users: { 'opserv': 'test1234' },
            unauthorizedResponse: getUnauthorizedResponse
        }))

        function getUnauthorizedResponse(req) {
            return req.auth
                ? ('ERROR - Incorrect API credentials provided')
                : 'ERROR - No API credentials provided'
        }


        app.post('/bot/api/v1/role/sync', async (req, res) => {
            if (!Object.keys(req.body).length) {
                return res.status(400).json({
                    ERROR_EmptyReqBody: "Request body cannot be empty"
                })
            }
            console.log(req.body)
            const {userId} = req.body
            if (!userId) {
                return res.status(400).json({
                    ERROR_NoUserId: "Ensure you sent the userId"
                })
            }

        const routerV1 = require('./routes/routerV1')
        app.use('/bot/api/v1', routerV1)

        let server,
            observer = new Observer()

        try {
            server = https.createServer(options, app).listen(client.config.apiPort, () => {
                client.logger.info(`[API] - Api running on port ${client.config.apiPort}`)
            })
        } catch (err) {
            client.logger.error(err.stack)
        }

        observer.on('cert-changed', () => {
            setTimeout(() => {
                let cert = fs.readFileSync(`${client.config.SSLFolder}\\${client.config.SSLDomain}.crt`),
                    key = fs.readFileSync(`${client.config.SSLFolder}\\${client.config.SSLDomain}.key`)
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

module.exports = API
