const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');
const User = require('../database/model/usersSchema');
const config = require('../config.json');

let missionsList = ["Rob A Bank", "Sell Illegals", "Rob A Store", "Trade Weapons", "Contribute On A Street Fight", "Hack ATM's", "Rob Houses"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("crime")
        .setDescription("perform a crime and earn or lose some amount of coins."),

    async execute(client, interaction) {
        const user = interaction.user;

        const data = await User.findOne({
            'user.id': user.id
        });

        if (!data) return interaction.reply({ content: "You still don't have a wallet yet.", ephemeral: true });

        const cooldown = parseInt(Date.now() - data.economy.jobs.specialmission);

        if (cooldown < 0) return interaction.reply({ content: `You need to wait **${parseInt(-1 * cooldown / 1000)}s** to use the commands again`, ephemeral: true });

        await interaction.deferReply();

        let randomIncome = Math.floor(Math.random() * (2000 - 1000)) + 1000;
        let randomLoseIncome = Math.floor(Math.random() * (1000 - 500)) + 500;
        let chance = Math.floor(Math.random() * 10) + 1;

        let missions = [];

        while (missions.length < 3) {
            let selectedJob = missionsList[Math.floor(Math.random() * missionsList.length)]
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
            .setTitle(":detective: Available Crimes :detective:")
            .setDescription("Choose A Mission From The List Down Bellow")
            .setFooter({ text: "This Embed will stay valid for 60 seconds" })

        const reply = await interaction.editReply({ embeds: [ChoiceEmbed], components: [Buttons] });

        data.economy.jobs.specialmission = Date.now() + 420000;
        await data.save();

        collector.on("collect", async (col) => {
            await col.deferUpdate();

            let message = ``;

            if(chance >= 0 && chance <= 3) {
                message = `You Tried to **${col.customId}** But You Lost **${randomLoseIncome}** ${config.coinEmoji}`
                ChoiceEmbed.setColor('Red');
                data.economy.wallet -= randomLoseIncome;
            } else {
                message = `You Tried to **${col.customId}** and You Succeded! You Earned **${randomIncome}** ${config.coinEmoji}`
                ChoiceEmbed.setColor('Green');
                data.economy.wallet += randomIncome;
            }

            await data.save();

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