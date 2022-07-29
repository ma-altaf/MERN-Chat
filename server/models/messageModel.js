const mongoose = require("mongoose");
const User = require("./userModel");
const Room = require("./roomModel");

const messageSchema = mongoose.Schema(
    {
        content: { type: String, required: true },
        type: { type: String, enum: ["text", "image", "video"] },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: User,
        },
        roomID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: Room,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
