const { SlashCommandBuilder } = require('discord.js');
const User = require('../database/model/usersSchema');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("work and get some random amount of coins.")
        .addStringOption((option) =>
            option
                .setName("job")
                .setDescription("pick a job")
                .setRequired(true)
                .addChoices(
                    { name: 'Pizza Delivery', value: 'Deliver Pizza for people' },
                    { name: 'Developer', value: 'Develop Software and Sites' },
                    { name: 'Designer', value: 'Everyone loves designers, well.. except web developers.' },
                    { name: 'Body Guard', value: 'Protect Someone from being attacked' },
                    { name: 'Event Host', value: 'Probably you have high confidence to choose that.' },
                    { name: 'Grandma Helping', value: 'She really needs help, but don\'t worry! she\'ll pay' },
                )
        ),

    async execute(client, interaction) {
        const job = interaction.options.getString('job');
        const user = interaction.user;

        const data = await User.findOne({
            'user.id': user.id
        });

        if (!data) return interaction.reply({ content: "You still don't have a wallet yet.", ephemeral: true });

        const cooldown = parseInt(Date.now() - data.economy.jobs.work);

        if (cooldown < 0) return interaction.reply({ content: `You need to wait **${parseInt(-1 * cooldown/1000)}s** to use the commands again`, ephemeral: true });

        await interaction.deferReply();

        const randomIncome = Math.floor(Math.random() * (1000 - 300)) + 300;

        data.economy.wallet += randomIncome;
        data.economy.jobs.work = Date.now() + 300000;

        await data.save();

        interaction.editReply({ content: `You worked as **${job}** and earned **${randomIncome}** ${config.coinEmoji}` })
    }
}