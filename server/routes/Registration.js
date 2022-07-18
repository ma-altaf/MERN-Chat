const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwtAuthenticateToken = require("../middleware/jwtAuthenticateToken");
const jwt = require("jsonwebtoken");

const MIN_PASSWORD_LENGTH = 6;
const router = express.Router();

router
    .post("/create", async (req, res) => {
        const { username, email, password } = req.body;

        // ensure password is long enough
        if (password.length < MIN_PASSWORD_LENGTH) {
            return res.status(401).send({
                error: `Password: password length must be ${MIN_PASSWORD_LENGTH}`,
            });
        }

        // hashing the password to be stored
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(401).send({
                error: "Server error, try again later",
            });
        }

        // saving the user on the database
        try {
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            // user successfully created
            try {
                const token = generateToken(newUser._id);
                if (!token)
                    return res
                        .status(400)
                        .send({ error: "could not create token" });
                res.cookie("token", token, {
                    httpOnly: true,
                });
                return res.status(200).send({
                    username,
                    avatarURL: newUser.avatarURL,
                });
            } catch (error) {
                return res
                    .status(400)
                    .send({ error: "could not create token" });
            }
        } catch (e) {
            return res.status(400).send({ error: e.message });
        }
    })

    .post("/login", async (req, res) => {
        const { email, password } = req.body;

        const dbUser = await User.findOne({ email: email });

        if (!dbUser) {
            return res.status(401).send({ error: "User not found" });
        }

        try {
            if (!(await bcrypt.compare(password, dbUser.password))) {
                return res.status(400).send({ error: "Incorrect password" });
            }
        } catch (error) {
            return res
                .status(400)
                .send({ error: "Server error, try again later" });
        }

        try {
            const token = generateToken(dbUser._id);
            if (!token)
                return res
                    .status(400)
                    .send({ error: "could not create token" });
            res.cookie("token", token, {
                httpOnly: true,
            });
            return res.status(200).send({
                username: dbUser.username,
                avatarURL: dbUser.avatarURL,
            });
        } catch (error) {
            return res.status(400).send({ error: "could not create id" });
        }
    })

    .get("/getUser", jwtAuthenticateToken, async (req, res) => {
        const { userID } = req.body;
        const { username, avatarURL } = await User.findOne({ _id: userID });

        res.status(200).send({ username, avatarURL });
    })

    .get("/logOut", jwtAuthenticateToken, (req, res) => {
        res.clearCookie("token").end();
    });

const generateToken = (id) => {
    return jwt.sign({ userID: id }, process.env.JWT_SIGN_KEY, {
        algorithm: "HS256",
    });
};

module.exports = router;
