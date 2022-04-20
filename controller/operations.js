const { MessageEmbed } = require('discord.js')
const { chunkArray } = require('../functions')
const { embedColor } = require('../settings.json')
const { unixFormat, notifyTime } = require('../functions')

// noinspection JSUnresolvedVariable,DuplicatedCode
class MasterController {
    async getOps(client) {
        client.logger.info(`- [FUNCTION] - GetOps function used`);
        return await client.xenProvider.fetchOps()
            .then(data => client.botProvider.createOpEntry(data))
            .catch(err => client.logger.error(err.stack))
    }

    async getOpList(client) {
        client.logger.info(`- [FUNCTION] - GetOpList function used`);

        let data = await client.botProvider.fetchOps()
        if (data === undefined || !data.length || data.length === 0) return;

        let guilds = await client.botProvider.fetchGuild()
        for (let guild in guilds) {
            let channels = await client.botProvider.fetchGameChannels(guilds[guild].dataValues.id)
            let excluded = []

            for (let channel in channels) {
                let ops = []
                for (let op in data) {
                    if (data[op].game_id === parseInt(channels[channel].dataValues.id)) {
                        ops.push(data[op].dataValues)
                    }
                }
                let target_channel = client.channels.cache.get(channels[channel].dataValues.channel_id)
                if (ops.length <= 15 && ops.length >= 1) {
                    let embed = new MessageEmbed()
                        .setTitle("New Operations Posted!")
                        .setColor(embedColor)

                    for (let op in ops) {
                        embed.addField(`[${ops[op].tag}] ${ops[op].game_name}`,
                            `**Op Name:** ${ops[op].operation_name}
                            **Op Type:** ${ops[op].type_name}
                            **Op Leader:** ${ops[op].leader_username}
                            **Start Time:** ${unixFormat(ops[op].date_start)}
                            Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${ops[op].operation_id}&do=view) for more info!`)
                    }
                    console.log(embed.length)
                    await target_channel.send({embeds: [embed]});
                } else {
                    let chunkedArray = chunkArray(ops, 15);
                    for (let i = 0; i < chunkedArray.length; i++) {
                        let embed = new MessageEmbed()
                            .setTitle("New Operations Posted!")
                            .setColor([200, 0, 0])
                        for (let j = 0; j < chunkedArray[i].length; j++) {
                            embed.addField(`[${chunkedArray[i][j].tag}] ${chunkedArray[i][j].game_name}`,
                                `**Op Name:** ${chunkedArray[i][j].operation_name}
                                **Op Type:** ${chunkedArray[i][j].type_name}
                                **Op Leader:** ${chunkedArray[i][j].leader_username}
                                **Start Time:** ${unixFormat(chunkedArray[i][j].date_start)}
                                Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${chunkedArray[i][j].operation_id}&do=view) for more info!`)
                        }
                        console.log(embed.length)
                        await target_channel.send({embeds: [embed]});
                    }
                }
                excluded.push(channels[channel].dataValues.id)
            }

            let target_channel = client.channels.cache.get(guilds[guild].dataValues.announcement_channel)
            if (target_channel != null) {
                data = await client.botProvider.fetchOps(excluded)
                if (data === undefined || !data.length || data.length === 0) return;

                if (data.length <= 15) {
                    let embed = new MessageEmbed()
                        .setTitle("New Operations Posted!")
                        .setColor([200, 0, 0])

                    for (let op in data) {
                        embed.addField(`[${data[op].tag}] ${data[op].game_name}`,
                            `**Op Name:** ${data[op].operation_name}
                            **Op Type:** ${data[op].type_name}
                            **Op Leader:** ${data[op].leader_username}
                            **Start Time:** ${unixFormat(data[op].date_start)}
                            Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${data[op].operation_id}&do=view) for more info!`)
                    }
                    console.log(embed.length)
                    await target_channel.send({embeds: [embed]});
                } else {
                    let chunkedArray = chunkArray(data, 15);
                    for (let i = 0; i < chunkedArray.length; i++) {
                        let embed = new MessageEmbed()
                            .setTitle("New Operations Posted!")
                            .setColor([200, 0, 0])
                        for (let j = 0; j < chunkedArray[i].length; j++) {
                            embed.addField(`[${chunkedArray[i][j].tag}] ${chunkedArray[i][j].game_name}`,
                            `**Op Name:** ${chunkedArray[i][j].operation_name}
                            **Op Type:** ${chunkedArray[i][j].type_name}
                            **Op Leader:** ${chunkedArray[i][j].leader_username}
                            **Start Time:** ${unixFormat(chunkedArray[i][j].date_start)}
                            Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${chunkedArray[i][j].operation_id}&do=view) for more info!`)
                        }
                        console.log(embed.length)
                        await target_channel.send({embeds: [embed]});
                    }
                }
            }
        }
    }

    async notify(client) {
        client.logger.info(`- [FUNCTION] - Notify function used`);

        let data = await client.botProvider.fetchOps();
        for (let operation in data) {
            let startDate = data[operation].date_start;
            if (((Date.now() / 1000) > (startDate - (60 * 30))) && data[operation].notified !== 1) {
                if ((Date.now() / 1000) < startDate) {
                    let timeDiff = (startDate - (Date.now() / 1000))
                    let embed = new MessageEmbed()
                        .setTitle(`Operation Starting in ${notifyTime(timeDiff*1000)} Minutes!`)
                        .setColor([200,0,0])
                        .addField(data[operation].game_name,
                            `**Op Name:** ${data[operation].operation_name}
                            **Op Type:** ${data[operation].type_name}
                            **Op Leader:** ${data[operation].leader_username}
                            **Start Time:** ${unixFormat(data[operation].date_start)}
                            Go to [Opserv](https://the-bwc.com/opserv/operation.php?id=${data[operation].operation_id}&do=view) for more info!`)

                    let guilds = await client.botProvider.fetchGuild()
                    for (let guild in guilds) {
                        let target_channel = await client.botProvider.fetchGameChannels(guilds[guild].dataValues.id, data[operation].game_id)
                        if (target_channel.length === 0) {
                            target_channel = await client.channels.cache.get(guilds[guild].dataValues.announcement_channel)
                            if (target_channel != null) {
                                target_channel.send({embeds: [embed]})
                            }
                        } else {
                            target_channel = await client.channels.cache.get(target_channel[0].dataValues.channel_id)
                            target_channel.send({embeds: [embed]})
                        }
                    }
                    await client.botProvider.updateOpEntry(data[operation].operation_id)
                }
            }
        }
    }
}

module.exports = MasterController
