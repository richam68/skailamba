const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
    episodeId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true 
    }
});

module.exports = mongoose.model("Episode", EpisodeSchema);