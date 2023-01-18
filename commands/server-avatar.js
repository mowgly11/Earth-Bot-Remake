const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-avatar")
    .setDescription("display the current server's icon"),


  async execute(client, interaction) {
    await interaction.deferReply();

    const replies = [
      'my rate : ⭐⭐⭐⭐⭐',
      'my rate : ⭐⭐⭐⭐'
    ]

    let embed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.guild.name}'s Icon` })
      .setColor(0x0099FF)
      .setTitle('Download Link')
      .setURL(interaction.guild.iconURL({
        dynamic: true,
        size: 4096
      }))
      .setImage(interaction.guild.iconURL({ dynamic: true, size: 4096 }))
      .setTimestamp()
      .setFooter({ text: (replies[Math.floor(Math.random() * replies.length)]) })

    await interaction.editReply({
      embeds: [embed]
    });
  }
}

