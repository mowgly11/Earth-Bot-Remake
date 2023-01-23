const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server-banner")
        .setDescription("display the current server's banner"),

    async execute(client, interaction) {
        
        const banner = interaction.guild.bannerURL({
            dynamic: true,
            size: 4096
        });
        
        if (!banner) return interaction.reply({
            content: "This server has no banner.",
            ephemeral: true
        });
        

        await interaction.deferReply();

        await interaction.editReply({
            content: ":arrow_right: Here is the server banner, i really like it",
            files: [banner]
        });
    }
}

