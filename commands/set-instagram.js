const { SlashCommandBuilder } = require('discord.js');
const User = require('../database/model/usersSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-instagram")
        .setDescription("set your instagram username that will show on your profile")
        .addStringOption((option) =>
            option
                .setName('instagram')
                .setDescription("Your Instagram Username.")
                .setRequired(true)
        ),

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.user;
        const instagramUsername = interaction.options.getString('instagram');

        let data = await User.findOne({
            'user.id': user.id
        });

        if (!data) return interaction.editReply({ content: "You don't have a profile yet.", ephemeral: true });
        if (instagramUsername.length > 30) return interaction.editReply({ content: "Instagram max username length is 15", ephemeral: true });

        data.profile.social.instagram = instagramUsername.split(" ").join("_");

        await data.save();

        await interaction.editReply({ content: `New Instagram Username was Set Successfully to **${instagramUsername}**` });
    }
}