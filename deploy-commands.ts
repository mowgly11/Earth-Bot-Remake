const { REST, Routes } = require('discord.js');
const configFile = require('./config.json');
const fylesystem = require('node:fs');

const commands = [];

const commandsFiles = fylesystem.readdirSync('./commands').filter((file: string) => file.endsWith('.ts'));

for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(configFile.token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(configFile.clientId),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

// to delete all commands. commented for possible future reasons. 

/*rest.put(Routes.applicationCommands(configFile.clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);*/

export {}