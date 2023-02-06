const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    user: {
        username: String,
        discriminator: String,
        id: String,
        blacklisted: Boolean
    },

    economy: {
        wallet: Number,
        jobs: {
            work: Number,
            crime: Number,
            loot: Number,
            daily: Number,
            football: Number,
        },
        items: Array
    },

    profile: {
        likes: {
            amount: Number,
            cooldown: Number,
        },
        social: {
            instagram: {
                type: String,
                max: 20
            },
            twitter: {
                type: String,
                max: 15
            },
            married: {
                type: Boolean,
                default: false
            },
            marriedWith: String,
            marriedWithId: String,
            marriageDate: Number,
        },
        profileCustomisation: {
            title: {
                type: String,
                max: 80
            },
            badges: Object,
            background: Object
        }
    }
});

module.exports = mongoose.model("users-list", blacklistSchema);