const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    user: {
        id: String,
        blacklisted: Boolean
    },

    coins: {
        wallet: Number,
        jobs: {
            work: Number,
            specialmission: Number,
            loot: Number,
            football: Number,
        }
    },

    profile: {
        likes: {
            amount: Number,
            cooldown: Number,
        },
        social: {
            instagram: String,
            twitter: String,
            married: Boolean,
            marriedWith: String,
            marriedWithId: String,
            marriageDate: Number,
        },
        profileCustomisation: {
            title: String,
            badges: Object,
            background: Object
        }
    }
});

module.exports = mongoose.model("Blacklist", blacklistSchema);

export {}