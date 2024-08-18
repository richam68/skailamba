const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true 
    }
}, {timestamps: true});

module.exports = mongoose.model("Episode", EpisodeSchema);