const weather = require('weather-js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("display the weather in a provided city")
        .addStringOption((option) =>
            option
                .setName("city")
                .setDescription("the city you want to get it's weather states")
                .setRequired(true)
        ),

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true });

        const args = interaction.options.getString("city");

        weather.find({
            search: args,
            degreeType: 'C'
        }, async (error, result) => {

            if (error) return interaction.editReply({ content: `${error}`, ephemeral: true });

            if (result == undefined || result.length === 0) return interaction.editReply({ content: '**invalid location**', ephemeral: true });

            let current = result[0].current;
            let location = result[0].location;

            const weatherinfo = new EmbedBuilder()
                .setAuthor({ name: `The weather in: ${current.observationpoint}` })
                .setThumbnail(current.imageUrl)
                .setColor('Yellow')
                .setDescription(`**${current.skytext}**`)
                .addFields({
                    name: 'Timezone',
                    value: `UTC${location.timezone}`,
                    inline: true
                }, {
                    name: 'Heat Calculation Unit ',
                    value: 'Celsius',
                    inline: true
                }, {
                    name: 'Temperature ',
                    value: `${current.temperature}°`,
                    inline: true
                }, {
                    name: 'Wind',
                    value: `${current.winddisplay}`,
                    inline: true
                }, {
                    name: 'Feels like',
                    value: `${current.feelslike}°`,
                    inline: true
                }, {
                    name: 'Humidity',
                    value: `${current.humidity}%`,
                    inline: true
                })

            await interaction.editReply({
                embeds: [weatherinfo]
            });
        });
    }
}