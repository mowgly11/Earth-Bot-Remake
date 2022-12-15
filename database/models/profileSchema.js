const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    profiler: String,
    title: {
        type: String,
        default: "No Bio",
    },
    instagram: {
        type: String,
        default: "No Instagram",
    },
    twitter: {
        type: String,
        default: "No Twitter",
    },
    married: {
        type: Boolean,
        default: false
    },
    marriedWith: {
        type: String,
        default: "Single"
    },
    marriedWithId: {
        type: String,
        default: ""
    },
    marriageDate: {
      type: Number,
      default: 0,
    },
    badges: Object,
    background: Object
})

module.exports = new mongoose.model('Profiles', profileSchema)