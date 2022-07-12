const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomID: {
            type: String,
            required: [true, "roomID is required"],
            unique: true,
        },
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            required: [true, "members is required"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
