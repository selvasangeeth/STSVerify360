const mongoose = require("mongoose");

const moduleSchema = mongoose.Schema({
    moduleName: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subModule: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }

}, { timestamps: true })

module.exports = mongoose.model("module", moduleSchema);