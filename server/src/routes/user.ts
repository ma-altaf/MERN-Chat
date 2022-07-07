import express from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";

const MIN_PASSWORD_LENGTH = 6;
const router = express.Router();

router
    .post("/create", async (req, res) => {
        const { username, email, password } = req.body;

        // ensure password is long enough
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(401).send({
                message: `password length must be ${MIN_PASSWORD_LENGTH}`,
            });
        }

        // hashing the password to be stored
        let hashedPassword: String;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(401).send({
                error: "password could not be hashed",
            });
        }

        // saving the user on the database
        try {
            await User.create({ username, email, password: hashedPassword });
        } catch (e: any) {
            return res.status(400).send({ error: e.message });
        }

        // user successfully created
        res.status(200).send({
            username,
            email,
            password: hashedPassword,
        });
    })

    .post("/login", async (req, res) => {
        const { email, password } = req.body;

        const dbUser = await User.findOne({ email: email }).select(
            "password _id"
        );

        if (!dbUser) {
            return res.status(401).send({ error: "user not found" });
        }

        try {
            if (!(await bcrypt.compare(password, dbUser.password))) {
                return res.status(400).send({ error: "Incorrect password" });
            }
        } catch (error) {
            return console.log("brypt comparison fail");
        }

        // user authenticated successfully
        return res.status(200).send({ userID: dbUser._id });
    });

export default router;
