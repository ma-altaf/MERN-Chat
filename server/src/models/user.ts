import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
    avatarURL?: string;
}

const userSchema = new Schema<IUser>({
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
            validator: (v: string) =>
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: (props) => `${props.value} is not a valide email adress`,
        },
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    avatarURL: String,
});

export default model("User", userSchema);
