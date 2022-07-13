const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            required: [true, "members is required"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
