const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("ask a question and get a random aswer from me")
        .addStringOption((option: any) =>
            option
                .setName("question")
                .setDescription("your question")
                .setRequired(true)
        ),

    async execute(client: any, interaction: any) {
        await interaction.deferReply();
        
        const args = interaction.options.getString("question");

        const replies = ['Yeah lol', 'Sure', 'yeah', 'No.', '100% No !', 'Maybe', ':x:', ':white_check_mark:', 'Strictement Yes', 'No Way', 'That\'s a Hell YEAH', 'No f*cking way', 'No :)', '50% yes', 'Not sure', 'I\'m busy right now do not distrub me', 'HAHAHAHAHAHA YEAH', 'ask your mom'];

        const result = Math.floor(Math.random() * replies.length);
        const question = args.join(' ');

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .addFields([
                {
                    name: "Question:",
                    value: `${question}`
                },
                {
                    name: 'Answer:',
                    value: `${replies[result]}`
                }
            ]);

        await interaction.editReply({
            embeds: [embed],
        });
    }
}