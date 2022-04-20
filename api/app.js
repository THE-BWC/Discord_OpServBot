const https = require('https');
const fs = require('fs');
const express = require('express')
const basicAuth = require('express-basic-auth')

class API {
    init(client) {
        let app = express();
        const options = {
            key: fs.readFileSync(__dirname + '/sslcert/example.com+5-key.pem'),
            cert: fs.readFileSync(__dirname + '/sslcert/example.com+5.pem')
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


        app.post('/role/sync', async (req, res) => {
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

            await client.discordRolesController.syncRole(client, userId)
                .then(result => {
                    return res.status(200).json(result)
                })
                .catch(err => {
                    client.logger.error(err.stack)
                    return res.status(500).json(err)
                })


        })

        app.post("/role/give", async (req, res) => {
            if (!Object.keys(req.body).length) {
                return res.status(400).json({
                    ERROR_EmptyReqBody: "Request body cannot be empty"
                })
            }

            const {userId} = req.body
            if (!userId) {
                return res.status(400).json({
                    ERROR_NoUserId: "Ensure you sent the userId"
                })
            }

            await client.discordRolesController.giveRole(client, userId)
                .then(result => {
                    return res.status(200).json(result)
                })
                .catch(err => {
                    client.logger.error(err.stack)
                    return res.status(500).json(err)
                })

        })

        app.post("/role/remove", async (req, res) => {
            if (!Object.keys(req.body).length) {
                return res.status(400).json({
                    ERROR_EmptyReqBody: "Request body cannot be empty"
                })
            }

            const { userId } = req.body
            if (!userId) {
                return res.status(400).json({
                    ERROR_NoUserId: "Ensure you sent the userId"
                })
            }

            await client.discordRolesController.removeRole(client, userId)
                .then(result => {
                    return res.status(200).json(result)
                })
                .catch(err => {
                    client.logger.error(err.stack)
                    return res.status(500).json(err)
                })
        })

        https.createServer(options, app).listen(client.config.apiPort, () => {
            console.log(`Api running on port ${client.config.apiPort}`)
        })
    }
}

module.exports = API
