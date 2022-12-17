let config = require('./config.json');
const { Client,
    GatewayIntentBits,
    Collection
} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { init } = require('./database/mongoose');

init();

let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

module.exports = client;

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    const command = require(filePath);

    if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
    else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);

}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: any) => file.endsWith('.ts'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args: any) => event.execute(...args));
    } else {
        client.on(event.name, (...args: any) => event.execute(...args));
    }
}

client.login(config.token);