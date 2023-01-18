const { REST, Routes } = require('discord.js');
const config = require('./config.json');
const fs = require('node:fs');

const commands = [];

const commandsFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.ts'));

for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

// to delete all commands. commented for possible future reasons. 

/*rest.put(Routes.applicationCommands(config.clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);*/