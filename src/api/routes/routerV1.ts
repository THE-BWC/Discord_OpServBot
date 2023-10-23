import express from 'express';
import { BWC_Client } from "../../lib/index.js";
import {
    RoleRouter
} from "./index.js";
import {
    INTRoleRouter
} from "../../interfaces/api.interface.js";

export default class RouterV1 {
    public roleRouter: INTRoleRouter;

    constructor(client: BWC_Client) {
        this.roleRouter = new RoleRouter(client);
    }

    public async init() {
        let router = express.Router();

        // Route /bot/api/v1
        router.use('/role', await this.roleRouter.init());

        return router;
    }
}