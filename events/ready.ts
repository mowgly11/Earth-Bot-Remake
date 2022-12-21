const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: { user: { tag: string } }) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};

export { }