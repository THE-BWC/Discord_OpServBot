import { Request, Response } from 'express';
import { BWC_Client } from "../../lib/index.js";

export default class RoleController {
    public client: BWC_Client;

    constructor(client: BWC_Client) {
        this.client = client;
    }

    public async sync(req: Request, res: Response) {
        if (!Object.keys(req.body).length) {
            this.client.logger.error(`The request body is empty`, { api: true, label: 'CONTROLLER' });
            return {
                ERROR_EMPTY_BODY: "The request body is empty"
            }
        }

        const userId = req.body['userId'] as string;
        if (!userId) {
            this.client.logger.error(`The forum user ID is missing`, { api: true, label: 'CONTROLLER' });
            return res.status(400).json({
                ERROR_MISSING_FORUM_USER_ID: "The forum user ID is missing"
            })
        }

        return await this.client.rolesController.syncRolesByForumUserId(userId)
            .then(result => {
                return res.status(200).json({
                    message: result.message
                })
            })
            .catch(error => {
                this.client.logger.error(`Error syncing roles for user ${userId}`, { api: true, label: 'CONTROLLER', error: error.stack });
                return res.status(500).json({
                    message: error.message
                })
            })
    }

    public async revoke(req: Request, res: Response) {

    }

    public async give(req: Request, res: Response) {

    }

    public async remove(req: Request, res: Response) {

    }

    public async fetchAllRoles(req: Request, res: Response) {

    }

    public async forceSyncUsers(req: Request, res: Response) {

    }
}