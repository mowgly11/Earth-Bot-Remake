const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("shows the bot informations"),

    async execute(client, interaction) {
        await interaction.deferReply();

        const sxy = client.users.cache.get(config.ownerId);

        const botEmbed = new EmbedBuilder()
            .setColor('#4d4d4d')
            .setTitle('Earth Bot Infos')
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("Blurple")
            .addFields(
                {
                    name: `── <:staff:898650012442042398> General <:staff:898650012442042398> ──`,
                    value: `:white_check_mark: Username: ${client.user.username}\n:white_check_mark: Tag: ${client.user.tag}\n:white_check_mark: Owned By: ${sxy.username}${sxy.discriminator} & rename⁴ you#4440\n:white_check_mark: ID: ${client.user.id}\n:white_check_mark: Created At: ${moment(client.user.createdAt).format("DD-MM-YYYY [at] HH:mm")}\n:white_check_mark: Servers Count: ${client.guilds.cache.size}`
                }
            )
        await interaction.followUp({ embeds: [botEmbed] });
    }
}