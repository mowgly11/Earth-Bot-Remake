const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("display a user avatar")
        .addUserOption((option: any) =>
            option
                .setName("user")
                .setDescription("the user you want to get his avatar")
        ),

    async execute(client: any, interaction: any) {
        await interaction.deferReply();

        let target = interaction.options.getUser('user');
        
        if (!target) target = interaction.user;
        target = await interaction.guild.members.fetch(target);

        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext("2d");

        const avatar = await loadImage(`https://cdn.discordapp.com/avatars/${target.user.id}/${target.user.avatar}.png`);

        ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'avatar.png' });

        await interaction.editReply({ files: [attachment] });
    }
}

export {}