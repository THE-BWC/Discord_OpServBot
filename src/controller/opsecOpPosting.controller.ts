import { BWC_Client } from "../lib/index.js";
import { OperationModel } from "../database/models/bot/index.js";
import { DiscordChannelTypeEnum } from "../interfaces/enums.interface.js";
import { ColorResolvable, EmbedBuilder, TextChannel } from "discord.js";
import { embedColor } from "../envs.js";
import { XenOpservOperationModel } from "../database/models/xen/index.js";

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
    public async getOpsAndInsertToDB(): Promise<void> {
        this.client.logger.info('Getting ops', { label: 'CONTROLLER' });
        return await this.client.xenDatabaseProvider.xenOperationService.getUpcomingOpsecOperations()
            .then(async data => {
                if (data === undefined || !data.length || data.length === 0) {
                    this.client.logger.info('No ops to get', {label: 'CONTROLLER'});
                    return;
                }
                this.client.logger.info('Got ops', {label: 'CONTROLLER'});

                const convertedOp: OperationModel[] = [];
                for (const op in data) {
                    await this.client.utilities.convertXenOpToOp(this.client, data[op])
                        .then(converted => {
                            if (converted !== null) {
                                convertedOp.push(converted);
                            }
                        })
                        .catch(error => {
                            this.client.logger.error('Error converting ops', { label: 'CONTROLLER', error: error.stack });
                            return;
                        })
                }
                await this.client.botDatabaseProvider.operationService.insertOperations(convertedOp)
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
        const ops = await this.client.xenDatabaseProvider.xenOperationService.getUpcomingOpsecOperations()
            .catch(error => {
                this.client.logger.error('Error getting ops', { label: 'CONTROLLER', error: error.stack });
                return;
            })
        if (ops === undefined || !ops.length || ops.length === 0) {
            this.client.logger.info('No ops to send', { label: 'CONTROLLER' })
            return;
        }

        const guilds = await this.client.botDatabaseProvider.guildService.getGuilds();
        if (guilds === undefined || !guilds.length || guilds.length === 0) {
            this.client.logger.info('No guilds to send ops to', { label: 'CONTROLLER' })
            return;
        }

        for (const guild in guilds) {
            const channels = await this.client.botDatabaseProvider.channelService.getChannelsByTypeAndGuild(DiscordChannelTypeEnum.Game, guilds[guild].guild_id);
            if (channels === undefined || !channels.length || channels.length === 0) {
                this.client.logger.info('No channels to send ops to', { label: 'CONTROLLER' })
                return;
            }

            for (const channel in channels) {
                const channelOps: XenOpservOperationModel[] = [];
                for (const op in ops) {
                    if (ops[op].game_id === channels[channel].game_id) {
                        channelOps.push(ops[op]);
                    }
                }
                if (channelOps.length === 0) {
                    this.client.logger.info('No ops to send to this channel', { label: 'CONTROLLER' })
                    return;
                }

                const targetChannel = this.client.channels.cache.get(channels[channel].channel_id);
                if (targetChannel === undefined || !(targetChannel instanceof TextChannel)) {
                    this.client.logger.info('Channel not found', { label: 'CONTROLLER' })
                    return;
                }
                if (channelOps.length <= 15 && channelOps.length >= 1) {
                    const embed = await this.createOpEmbed(channelOps);
                    await targetChannel.send({embeds: [embed]});
                } else if (channelOps.length > 15) {
                    const embeds = await this.createChunkedOpEmbed(channelOps, 15);
                    for (const embed in embeds) {
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
        const dateNow = Date.now() / 1000;
        const ops = await this.client.botDatabaseProvider.operationService.getAllOperations();
        if (ops === undefined || !ops.length || ops.length === 0) {
            this.client.logger.info('No ops to notify', { label: 'CONTROLLER' })
            return;
        }

        for (const op in ops) {
            const operation = await this.client.xenDatabaseProvider.xenOperationService.getOperationByOpId(ops[op].operation_id)
                .catch(error => {
                    this.client.logger.error('Error getting op', { label: 'CONTROLLER', error: error.stack });
                    return;
                })
            if (!operation) {
                this.client.logger.info('Op not found in Xenforo DB', { label: 'CONTROLLER' })
                return;
            }

            const startDate = operation.date_start;
            if ((dateNow > (startDate - (60 * 30))) && (dateNow < startDate) && !ops[op].notified) {
                const embed = await this.createNotifyEmbed(operation);
                const guilds = await this.client.botDatabaseProvider.guildService.getGuilds();
                if (guilds === undefined || !guilds.length || guilds.length === 0) {
                    this.client.logger.info('No guilds to send ops to', { label: 'CONTROLLER' })
                    return;
                }

                for (const guild in guilds) {
                    let targetChannel = await this.client.botDatabaseProvider.channelService.getChannelsByGameIdAndGuild(operation.game_id, guilds[guild].guild_id);
                    if (targetChannel === undefined || !targetChannel.length || targetChannel.length === 0) {
                        targetChannel = await this.client.botDatabaseProvider.channelService.getChannelsByTypeAndGuild(DiscordChannelTypeEnum.Announcement, guilds[guild].guild_id);
                        if (targetChannel === undefined || !targetChannel.length || targetChannel.length === 0) {
                            this.client.logger.info('No announcement channel(s) to send ops to', { label: 'CONTROLLER' })
                            return;
                        }
                    }

                    for (const channel in targetChannel) {
                        const target = this.client.channels.cache.get(targetChannel[channel].channel_id);
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
     * @param   {XenOpservOperationModel[]}  ops The ops to create the embed for
     *
     * @returns {Promise<EmbedBuilder>} The embed for the ops
     */
    private async createOpEmbed(ops: XenOpservOperationModel[]): Promise<EmbedBuilder> {
        const embed = new EmbedBuilder()
            .setTitle("Upcoming OPSEC Operations")
            .setColor(embedColor as ColorResolvable)

        for (const op in ops) {
            const leader = await this.client.xenDatabaseProvider.xenUserService.getUserByUserId(String(ops[op].leader_user_id));
            embed.addFields({
                name: `[${ops[op].tag}] ${ops[op].game_name}`,
                value: `**Op Name:** ${ops[op].operation_name}
                **Op Type:** ${ops[op].type_name}
                **Op Leader:** ${leader?.username ? leader?.username : "Unknown"}
                **Start Time:** ${this.client.utilities.unixFormat(ops[op].date_start)}
                Go to [OpServ](https://the-bwc.com/opserv/operation.php?id=${ops[op].operation_id}&do=view) for more info!`
            })
        }
        return embed;
    }

    /**
     * Creates an array of embeds for the ops
     *
     * @param   {XenOpservOperationModel[]}  ops The ops to create the embed for
     * @param   {number}            size The size of the chunks
     *
     * @returns {Promise<EmbedBuilder[]>} The array of embeds for the ops
     */
    private async createChunkedOpEmbed(ops: XenOpservOperationModel[], size: number): Promise<EmbedBuilder[]> {
        const chunkedArray: XenOpservOperationModel[][] = this.client.utilities.chunkArray(ops, size);
        const embeds = [];
        for (const chunk in chunkedArray) {
            const embed = new EmbedBuilder()
                .setTitle("Upcoming OPSEC Operations")
                .setColor(embedColor as ColorResolvable)

            for (const op in chunkedArray[chunk]) {
                const leader = await this.client.xenDatabaseProvider.xenUserService.getUserByUserId(String(ops[op].leader_user_id));
                embed.addFields({
                    name: `[${chunkedArray[chunk][op].tag}] ${chunkedArray[chunk][op].game_name}`,
                    value: `**Op Name:** ${chunkedArray[chunk][op].operation_name}
                    **Op Type:** ${chunkedArray[chunk][op].type_name}
                    **Op Leader:** ${leader?.username ? leader?.username : "Unknown"}
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
     * @param   {XenOpservOperationModel}    op The op to create the embed for
     *
     * @returns {Promise<EmbedBuilder>} The embed for the op
     */
    private async createNotifyEmbed(op: XenOpservOperationModel): Promise<EmbedBuilder> {
        const timeDiff = op.date_start - (Date.now() / 1000);
        const leader = await this.client.xenDatabaseProvider.xenUserService.getUserByUserId(String(op.leader_user_id));
        return new EmbedBuilder()
            .setTitle(`Operation starting in ${this.client.utilities.notifyTime(timeDiff * 1000)} minutes!`)
            .setColor(embedColor as ColorResolvable)
            .addFields({
                name: `${op.game_name}`,
                value: `**Op Name:** ${op.operation_name}
                        **Op Type:** ${op.type_name}
                        **Op Leader:** ${leader?.username ? leader?.username : "Unknown"}
                        **Start Time:** ${this.client.utilities.unixFormat(op.date_start)}
                        Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${op.operation_id}&do=view) for more info!`
            });
    }
}