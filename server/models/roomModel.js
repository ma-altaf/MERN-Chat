const mongoose = require("mongoose");
const User = require("../models/userModel");

const roomSchema = new mongoose.Schema(
    {
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: User,
            required: [true, "members is required"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
