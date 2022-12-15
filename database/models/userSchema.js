const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: String,
    guildID: String,
    commands: Object,
});

module.exports = new mongoose.model("usersData", userSchema)