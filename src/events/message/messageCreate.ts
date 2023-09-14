import {ChannelType, Events, Message, ThreadChannel} from "discord.js";
import {BWC_Client} from "../../lib/index.js";


export const data = {
    name: Events.MessageCreate
}

export async function execute(client: BWC_Client, message: Message ) {
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) return;

    if (await client.threadController.getThread(message.channelId)) {
        await client.threadController.updateThreadDeleteAt(message.channel as ThreadChannel);
    }
}