const mongoose = require('mongoose')

const likesSchema = new mongoose.Schema({
    userId: String,
    likes: {
        type: Number, 
        default: 0,
    },
    cooldown: Number
})

module.exports = new mongoose.model('likes', likesSchema)