import { Events } from 'discord.js';
import { BWC_Client } from "../../lib/index.js";

export const data = {
    name: Events.MessageReactionRemove
};

export async function execute(client: BWC_Client, reaction: any, user: any) {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id === '1040069005303631893') {
        if (reaction.emoji.name === 'emergencystar') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('1040092785333776465');
        }
        if (reaction.emoji.name === 'logistics') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('1041028893974483196');
        }
        if (reaction.emoji.name === 'prison') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('1041028785962749954');
        }
        if (reaction.emoji.name === 'combat') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('1041028793365712977');
        }
        if (reaction.emoji.name === 'economy') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('1041028741947727904');
        }
    }
}