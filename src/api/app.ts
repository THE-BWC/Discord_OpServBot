// Basic imports
import http from "http";
import https from "https";
import express from "express";
import fs from "fs";
import basicAuth, { IBasicAuthedRequest } from "express-basic-auth";
import { Request, Response } from "express";
import { apiPort, sslDomain, sslFolder } from "../envs.js";

// Client import
import { BWC_Client } from "../lib/index.js";

// Router imports
import RouterV1 from "./routes/routerV1.js";

// Service imports
import Observer from "./lib/observer.js";

// Interface imports
import {
    INTRouterV1
} from "../interfaces/api.interface.js";

export class API {
    public RouterV1: INTRouterV1;

    constructor(client: BWC_Client) {
        this.RouterV1 = new RouterV1(client);
    }

    async init(client: BWC_Client, enableHttps = false) {
        const app = express();
        app.set('client', client);

        let server: https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
            options = {};
        const observer = new Observer();


        if (enableHttps) {
            if (process.env.NODE_EXTRA_CA_CERTS) {
                https.globalAgent.options.ca = [
                    fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS)
                ]
            }

            options = {
                cert: fs.readFileSync(`${sslFolder}/${sslDomain}.crt`),
                key: fs.readFileSync(`${sslFolder}/${sslDomain}.key`)
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

        app.use('/bot/api/v1', await this.RouterV1.init());

        try {
            if (enableHttps) {
                server = https.createServer(options, app).listen(apiPort, () => {
                    client.logger.info(`Api running on port ${apiPort}`, { label: 'API' });
                });
            } else {
                server = app.listen(apiPort, () => {
                    client.logger.info(`Api running on port ${apiPort}`, { label: 'API' });
                });
            }
        } catch (error: any) {
            client.logger.error('Unable to start the API:', { label: 'API', error: error.stack });
        }

        if (enableHttps) {
            observer.on('cert-changed', () => {
                setTimeout(() => {
                    const cert = fs.readFileSync(`${sslFolder}/${sslDomain}.crt`),
                        key = fs.readFileSync(`${sslFolder}/${sslDomain}.key`);
                    this.updateContext(client, server, cert, key);
                }, 5000)
            })

            observer.watchFolder(sslFolder, client);
        }
    }

    private async updateContext(client: BWC_Client, server: https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>, cert: Buffer, key: Buffer) {
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