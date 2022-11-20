const { EmbedBuilder } = require("discord.js");

class DiscordOpsecOpPosting {
    async getOps(client) {
        client.logger.info(`[FUNCTION] - GetOps function used`);
        return await client.xenProvider.fetchOps(true)
            .then(data => client.botProvider.createOpsEntry(data))
            .catch(err => client.logger.error(err.stack))
    }

    async sendOpLists(client) {
        client.logger.info(`[FUNCTION] - SendOpLists function used`);
        let allOps = await client.botProvider.fetchOps()
            .catch(err => client.logger.error(err.stack))
        if (allOps === undefined || !allOps.length || allOps.length === 0) {
            client.logger.info(`[RETURNED] AllOps came back as ${allOps} - Failed.`);
            return
        }

        let guilds = await client.botProvider.fetchGuild()
        for (let guild in guilds) {
            let channels = await client.botProvider.fetchGameChannels(guilds[guild].id)
            let excluded = []

            for (let channel in channels) {
                let channelOps = []
                for (let op in allOps) {
                    if (allOps[op].game_id === parseInt(channels[channel].game_id)) {
                        channelOps.push(allOps[op])
                    }
                }

                let targetChannel = client.channels.cache.get(channels[channel].channel_id)
                if (channelOps.length <= 15 && channelOps >= 1) {
                    await DiscordOpsecOpPosting.#createOpEmbed(client, channelOps, targetChannel)
                } else {
                    await DiscordOpsecOpPosting.#createChunkedOpEmbed(client, channelOps, targetChannel, 15)
                }
                excluded.push(channels[channel].game_id)
            }

            let targetChannel = client.channels.cache.get(guilds[guild].announcement_channel)
            if (targetChannel != null) {
                allOps = await client.botProvider.fetchOps(excluded)
                    .catch(err => client.logger.error(err.stack))
                if (allOps === undefined || !allOps.length || allOps.length === 0) {
                    client.logger.info(`[RETURNED] AllOps - Empty or Failed.`);
                    return
                }

                if (allOps.length <= 15) {
                    await DiscordOpsecOpPosting.#createOpEmbed(client, allOps, targetChannel)
                } else {
                    await DiscordOpsecOpPosting.#createChunkedOpEmbed(client, allOps, targetChannel, 15)
                }
            }
        }
    }

    async notify(client) {
        client.logger.info(`[FUNCTION] - Notify function used`);
        let dateNow = Date.now() / 1000
        let allOps = await client.botProvider.fetchOps()
        for (let op in allOps) {
            let startDate = allOps[op].date_start
            if ((dateNow > (startDate - (60 * 30))) && (dateNow < startDate) && (allOps[op].notified !== 1)) {
                let embed = await DiscordOpsecOpPosting.#createNotifyEmbed(client, allOps, op, startDate, dateNow)
                let guilds = await client.botProvider.fetchGuild()
                for (let guild in guilds) {
                    let targetChannel = await client.botProvider.fetchGameChannels(guilds[guild].id, allOps[op].game_id)
                    if (targetChannel[0]?.channel_id) {
                        if (targetChannel.length === 0) {
                            targetChannel = await client.channels.cache.get(guilds[guild].announcement_channel)
                            if (targetChannel != null) {
                                targetChannel.send({ embeds: [embed] })
                            }
                        } else {
                            targetChannel = await client.channels.cache.get(targetChannel[0].channel_id)
                            targetChannel.send({ embeds: [embed] })
                        }
                    }
                }
                await client.botProvider.setOpNotified(allOps[op].operation_id)
            }
        }
    }

    /**
     * Create OP Embeds
     * @param {Object}      client          Discord Bot client
     * @param {Object[]}    ops             Array of Operations
     * @param {Object}      targetChannel   Discord Channel
     *
     * @return {Promise<void>}
     */
    static async #createOpEmbed(client, ops, targetChannel) {
        client.logger.info(`[FUNCTION] - [PRIVATE] CreateOpEmbed function used`);
        let embed = new EmbedBuilder()
            .setTitle("New Operations Posted!")
            .setColor(client.config.embedColor)

        for (let op in ops) {
            embed.addFields({
                name: `[${ops[op].tag}] ${ops[op].game_name}`,
                value: `**Op Name:** ${ops[op].operation_name}
                **Op Type:** ${ops[op].type_name}
                **Op Leader:** ${ops[op].leader_username}
                **Start Time:** ${client.utilities.unixFormat(ops[op].date_start)}
                Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${ops[op].operation_id}&do=view) for more info!`
            })
        }

        await targetChannel.send({embeds: [embed]})
    }

    /**
     * Create Chunked OP Embeds
     * @param {Object}      client          Discord Bot client
     * @param {Object[]}    ops             Array of Operations
     * @param {Number}      size            Size of chunk
     * @param {Object}      targetChannel   Discord Channel
     *
     * @return {Promise<void>}
     */
    static async #createChunkedOpEmbed(client, ops, targetChannel, size) {
        client.logger.info(`[FUNCTION] - [PRIVATE] createChunkedOpEmbed function used`);
        let chunkedArray = client.utilities.chunkArray(ops, size)
        for (let i = 0; i < chunkedArray.length; i++) {
            let embed = new EmbedBuilder()
                .setTitle("New Operations Posted!")
                .setColor(client.config.embedColor)
            for (let j = 0; j < chunkedArray[i].length; j++) {
                embed.addFields({
                    name: `[${chunkedArray[i][j].tag}] ${chunkedArray[i][j].game_name}`,
                    value: `**Op Name:** ${chunkedArray[i][j].operation_name}
                    **Op Type:** ${chunkedArray[i][j].type_name}
                    **Op Leader:** ${chunkedArray[i][j].leader_username}
                    **Start Time:** ${client.utilities.unixFormat(chunkedArray[i][j].date_start)}
                    Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${chunkedArray[i][j].operation_id}&do=view) for more info!`
                })
            }
            await targetChannel.send({embeds: [embed]})
        }
    }

    /**
     * Create Notify embed
     * @param {Object}      client          Discord Bot client
     * @param {Object[]}    allOps          Array of Operations
     * @param {Number}      currentOp       Current Operation from AllOps array
     * @param {Object}      startDate       Operation Start Date
     * @param {Number}      currentTime     Current timestamp
     *
     * @return {Promise<void>}
     */
    static async #createNotifyEmbed(client, allOps, currentOp, startDate, currentTime) {
        let timeDiff = startDate - currentTime
        return new EmbedBuilder()
            .setTitle(`Operation Starting in ${client.utilities.notifyTime(timeDiff * 1000)} Minutes!`)
            .setColor([200, 0, 0])
            .addFields({
                name: `${allOps[currentOp].game_name}`,
                value: `**Op Name:** ${allOps[currentOp].operation_name}
                    **Op Type:** ${allOps[currentOp].type_name}
                    **Op Leader:** ${allOps[currentOp].leader_username}
                    **Start Time:** ${client.utilities.unixFormat(allOps[currentOp].date_start)}
                    Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${allOps[currentOp].operation_id}&do=view) for more info!`
            })
    }
}

module.exports = DiscordOpsecOpPosting
