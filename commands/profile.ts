const {
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder
} = require('discord.js')
const User = require('../database/model/usersSchema.ts');
const Canvas = require('canvas');
const numeral = require('numeral');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("display a user profile")
    .addUserOption((option: any) =>
      option
        .setName("user")
        .setDescription("the user you want to get his profile")
    ),

  async execute(client: any, interaction: any) {
    let user = interaction.options.getUser("user");
    if (!user) user = interaction.user;
    if (user.bot) return interaction.reply({ content: "Bots Can't Have Profiles.", ephemeral: true });

    let data = await User.findOne({
      'user.id': user.id
    });

    if (!data) return interaction.reply("Looks like the user doesn't have a profile..");


    await interaction.deferReply();

    let name = user.username;

    if (name.length >= 11) {
      name = name.substring(0, 10) + '...';
    }
    
    let status = data.profile.profileCustomisation.title;

    if(status.length >= 20) status = status.substring(0, 20) + '\n' + status.substring(20, 40) + '\n' + status.substring(40, 60) + '\n' + status.substring(60, 80);
    

    const canvas = Canvas.createCanvas(500, 500);

    const ctx = canvas.getContext('2d');

    const baseImage = await Canvas.loadImage('assests/profile.png');
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    const instagram = data.profile.social.instagram;
    const twitter = data.profile.social.twitter;
    const likes = data.profile.likes.amount;
    const coins = data.coins.wallet;
    const marriedWith = data.profile.social.marriedWith;

    ctx.fillStyle = "#ffffff"

    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(name, 270, 94);

    ctx.font = "20px Arial"

    ctx.textAlign = "start";
    ctx.fillText(twitter, 300, 477);

    ctx.textAlign = "start";
    ctx.fillText(instagram, 60, 477);

    ctx.font = "700 25px Arial"
    ctx.textAlign = "start";
    ctx.fillText(marriedWith, 75, 430); // X=limn Y= lfo9

    ctx.font = "600 18px Arial"
    ctx.textAlign = "center";
    ctx.fillText(status, 340, 200); // X=limn Y= lfo9

    ctx.font = "900 40px Arial"
    ctx.textAlign = "center";
    ctx.fillText(numeral(likes).format('0.0a'), 100, 350); // X=limn Y= lfo9
    ctx.fillText(numeral(coins).format('0.0a'), 100, 260); // X=limn Y= lfo9

    const avatar = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`);

    ctx.drawImage(avatar, 16, 16, 137, 135) // X=limn  Y=lfo9

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'profile.png' });

    await interaction.editReply({
      files: [attachment]
    })
  }
}