const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ComponentType, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("check the bot's connection speed"),

    async execute(client, interaction) {
        await interaction.deferReply();

        let embed = new EmbedBuilder()
            .setTitle("Earth Bot Ping")
            .setDescription(`<:blurplebot:922906134862508103> - My ping is: \`${parseInt(client.ws.ping)}ms\`\n\n<a:IconServerSecurity:908091372593086505> - Database Speed: \`1ms\`\n\n<a:IconSlowMod:908091008980488213> - Response Time: \`${Date.now() - interaction.createdTimestamp}ms\``)
            .setColor(0x0099FF)
        const filter = m => m.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            time: 30000
        });

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("refresh")
                .setLabel("Refresh")
                .setStyle(3)
        );

        const buttonsD = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("refresh")
                .setLabel("Refresh")
                .setDisabled(true)
                .setStyle(3)
        );

        await interaction.editReply({
            embeds: [embed],
            components: [buttons]
        }).then(async inter => {
            collector.on("collect", async col => {
                if (col.user.id !== interaction.user.id) return col.reply({
                    content: "This button is not for you!", ephemeral: true
                });

                await col.deferUpdate();

                let embedR = new EmbedBuilder()
                    .setTitle("Earth Bot Ping")
                    .setDescription(`<:blurplebot:922906134862508103> - My ping is: \`${client.ws.ping}ms\`\n\n<a:IconServerSecurity:908091372593086505> - Database Speed: \`1ms\``)
                    .setColor(0x0099FF)

                await inter.edit({
                    embeds: [embedR]
                });
            });

            setTimeout(() => {
                let embedRE = new EmbedBuilder()
                    .setDescription("This embed has expired")
                    .setColor(0x0099FF)
                inter.edit({ embeds: [embedRE], components: [buttonsD] });
            }, 30000);
        })
    }
}