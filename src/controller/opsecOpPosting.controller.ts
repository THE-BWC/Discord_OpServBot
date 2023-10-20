import { BWC_Client } from "../lib/index.js";
import { OperationModel } from "../database/models/bot/index.js";
import { DiscordChannelTypeEnum } from "../interfaces/enums.interface.js";
import { ColorResolvable, EmbedBuilder, TextChannel } from "discord.js";
import { embedColor } from "../envs.js";

export default class OpsecOpPostingController {
    private client: BWC_Client;
    constructor(client: BWC_Client) {
        this.client = client;
    }

    /**
     * Gets the ops from the database
     *
     * @returns {Promise<void>}
     */
    public async getOps(): Promise<void> {
        this.client.logger.info('Getting ops', { label: 'CONTROLLER' });
        return await this.client.xenDatabaseProvider.xenOperationService.getUpcomingOpsecOperations()
            .then(data => {
                let convertedOps: OperationModel[] = [];
                for (let i = 0; i < data.length; i++) {
                    this.client.utilities.convertXenOpToOp(this.client, data[i])
                        .then(op => {
                            if (op) {
                                convertedOps.push(op);
                            }
                        })
                }
                this.client.botDatabaseProvider.operationService.insertOperations(convertedOps);
            })
            .catch(error => {
                this.client.logger.error('Error getting ops', { label: 'CONTROLLER', error: error.stack });
                return;
            })
    }

    /**
     * Sends the op lists to the channels
     *
     * @returns {Promise<void>}
     */
    public async sendOpLists(): Promise<void> {
        let ops = await this.client.botDatabaseProvider.operationService.getAllOperations();
        if (ops === undefined || !ops.length || ops.length === 0) {
            this.client.logger.info('No ops to send', { label: 'CONTROLLER' })
            return;
        }

        let guilds = await this.client.botDatabaseProvider.guildService.getGuilds();
        if (guilds === undefined || !guilds.length || guilds.length === 0) {
            this.client.logger.info('No guilds to send ops to', { label: 'CONTROLLER' })
            return;
        }

        for (let guild in guilds) {
            let channels = await this.client.botDatabaseProvider.channelService.getChannelsByTypeAndGuild(DiscordChannelTypeEnum.Game, guilds[guild].guild_id);
            if (channels === undefined || !channels.length || channels.length === 0) {
                this.client.logger.info('No channels to send ops to', { label: 'CONTROLLER' })
                return;
            }

            for (let channel in channels) {
                let channelOps = [];
                for (let op in ops) {
                    if (ops[op].game_id === channels[channel].game_id) {
                        channelOps.push(ops[op]);
                    }
                }
                if (channelOps.length === 0) {
                    this.client.logger.info('No ops to send to this channel', { label: 'CONTROLLER' })
                    return;
                }

                let targetChannel = this.client.channels.cache.get(channels[channel].channel_id);
                if (targetChannel === undefined || !(targetChannel instanceof TextChannel)) {
                    this.client.logger.info('Channel not found', { label: 'CONTROLLER' })
                    return;
                }
                if (channelOps.length <= 15 && channelOps.length >= 1) {
                    let embed = await this.createOpEmbed(channelOps);
                    await targetChannel.send({embeds: [embed]});
                } else if (channelOps.length > 15) {
                    let embeds = await this.createChunkedOpEmbed(channelOps, 15);
                    for (let embed in embeds) {
                        await targetChannel.send({embeds: [embeds[embed]]});
                    }
                }
            }
        }
    }

    /**
     * Sends a notification to the ops channels
     *
     * @returns {Promise<void>}
     */
    public async notifyOps(): Promise<void> {
        let dateNow = Date.now() / 1000;
        let ops = await this.client.botDatabaseProvider.operationService.getAllOperations();
        if (ops === undefined || !ops.length || ops.length === 0) {
            this.client.logger.info('No ops to notify', { label: 'CONTROLLER' })
            return;
        }

        for (let op in ops) {
            let startDate = ops[op].date_start;
            if ((dateNow > (startDate - (60 * 30))) && (dateNow < startDate) && !ops[op].notified) {
                let embed = await this.createNotifyEmbed(ops[op]);
                let guilds = await this.client.botDatabaseProvider.guildService.getGuilds();
                if (guilds === undefined || !guilds.length || guilds.length === 0) {
                    this.client.logger.info('No guilds to send ops to', { label: 'CONTROLLER' })
                    return;
                }

                for (let guild in guilds) {
                    let targetChannel = await this.client.botDatabaseProvider.channelService.getChannelsByGameIdAndGuild(ops[op].game_id, guilds[guild].guild_id);
                    if (targetChannel === undefined || !targetChannel.length || targetChannel.length === 0) {
                        targetChannel = await this.client.botDatabaseProvider.channelService.getChannelsByTypeAndGuild(DiscordChannelTypeEnum.Announcement, guilds[guild].guild_id);
                        if (targetChannel === undefined || !targetChannel.length || targetChannel.length === 0) {
                            this.client.logger.info('No announcement channel(s) to send ops to', { label: 'CONTROLLER' })
                            return;
                        }
                    }

                    for (let channel in targetChannel) {
                        let target = this.client.channels.cache.get(targetChannel[channel].channel_id);
                        if (target === undefined || !(target instanceof TextChannel)) {
                            this.client.logger.info('Channel not found', { label: 'CONTROLLER' })
                            break;
                        }
                        await target.send({embeds: [embed]});
                    }
                }
            }
        }
    }

    /**
     * Creates an embed for the ops
     *
     * @param   {OperationModel[]}  ops The ops to create the embed for
     *
     * @returns {Promise<EmbedBuilder>} The embed for the ops
     */
    private async createOpEmbed(ops: OperationModel[]): Promise<EmbedBuilder> {
        let embed = new EmbedBuilder()
            .setTitle("Upcoming OPSEC Operations")
            .setColor(embedColor as ColorResolvable)

        for (let op in ops) {
            embed.addFields({
                name: `[${ops[op].tag}] ${ops[op].game_name}`,
                value: `**Op Name:** ${ops[op].operation_name}
                **Op Type:** ${ops[op].type_name}
                **Op Leader:** ${ops[op].leader_username}
                **Start Time:** ${this.client.utilities.unixFormat(ops[op].date_start)}
                Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${ops[op].operation_id}&do=view) for more info!`

            })
        }

        return embed;
    }

    /**
     * Creates an array of embeds for the ops
     *
     * @param   {OperationModel[]}  ops The ops to create the embed for
     * @param   {number}            size The size of the chunks
     *
     * @returns {Promise<EmbedBuilder[]>} The array of embeds for the ops
     */
    private async createChunkedOpEmbed(ops: OperationModel[], size: number): Promise<EmbedBuilder[]> {
        let chunkedArray: OperationModel[][] = this.client.utilities.chunkArray(ops, size);
        let embeds = [];
        for (let chunk in chunkedArray) {
            let embed = new EmbedBuilder()
                .setTitle("Upcoming OPSEC Operations")
                .setColor(embedColor as ColorResolvable)

            for (let op in chunkedArray[chunk]) {
                embed.addFields({
                    name: `[${chunkedArray[chunk][op].tag}] ${chunkedArray[chunk][op].game_name}`,
                    value: `**Op Name:** ${chunkedArray[chunk][op].operation_name}
                    **Op Type:** ${chunkedArray[chunk][op].type_name}
                    **Op Leader:** ${chunkedArray[chunk][op].leader_username}
                    **Start Time:** ${this.client.utilities.unixFormat(chunkedArray[chunk][op].date_start)}
                    Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${chunkedArray[chunk][op].operation_id}&do=view) for more info!`
                })
            }
            embeds.push(embed);
        }

        return embeds;
    }

    /**
     * Creates an embed for the ops
     *
     * @param   {OperationModel}    op The op to create the embed for
     *
     * @returns {Promise<EmbedBuilder>} The embed for the op
     */
    private async createNotifyEmbed(op: OperationModel): Promise<EmbedBuilder> {
        let timeDiff = op.date_start - (Date.now() / 1000);
        return new EmbedBuilder()
            .setTitle(`Operation starting in ${this.client.utilities.notifyTime(timeDiff * 1000)} minutes!`)
            .setColor(embedColor as ColorResolvable)
            .addFields({
                name: `${op.game_name}`,
                value: `**Op Name:** ${op.operation_name}
                        **Op Type:** ${op.type_name}
                        **Op Leader:** ${op.leader_username}
                        **Start Time:** ${this.client.utilities.unixFormat(op.date_start)}
                        Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${op.operation_id}&do=view) for more info!`
            });
    }
}