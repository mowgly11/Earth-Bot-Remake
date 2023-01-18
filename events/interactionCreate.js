const { Events } = require('discord.js');
const client = require('../index');
const User = require('../database/model/usersSchema');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        
        const earthServer = client.guilds.cache.get("886987831141101649");
        const errorChannel = earthServer.channels.cache.get("899582303221743666");
        

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

        let user = interaction.user;
        let data;

        try {
            data = await User.findOne({
                "user.id": user.id
            });
    
            if (!data) {
                data = await User.create({
                    user: {
                        id: user.id,
                        blacklisted: false
                    },
                    coins: {
                        wallet: 0,
                        jobs: {
                            work: 0,
                            specialmission: 0,
                            loot: 0,
                            football: 0,
                        }
                    },
    
                    profile: {
                        likes: {
                            amount: 0,
                            cooldown: 0,
                        },
                        social: {
                            instagram: "Not Set",
                            twitter: "Not Set",
                            married: false,
                            marriedWith: "Nobody",
                            marriedWithId: null,
                            marriageDate: 0,
                        },
                        profileCustomisation: {
                            title: "I like Earth Bot.",
                            badges: [],
                            background: []
                        }
                    }
                });

                await data.save();
            }
        } catch(err) {
            errorChannel.send(`**New Error**: ${err}\n\nFrom: ${interaction.guild.id} (${interaction.guild.name})\nBy: ${interaction.user.id}`)
            return interaction.reply({
                content: "Some Error Just Happened. Please Try Again",
                ephemeral: true
            });
        }

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }

        process.on("uncaughtException", (err, origin) => {
            errorChannel.send(`**New Error**: ${err}\n**Origin**: ${origin}\n\nFrom: ${interaction.guild.id} (${interaction.guild.name})\nBy: ${interaction.user.id}`)
        });
        process.on("unhandledRejection", (err, promise) => {
            errorChannel.send(`**New Error**: ${err}\n**Promise**: ${promise}\n\nFrom: ${interaction.guild.id} (${interaction.guild.name})\nBy: ${interaction.user.id}`)
        });
        process.on("uncaughtExceptionMonitor", (err, origin) => {
            errorChannel.send(`**New Error**: ${err}\n**Origin**: ${origin}\n\nFrom: ${interaction.guild.id} (${interaction.guild.name})\nBy: ${interaction.user.id}`)
        });
    },
};