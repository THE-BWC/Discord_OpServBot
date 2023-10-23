import express from 'express';
import {
    BWC_Client
} from "../../lib/index.js";
import {
    RoleController
} from "../controllers/index.js";
import {
    INTRoleController
} from "../../interfaces/api.interface.js";


export default class RoleRouter {
    public roleController: INTRoleController;

    constructor(client: BWC_Client) {
        this.roleController = new RoleController(client);
    }

    public async init() {
        let router = express.Router();

        // POST routes /bot/api/v1/role
        router.post('/sync', this.roleController.sync);
        router.post('/revoke', this.roleController.revoke);
        router.post('/give', this.roleController.give);
        router.post('/remove', this.roleController.remove);

        // GET routes /bot/api/v1/role
        router.get('/fetchAllRoles', this.roleController.fetchAllRoles);
        router.get('/forceSyncUsers', this.roleController.forceSyncUsers);

        return router;
    }
}