import {BWC_Client} from "../lib/index.js";
import {ChannelType} from "discord.js";

export default class DiscordThreadController {
    private client: BWC_Client;
    constructor(client: BWC_Client) {
        this.client = client;
    }

    /**
     * Gets all the voice channels in the main guild
     *
     * @returns {Promise<{ id: string; name: string; }[]>}       The list of voice channels
     */
    public async getAllVoiceChannels(): Promise<{ id: string; name: string; }[]> {
        const guild = await this.client.guilds.fetch(this.client.getMainGuild());
        const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice);

        let formattedChannels: { id: string; name: string; }[] = [];
        channels.forEach(channel => {
            formattedChannels.push({
                id: channel.id,
                name: channel.name
            })
        })

        formattedChannels.sort((a, b) => {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0
        })

        return formattedChannels;
    }
}