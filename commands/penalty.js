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

        if(data.economy.wallet < bid) return interaction.reply({ content: `You don't even have that amount.`, ephemeral: true });

        if (bid <= 0 || bid > 2000) return interaction.reply({ content: 'You can\'t bid with more than **2000** or with negative amounts.', ephemeral: true })

        await interaction.deferReply();

        const canvas = Canvas.createCanvas(500, 500);

        const ctx = canvas.getContext('2d');

        const baseImage = await Canvas.loadImage('assests/initial.png');
        const ball = await Canvas.loadImage('assests/football.png');
        const left = await Canvas.loadImage('assests/left.png');
        const right = await Canvas.loadImage('assests/right.png');
        const middle = await Canvas.loadImage('assests/middle.png');

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

            const canvas2 = Canvas.createCanvas(500, 500);

            const ctx2 = canvas2.getContext('2d');

            if (col.customId === goalKeeperGuess) {
                switch (col.customId) {
                    case 'left':
                        ctx2.drawImage(left, 0, 0, canvas2.width, canvas2.height);
                        ctx2.drawImage(ball, 100, 200, 20, 20);
                        message = `Bad Guess, You shooted **left** but the goalkeeper saved it. You Lost **${bid}** ${config.coinEmoji}`;
                        break;
                    case 'middle':
                        ctx2.drawImage(middle, 0, 0, canvas2.width, canvas2.height);
                        ctx2.drawImage(ball, 235, 200, 20, 20);
                        message = `Bad Guess, You shooted in the **middle** but the goalkeeper saved it. You Lost **${bid}** ${config.coinEmoji}`;
                        break;
                    case 'right':
                        ctx2.drawImage(middle, 0, 0, canvas2.width, canvas2.height);
                        ctx2.drawImage(ball, 380, 200, 20, 20);
                        message = `Bad Guess, You shooted **right** but the goalkeeper saved it. You Lost **${bid}** ${config.coinEmoji}`;
                        break;
                }
                
                data.economy.wallet += bid * 2;
                await data.save();
            } else {
                switch (col.customId) {
                    case 'left':
                        ctx2.drawImage(right, 0, 0, canvas2.width, canvas2.height);
                        ctx2.drawImage(ball, 100, 200, 20, 20);
                        message = `Good Guess, You shooted **left** and the goalkeeper didn't saved it. You won **${bid * 2}** ${config.coinEmoji}`;
                        break;
                    case 'middle':
                        ctx2.drawImage(left, 0, 0, canvas2.width, canvas2.height);
                        ctx2.drawImage(ball, 250, 200, 20, 20);
                        message = `Good Guess, You shooted in **the middle** and the goalkeeper didn't saved it. You won **${bid * 2}** ${config.coinEmoji}`;
                        break;
                    case 'right':
                        ctx2.drawImage(middle, 0, 0, canvas2.width, canvas2.height);
                        ctx2.drawImage(ball, 380, 200, 20, 20);
                        message = `Good Guess, You shooted **right** and the goalkeeper didn't saved it. You won **${bid * 2}** ${config.coinEmoji}`;
                        break;
                }
            }

            for (i = 0; i < 3; i++) {
                Buttons.components[i].data.disabled = true;
            }

            const imageEdited = new AttachmentBuilder(canvas2.toBuffer(), { name: 'penalty2.png' });

            ChoiceEmbed
                .setImage('attachment://penalty2.png')
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