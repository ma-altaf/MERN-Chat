const express = require("express");
const User = require("../models/userModel");
const Room = require("../models/roomModel");
const { v4 } = require("uuid");

const router = express.Router();

router.post("/add", async (req, res) => {
    const { reqUsername, userID } = req.body;
    console.log(reqUsername);

    try {
        const { _id } = await User.findOne({ username: reqUsername });

        if (_id == userID)
            return res.status(405).send({ error: "Cannot request yourself" });

        const members = [userID, _id].sort();

        if (!(await Room.exists({ members }))) {
            try {
                const newRoom = await Room.create({
                    roomID: v4(),
                    members,
                });

                console.log(newRoom);
            } catch (error) {
                console.log(error);
                return res.status(400).send({ error: error.message });
            }
        }
        console.log("to redirect");
        // TODO: redirect to the room
        // res.redirect();
    } catch (error) {
        console.log(error);
        return res.status(404).send({ error: "User not found" });
    }

    res.end();
});

module.exports = router;
