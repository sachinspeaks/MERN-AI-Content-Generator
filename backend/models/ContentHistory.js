const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

const contentHistory = mongoose.model("contentHistory", historySchema)
module.exports = contentHistory