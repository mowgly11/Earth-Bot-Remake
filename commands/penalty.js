const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, AttachmentBuilder } = require('discord.js');
const User = require('../database/model/usersSchema');
const config = require('../config.json');
const Canvas = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("penalty")
        .setDescription("shout a penalty and win or lose some amount of coins")
        .addNumberOption(option =>
            option
                .setName('bid')
                .setDescription("Your bid on this penalty")
                .setRequired(true)
        ),

    async execute(client, interaction) {
        const user = interaction.user;
        const bid = parseInt(interaction.options.getNumber('bid'));

        const data = await User.findOne({
            'user.id': user.id
        });

        if (!data) return interaction.reply({ content: "You still don't have a wallet yet.", ephemeral: true });

        const cooldown = parseInt(Date.now() - data.economy.jobs.football);

        if (cooldown < 0) return interaction.reply({ content: `You need to wait **${parseInt(-1 * cooldown / 1000)}s** to use the commands again`, ephemeral: true });

        if (data.economy.wallet < bid) return interaction.reply({ content: `You don't even have that amount.`, ephemeral: true });

        if (bid <= 0 || bid > 2000) return interaction.reply({ content: 'You can\'t bid with more than **2000** or with negative amounts.', ephemeral: true })

        await interaction.deferReply();

        const canvas = Canvas.createCanvas(500, 500);

        const ctx = canvas.getContext('2d');

        const baseImage = await Canvas.loadImage('assests/initial.png');
        const ball = await Canvas.loadImage('assests/football.png');
        const left = {
            direction: 'left',
            img: await Canvas.loadImage('assests/left.png')
        };
        const right = {
            direction: 'right',
            img: await Canvas.loadImage('assests/right.png')
        };
        const middle = {
            direction: 'middle',
            img: await Canvas.loadImage('assests/middle.png')
        };

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        const collector = interaction.channel.createMessageComponentCollector({
            filter: (m) => m.user.id === interaction.user.id,
            componentType: ComponentType.Button,
            time: 1000 * 60
        });

        let goalKeeperGuesses = ['left', 'middle', 'right'];
        let goalKeeperGuess = goalKeeperGuesses[Math.floor(Math.random() * goalKeeperGuesses.length)];

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('left')
                .setLabel('Left')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("middle")
                .setLabel("Middle")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId('right')
                .setLabel('Right')
                .setStyle(ButtonStyle.Success)
        );

        const image = new AttachmentBuilder(canvas.toBuffer(), { name: 'penalty.png' });

        let ChoiceEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Penalty")
            .setDescription("Choose A Direction To Shoot The Ball")
            .setImage("attachment://penalty.png")
            .setFooter({ text: "This Embed will stay valid for 60 seconds" })

        const reply = await interaction.editReply({ embeds: [ChoiceEmbed], components: [Buttons], files: [image] });

        data.economy.jobs.football = Date.now() + 0;
        data.economy.wallet -= bid;

        await data.save();

        collector.on("collect", async (col) => {
            await col.deferUpdate();

            let message = "";

            switch (goalKeeperGuess) {
                case 'left':
                    ctx.drawImage(left.img, 0, 0, canvas.width, canvas.height);
                    break;
                case 'right':
                    ctx.drawImage(right.img, 0, 0, canvas.width, canvas.height);
                    break;
                case 'middle':
                    ctx.drawImage(middle.img, 0, 0, canvas.width, canvas.height);
                    break;
            }

            if (col.customId === goalKeeperGuess) {
                switch (col.customId) {
                    case 'left':
                        ctx.drawImage(ball, 120, 160, 20, 20);
                        message = `Bad Guess, You shooted **left** and the goalkeeper guessed **${goalKeeperGuess}** You Lost **${bid}** ${config.coinEmoji}`;
                        break;
                    case 'middle':
                        ctx.drawImage(ball, 235, 180, 20, 20);
                        message = `Bad Guess, You shooted in the **middle** and the goalkeeper guessed **${goalKeeperGuess}** You Lost **${bid}** ${config.coinEmoji}`;
                        break;
                    case 'right':
                        ctx.drawImage(ball, 360, 190, 20, 20);
                        message = `Bad Guess, You shooted **right** and the goalkeeper guessed **${goalKeeperGuess}** You Lost **${bid}** ${config.coinEmoji}`;
                        break;
                }

                data.economy.wallet += bid * 1.5;
                await data.save();
            } else if (col.customId !== goalKeeperGuess) {
                switch (col.customId) {
                    case 'left':
                        ctx.drawImage(ball, 100, 200, 20, 20);
                        message = `Good Guess, You shooted **left** but the goalkeeper guessed **${goalKeeperGuess}**. You won **${bid * 1.5}** ${config.coinEmoji}`;
                        break;
                    case 'middle':
                        ctx.drawImage(ball, 250, 180, 20, 20);
                        message = `Good Guess, You shooted in **the middle** but the goalkeeper guessed **${goalKeeperGuess}**. You won **${bid * 1.5}** ${config.coinEmoji}`;
                        break;
                    case 'right':
                        ctx.drawImage(ball, 360, 190, 20, 20);
                        message = `Good Guess, You shooted **right** but the goalkeeper guessed **${goalKeeperGuess}**. You won **${bid * 1.5}** ${config.coinEmoji}`;
                        break;
                }
            }

            for (i = 0; i < 3; i++) {
                Buttons.components[i].data.disabled = true;
            }

            const imageEdited = new AttachmentBuilder(canvas.toBuffer(), { name: 'penalty.png' });

            ChoiceEmbed
                .setImage('attachment://penalty.png')
                .setDescription(`${message}`);

            await reply.edit({ embeds: [ChoiceEmbed], files: [imageEdited], components: [Buttons] })

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