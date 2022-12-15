const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },

    blacklisted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Blacklist", blacklistSchema);