const { Events } = require('discord.js');
const client = require('../index');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: any) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};

export {}