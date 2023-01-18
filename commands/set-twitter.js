const { SlashCommandBuilder } = require('discord.js');
const User = require('../database/model/usersSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-twitter")
        .setDescription("set your twitter username that will show on your profile")
        .addStringOption((option) =>
            option
                .setName("twitter")
                .setDescription("Your twitter username")
                .setRequired(true)
        ),

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.user;
        const TwitterUsername = interaction.options.getString('twitter');

        let data = await User.findOne({
            'user.id': user.id
        });

        if (!data) return interaction.editReply({ content: "You don't have a profile yet.", ephemeral: true });
        if (TwitterUsername.length > 30) return interaction.editReply({ content: "Twitter max username length is 15", ephemeral: true });

        data.profile.social.twitter = TwitterUsername.split(" ").join("_");

        await data.save();

        await interaction.editReply({ content: `New Twitter Username was Set Successfully to **${TwitterUsername}**` });
    }
}