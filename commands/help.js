const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("See All The Bot Commands."),
    async execute(client, interaction) {
        await interaction.deferReply();

        const filter = u => u.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            time: 1000 * 60
        });

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("previous")
                .setLabel("Previous")
                .setEmoji("⬅")
                .setStyle("Danger"),

            new ButtonBuilder()
                .setCustomId("next")
                .setLabel("Next")
                .setEmoji("➡")
                .setStyle("Success"),

            new ButtonBuilder()
                .setCustomId("stop")
                .setLabel("Stop")
                .setStyle("Secondary")
        )

        const commands = client.commands;
        let commandsArray = [];
        let finalArray = [];

        commands.forEach(cmd => {
            commandsArray.push(`**Command:** \`/${cmd.data.name}\`\n**Description:** ${cmd.data.description}\n\n`);
        });

        let divider = parseInt((commandsArray.length - 1) / 7);

        if((commandsArray.length - 1) % 7 !== 0) divider += 1

        let x = 0;
        let y = 7;

        for (let i = 0; i < divider; i++) {
            finalArray.push(commandsArray.slice(x, y));
            x += 7;
            y += 7;
        }

        let pageIndex = 0;

        let helpEmbed = new EmbedBuilder()
            .setTitle('Earth Bot Commands')
            .setThumbnail(client.user.avatar)
            .setDescription(finalArray[pageIndex].join(""))
            .setColor('Blurple')

        const reply = await interaction.editReply({ embeds: [helpEmbed], components: [Buttons] });

        collector.on("collect", async (col) => {
            await col.deferUpdate();

            switch (col.customId) {
                case "stop":
                    collector.stop();
                    break;
                case "next":
                    pageIndex += 1;
                    if(pageIndex > finalArray.length - 1) pageIndex = 0;
                    await reply.edit({ content: `${pageIndex}`, embeds: [helpEmbed.setDescription(finalArray[pageIndex].join(""))] });
                    break;
                case "previous":
                    pageIndex -= 1;
                    if(pageIndex < 0) pageIndex = finalArray.length - 1;
                    await reply.edit({ content: `${pageIndex}`, embeds: [helpEmbed.setDescription(finalArray[pageIndex].join(""))] });
                    break;
            }
        });

        collector.on('end', () => {
            for (i = 0; i < 3; i++) {
                Buttons.components[i].data.disabled = true;
            }
            reply.edit({ components: [Buttons] });
        })
    }
}