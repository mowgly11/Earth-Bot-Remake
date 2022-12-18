const {
  EmbedBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wikipedia")
    .setDescription("searches in wikipedia for a choosen subject")
    .addStringOption((option: any) =>
      option
        .setName("search")
        .setDescription("the subject you want to search about")
        .setRequired(true)
    ),

  async execute(client: any, interaction: any) {
    await interaction.deferReply({ ephemeral: true });

    const args = interaction.options.getString("search");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args)}`

    let response = await fetch(url).then((res: any) => res.json()).catch((err: any) => {
      return interaction.editReply({ content: 'An Error Occured, Try Again.', ephemeral: true });
    });

    let responseEmbed = new EmbedBuilder()

    switch (response.type) {
      case 'disambiguation':
        responseEmbed = responseEmbed
          .setColor(0x0099FF)
          .setTitle(response.title)
          .setURL(response.content_urls.desktop.page)
          .setDescription([`
            ${response.extract}
            Links For Topic You Searched [Link](${response.content_urls.desktop.page}).`]);
        break;
      case 'standard':
        responseEmbed = responseEmbed
          .setColor(0x0099FF)
          .setTitle(response.title)
          .setThumbnail(response.thumbnail.source)
          .setURL(response.content_urls.desktop.page)
          .setDescription(response.extract)
        break;
      default:
        responseEmbed = responseEmbed
          .setColor('Red')
          .setDescription("**No Results.**")
    }

    await interaction.editReply({ embeds: [responseEmbed], ephemeral: true })
  }
}

export { }