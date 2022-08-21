const mongoose = require("mongoose");
const User = require("./userModel");

const roomSchema = new mongoose.Schema({
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: User,
        required: [true, "members is required"],
    },
    modifiedAt: {
        type: Date,
        default: Date.now(),
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Room", roomSchema);
