import { EmbedBuilder } from "discord.js";
import { BWC_Client } from "../lib/index.js";
import { OperationModel } from "../database/models/bot/index.js";
import { Logger } from "winston";

export default class OpsecOpPostingController {
    private client: BWC_Client;
    constructor(client: BWC_Client) {
        this.client = client;
    }

    public async getOps(): Promise<void | Logger> {
        this.client.logger.info('Getting ops', { label: 'CONTROLLER' });
        return await this.client.xenDatabaseProvider.xenOperationService.getUpcomingOpsecOperations()
            .then(data => {
                let convertedOps: OperationModel[] = []
                for (let i = 0; i < data.length; i++) {
                    this.client.utilities.convertXenOpToOp(this.client, data[i])
                        .then(op => {
                            if (op) {
                                convertedOps.push(op)
                            }
                        })
                }
                this.client.botDatabaseProvider.operationService.insertOperations(convertedOps)
            })
            .catch(error => this.client.logger.error(`Error getting ops:`, { label: 'CONTROLLER', error: error.stack }));
    }

    public async sendOpLists(client: BWC_Client) {

    }
}