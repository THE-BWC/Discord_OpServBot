import http from "http";
import https from "https";
import express from "express";
import fs from "fs";
import basicAuth, { IBasicAuthedRequest } from "express-basic-auth";
import { Request, Response } from "express";
import { BWC_Client } from "../lib/index.js";
import Observer from "./lib/observer.js";

import RouterV1 from "./routes/routerV1.js";

export class API {
    async init(client: BWC_Client, enableHttps = false) {
        let app = express();
        app.set('client', client);

        let server: https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
            observer = new Observer(),
            options = {};

        if (enableHttps) {
            if (process.env.NODE_EXTRA_CA_CERTS) {
                https.globalAgent.options.ca = [
                    fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS)
                ]
            }

            options = {
                cert: fs.readFileSync(`${process.env.SSL_FOLDER}/${process.env.SSL_DOMAIN}.crt`),
                key: fs.readFileSync(`${process.env.SSL_FOLDER}/${process.env.SSL_DOMAIN}.key`)
            };
        }

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(basicAuth({
            users: { 'opserv': 'test1234' },
            unauthorizedResponse: getUnauthorizedResponse
        }));

        function getUnauthorizedResponse(req: IBasicAuthedRequest) {
            return req.auth
                ? 'ERROR - Incorrect API credentials provided'
                : 'ERROR - No API credentials provided';
        }

        app.get('/', async (req: Request, res: Response) => {
            res.json({
                message: 'Hello There'
            })
        })

        app.use('/bot/api/v1', RouterV1);

        try {
            if (enableHttps) {
                server = https.createServer(options, app).listen(process.env.API_PORT, () => {
                    client.logger.info(`Api running on port ${process.env.API_PORT}`, { label: 'API' });
                });
            } else {
                server = app.listen(process.env.API_PORT, () => {
                    client.logger.info(`Api running on port ${process.env.API_PORT}`, { label: 'API' });
                });
            }
        } catch (error: any) {
            client.logger.error('Unable to start the API:', { label: 'API', error: error.stack });
        }

        if (enableHttps) {
            observer.on('cert-changed', () => {
                setTimeout(() => {
                    let cert = fs.readFileSync(`${process.env.SSL_FOLDER}/${process.env.SSL_DOMAIN}.crt`),
                        key = fs.readFileSync(`${process.env.SSL_FOLDER}/${process.env.SSL_DOMAIN}.key`);
                    updateContext(cert, key);
                }, 5000)
            })

            observer.watchFolder(process.env.SSL_FOLDER, client);

            function updateContext(cert: Buffer, key: Buffer) {
                try {
                    if (server instanceof https.Server) {
                        server.setSecureContext({
                            cert: cert,
                            key: key
                        })
                        client.logger.info('Certificate has been updated', { label: 'API' });
                    } else {
                        client.logger.error('Unable to update the certificate:', { label: 'API', error: 'Server is not an instance of https.Server' });
                    }
                } catch (error: any) {
                    client.logger.error('Unable to update the certificate:', { label: 'API', error: error.stack });
                }
            }
        }
    }
}