const { SlashCommandBuilder } = require('discord.js');
const User = require('../database/model/usersSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wallet")
        .setDescription("Check how much Earth Coins do you/a user have")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("the user you want to see his wallet")
                .setRequired(false)
        ),

    async execute(client, interaction) {
        let user = interaction.options.getUser("user");
        if(!user) user = interaction.user;

        await interaction.deferReply();
        
        let data = await User.findOne({
            'user.id': user.id
        });
        
        if(!data) return interaction.reply({ content: "This user doesn't have a wallet yet." });

        await interaction.editReply(`**${user.username}'s** Wallet has **${data.economy.wallet}** <:earthcoin:1065401906236751912>`)
    }
}