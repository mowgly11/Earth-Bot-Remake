const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    user: {
        id: String,
        blacklisted: Boolean
    },

    coins: {
        wallet: Number,
        work: Number,
        sm: Number,
        loot: Number,
        crime: Number,
        slut: Number,
        football: Number,
    },

    profile: {
        likes: Number,
        cooldown: Number,
        title: String,
        instagram: String,
        twitter: String,
        married: Boolean,
        marriedWith: String,
        marriedWithId: String,
        marriageDate: Number,
        badges: Object,
        background: Object
    }
});

module.exports = mongoose.model("Blacklist", blacklistSchema);