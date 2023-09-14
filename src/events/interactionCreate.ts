import { Collection, Events, GuildMember, Interaction } from 'discord.js';
import { BWC_Client } from "../lib/index.js";
import moment from 'moment';
import {ButtonModule, CommandModule} from "../interfaces/modules.interface.js";
import {TimeStamps} from "../interfaces/collections.interface.js";

const buttonCooldown = new Collection();

export const data = {
    name: Events.InteractionCreate
};

export async function execute(client: BWC_Client, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
        const command: CommandModule | undefined = client.commands.get(interaction.commandName);

        if (!command) {
            client.logger.warn(`No command matching '${interaction.commandName}' was found!`, { label: 'DISCORD' });
            return;
        }

        const member = interaction.member as GuildMember;
        if (command.permission && member && !member.permissions.has(command.permission)) {
            if (interaction.deferred) {
                await interaction.followUp({ content: `You do not have permission to use this command!`, ephemeral: true })
                return;
            }
            interaction.reply({ content: `You do not have permission to use this command!`, ephemeral: true });
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error: any) {
            if (interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                client.logger.error(error.stack, { label: 'DISCORD' });
                return;
            }

            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            client.logger.error(error.stack, { label: 'DISCORD' });
        }
    }

    if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);

        if (!button) {
            client.logger.warn(`No button matching '${interaction.customId}' was found!`, { label: 'DISCORD' });
            return;
        }

        // COOLDOWN CHECK
        const currentTiem = Date.now();
        const timeStamps: TimeStamps = <TimeStamps>buttonCooldown.get(interaction.customId) || new Collection();
        const colldownAmount = (button.cooldown) * 1000;
        if (timeStamps.has(interaction.user.id)) {
            const expirationTime = timeStamps.get(interaction.user.id) + colldownAmount

            if (currentTiem < expirationTime) {
                const timeLeft = (expirationTime - currentTiem);
                const time = moment.utc(timeLeft).format('HH:mm:ss');
                return interaction.reply({ content: `You are on cooldown! Please wait ${time} before using this button again!`, ephemeral: true });
            }
        }

        try {
            await button.execute(interaction);
        } catch (error: any) {
            if (interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this button!', ephemeral: true });
                client.logger.error(error.stack, { label: 'DISCORD' });
                return;
            }

            await interaction.reply({content: 'There was an error while executing this button!', ephemeral: true});
            client.logger.error(error.stack, { label: 'DISCORD' });
        }
    }

    if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);

        if (!modal) {
            client.logger.warn(`No modal matching '${interaction.customId}' was found!`, { label: 'DISCORD' });
            return;
        }

        // COOLDOWN CHECK
        const button: ButtonModule | undefined = client.buttons.get(interaction.customId);
        if (!buttonCooldown.has(interaction.customId)) {
            buttonCooldown.set(interaction.customId, new Collection());
        }

        const currentTiem = Date.now();
        const timeStamps: TimeStamps = <TimeStamps>buttonCooldown.get(interaction.customId);
        let cooldownAmount: number;
        if (button?.cooldown){
             cooldownAmount = (button.cooldown) * 1000;
        } else {
            cooldownAmount = 0;
        }

        timeStamps.set(interaction.user.id, currentTiem);
        setTimeout(() => timeStamps?.delete(interaction.user.id), cooldownAmount);

        try {
            await modal.execute(interaction);
        } catch (err: any) {
            if (interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this modal!', ephemeral: true });
                client.logger.error(err.stack, { label: 'DISCORD' });
                return;
            }

            await interaction.reply({content: 'There was an error while executing this modal!', ephemeral: true});
            client.logger.error(err.stack, { label: 'DISCORD' });
        }
    }

    // if interaction doesn't match any of the above, return
    return;
}