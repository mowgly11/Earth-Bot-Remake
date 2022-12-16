const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ComponentType,
    ButtonBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("checks the bot's connection speed"),

    async execute(client, interaction) {
        await interaction.deferReply();

        let pingEmbed = new EmbedBuilder()
            .setTitle("Earth Bot Ping")
            .setDescription(`<:discordstagechannel:921550781994381313> - My ping is: 
            \`${parseInt(client.ws.ping)}ms\`\n\n<a:IconServerSecurity:908091372593086505> - Database Speed: 
            \`1ms\`\n\n<a:IconSlowMod:908091008980488213> - Response Time: 
            \`${Date.now() - interaction.createdTimestamp}ms\``)
            .setColor(0x0099FF)

        const collector = interaction.channel.createMessageComponentCollector({
            filter: (m) => m.user.id === interaction.user.id,
            componentType: ComponentType.Button,
            time: 1000 * 30
        });

        let buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("refresh")
                .setLabel("Refresh")
                .setStyle(3)
        );

        const inter = await interaction.editReply({
            embeds: [pingEmbed],
            components: [buttons]
        });

        collector.on("collect", async (collector) => {
            await collector.deferUpdate();

            pingEmbed.setDescription(`<:discordstagechannel:921550781994381313> - My ping is: 
                \`${client.ws.ping}ms\`\n\n<a:IconServerSecurity:908091372593086505> - Database Speed: 
                \`1ms\``)

            await inter.edit({
                embeds: [pingEmbed]
            });
        });

        setTimeout(() => {
            buttons.components[0].data.disabled = true;

            inter.edit({ embeds: [pingEmbed.setDescription("This embed has expired")], components: [buttons] });
        }, 30000);

    }
}