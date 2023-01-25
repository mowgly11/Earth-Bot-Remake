const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');
const User = require('../database/model/usersSchema');
const config = require('../config.json');

let missionsList = [""]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("specialmission")
        .setDescription("perform a special mission and earn or lose some amount of coins."),

    async execute(client, interaction) {
        const user = interaction.user;

        const data = await User.findOne({
            'user.id': user.id
        });

        if (!data) return interaction.reply({ content: "You still don't have a wallet yet.", ephemeral: true });

        const cooldown = parseInt(Date.now() - data.economy.jobs.specialmission);

        if (cooldown < 0) return interaction.reply({ content: `You need to wait **${parseInt(-1 * cooldown / 1000)}s** to use the commands again`, ephemeral: true });

        await interaction.deferReply();

        let randomIncome = Math.floor(Math.random() * (2000 - 700)) + 700;

        let missions = [];

        while (missions.length < 3) {
            let selectedJob = jobsList[Math.floor(Math.random() * jobsList.length)]
            if (missions.indexOf(selectedJob) === -1) missions.push(selectedJob);
        }

        const collector = interaction.channel.createMessageComponentCollector({
            filter: (m) => m.user.id === interaction.user.id,
            componentType: ComponentType.Button,
            time: 1000 * 60
        });

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(missions[0])
                .setLabel(missions[0])
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(missions[1])
                .setLabel(missions[1])
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(missions[2])
                .setLabel(missions[2])
                .setStyle(ButtonStyle.Primary)
        );

        let ChoiceEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Available missions")
            .setDescription("Choose A Job From The List Down Bellow")
            .setFooter({ text: "This Embed will stay valid for 60 seconds" })

        const reply = await interaction.editReply({ embeds: [ChoiceEmbed], components: [Buttons] });

        data.economy.jobs.specialmission = Date.now() + 420000;
        await data.save();

        collector.on("collect", async (col) => {
            await col.deferUpdate();

            let message = `You specialmissioned at **${col.customId}** and you Earned **${randomIncome}** ${config.coinEmoji}`

            if (col.customId === "A SECRET JOB!!!") {
                randomIncome = 2000;
                message = `**:tada: Congrats!** You specialmissioned at **${col.customId}** and you Earned **${randomIncome}** ${config.coinEmoji}`
            }

            data.economy.wallet += randomIncome;

            await data.save();

            for (i = 0; i < 3; i++) {
                Buttons.components[i].data.disabled = true;
            }

            await reply.edit({
                embeds: [ChoiceEmbed.setDescription(`${message}`)],
                components: [Buttons]
            });

            collector.stop();
        });

        collector.on('end', () => {
            for (i = 0; i < 3; i++) {
                Buttons.components[i].data.disabled = true;
            }
            reply.edit({ components: [Buttons] });
        });
    }
}