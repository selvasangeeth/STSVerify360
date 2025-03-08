const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
