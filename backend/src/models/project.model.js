const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    }, //link to user
    title: {
        type: String, 
        required: true,
        default: ""
    },
    episodes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }]
},{timestamps:true});

module.exports = mongoose.model("Project", ProjectSchema);