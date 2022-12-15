const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildID: String,
    welcomer: {
        type: Boolean,
        default: false,
    },
    welcomeChannel: {
        type: String,
        default: "EMPTY"
    },
    welcomeMessage: {
        type: String,
        default: "EMPTY"
    },
    welcomeType: {
        type: String,
        default: "message"
    },
    chatbot: {
        type: Boolean,
        default: false,
    },
    updatedBy: String
});

module.exports = new mongoose.model("guildsData", guildSchema)