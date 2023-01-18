const { SlashCommandBuilder } = require('discord.js');
const User = require('../database/model/usersSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-status")
        .setDescription("set a custom status that will show in your profile")
        .addStringOption((option) =>
            option
                .setName("status")
                .setDescription("your new status")
                .setRequired(true)
        ),

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const user = interaction.user;
        const newStatus = interaction.options.getString('status');

        let data = await User.findOne({
            'user.id': user.id
        });

        if (!data) return interaction.editReply({ content: "You don't have a profile yet.", ephemeral: true });
        if (newStatus.length > 80) return interaction.editReply({ content: "Bio max length is 80", ephemeral: true });

        data.profile.profileCustomisation.title = newStatus;

        await data.save();

        await interaction.followUp({ content: `New Status was Set Successfully to **${newStatus}**` });
    }
}