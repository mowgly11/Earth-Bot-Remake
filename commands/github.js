const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("github")
        .setDescription("displays a user github profile")
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("the username you want to get its github profile")
                .setRequired(true)
        ),

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        const name = interaction.options.getString("username");

        const url = `https://api.github.com/users/${name}`;

        let response = await fetch(url).then((res) => res.json()).catch((err) => {
            return interaction.editReply({ content: 'An Error Occured, Try Again.', ephemeral: true })
        });

        try {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${response.login}(${response.id})`)
                .setURL(response.html_url)
                .setThumbnail(response.avatar_url)
                .setDescription(response.bio ? response.bio : 'No Bio')
                .addFields({
                    name: 'Public Repositories:-',
                    value: response.public_repos.toLocaleString()
                }, {
                    name: 'Followers:-',
                    value: response.followers.toLocaleString()
                }, {
                    name: 'Following:-',
                    value: response.following.toLocaleString()
                }, {
                    name: 'Email:-',
                    value: response.email ? response.email : 'No Email'
                }, {
                    name: 'Location:-',
                    value: response.location ? response.location : 'No Location'
                })

            await interaction.editReply({
                embeds: [embed],
                ephemeral: true
            });
        } catch (err) {
            return interaction.editReply({ content: ':x: **No result**', ephemeral: true });
        }
    }
}

