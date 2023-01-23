const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');
const User = require('../database/model/usersSchema');
const config = require('../config.json');

let jobsList = ["Software Development", "Pizza Delivery", "Night Protection", "Hotel Reception", "McDonalds", "Security", "Mining"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("work and get some random amount of coins."),

    async execute(client, interaction) {
        const user = interaction.user;

        const data = await User.findOne({
            'user.id': user.id
        });

        if (!data) return interaction.reply({ content: "You still don't have a wallet yet.", ephemeral: true });

        const cooldown = parseInt(Date.now() - data.economy.jobs.work);

        if (cooldown < 0) return interaction.reply({ content: `You need to wait **${parseInt(-1 * cooldown / 1000)}s** to use the commands again`, ephemeral: true });

        await interaction.deferReply();

        const randomIncome = Math.floor(Math.random() * (1000 - 300)) + 300;

        let jobs = [];

        while (jobs.length < 3) {
            let selectedJob = jobsList[Math.floor(Math.random() * jobsList.length)]
            if (jobs.indexOf(selectedJob) === -1) jobs.push(selectedJob);
        }

        const collector = interaction.channel.createMessageComponentCollector({
            filter: (m) => m.user.id === interaction.user.id,
            componentType: ComponentType.Button,
            time: 1000 * 60
        });

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(jobs[0])
                .setLabel(jobs[0])
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(jobs[1])
                .setLabel(jobs[1])
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(jobs[2])
                .setLabel(jobs[2])
                .setStyle(ButtonStyle.Primary)
        );

        let ChoiceEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Available Jobs")
            .setDescription("Choose A Job From The List Down Bellow")
            .setFooter({ text: "This Embed will stay valid for 60 seconds" })

        const reply = await interaction.editReply({ embeds: [ChoiceEmbed], components: [Buttons] });

        data.economy.jobs.work = Date.now() + 300000;
        await data.save();

        collector.on("collect", async (collector) => {
            await collector.deferUpdate();

            data.economy.wallet += randomIncome;

            await data.save();

            for(i = 0; i < 3; i++) {
                Buttons.components[i].data.disabled = true;
            }

            await reply.edit({
                embeds: [ChoiceEmbed.setDescription(`You Worked at **${collector.customId}** and you Earned **${randomIncome}** ${config.coinEmoji}`)],
                components: [Buttons]
            });
        });

        collector.on('end', () => {
            for(i = 0; i < 3; i++) {
                Buttons.components[i].data.disabled = true;
            }

            reply.edit({ embeds: [ChoiceEmbed.setDescription("This embed has expired")], components: [Buttons] });
        });
    }
}