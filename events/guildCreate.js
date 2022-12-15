const { Events, EmbedBuilder } = require('discord.js');
const client = require('../index');
const config = require('../config.json');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const joinChannel = client.channels.cache.get(config.configChannels.joinChannel);
        const embed = new EmbedBuilder()
            .setDescription(`**joined a new guild !**\n\n**Guild Name:** ${guild.name}\n members count: ${guild.memberCount}\nowned by : ${guild.ownerId}`)
            .setThumbnail(guild.iconURL())
            .setColor('Green')
            .setTimestamp()
        joinChannel.send({
            embeds: [embed]
        });
    }
}