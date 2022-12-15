const mongoose = require('mongoose')

const coinsSchema = new mongoose.Schema({
    MemberID: String,
    Coins: {
        type: Number,
        default: 0,
    },
    work: Number,
    sm: Number,
    loot: Number,
    crime: Number,
    slut: Number,
    football: Number,
})

module.exports = new mongoose.model('Coins', coinsSchema)