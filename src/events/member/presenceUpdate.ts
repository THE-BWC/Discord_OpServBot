import { Events, Presence } from 'discord.js';
import { BWC_Client } from "../../lib/index.js";
import { discordServer } from "../../envs.js";

export const data = {
    name: Events.PresenceUpdate
};

export async function execute(client: BWC_Client, oldPresence: Presence, newPresence: any) {
    if (newPresence === undefined || newPresence === null) return;

    const member = await newPresence.guild.members.fetch(newPresence.userId);
    if (member === undefined || member === null || member.user.bot) return;

    // Check if the user has the BWC role, if not, return.
    const confirmedRole = client.getBWCRole();
    if (!member.roles.cache.find((role: { id: string; }) => role.id === confirmedRole)) return;

    if (newPresence.guild.id === discordServer) {
        const streamRole = client.getStreamerRole();
        if (newPresence.activities.find((activity: { type: number; }) => activity.type === 1)) {
            member.roles.add(newPresence.guild.roles.cache.find((role: { id: string; }) => role.id === streamRole))
        }
        if (member.roles.cache.find((role: { id: string; }) => role.id === streamRole &&
            !newPresence.activities.find((activity: { type: number; }) => activity.type === 1))
            ) {
            member.roles.remove(newPresence.guild.roles.cache.find((role: { id: string; }) => role.id === streamRole))
        }
    }
}