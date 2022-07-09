const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        lowercase: true,
        unique: true,
        validate: {
            validator: (v) =>
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: (props) => `${props.value} is not a valide email address`,
        },
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    avatarURL: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);
