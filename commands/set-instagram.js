const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-instagram")
        .setDescription("display a user avatar")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("the user you want to get his avatar")
        ),

    async execute(client, interaction) {
        
    }
}