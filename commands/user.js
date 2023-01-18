const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { toTimestamp } = require('../useful-functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.')
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("user you want to get info about")
        ),
    async execute(client, interaction) {
        await interaction.deferReply();
        
        let target = interaction.options.getUser('target');
        if(!target) target = interaction.user;
        target = await interaction.guild.members.fetch(target);

        const response = new EmbedBuilder()
            .setAuthor({
                name: `${target.user.username}`,
                iconURL: target.displayAvatarURL({
                    dynamic: true
                })
            })
            .setThumbnail(target.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0x0099FF)
            .addFields(
                {
                    name: "user ID",
                    value: `\`${target.id}\``,
                    inline: false
                },
                {
                    name: "Joined Server At",
                    value: `<t:${toTimestamp(target.joinedAt)}:R>`,
                    inline: true
                },
                {
                    name: "Joined Discord At",
                    value: `<t:${toTimestamp(target.user.createdAt)}:R>`,
                    inline: true
                })
            .setTimestamp();

        await interaction.editReply({ embeds: [response] });
    },
};