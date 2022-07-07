import express from "express";
import user from "../models/user";

const router = express.Router();

router
    .post("/create", (req, res) => {
        const { username, email, password } = req.body;
        res.status(200).send(
            `username: ${username} email: ${email} password: ${password}`
        );
    })
    .post("/login", (req, res) => {});

export default router;
