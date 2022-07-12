const express = require("express");
const User = require("../models/userModel");
const Room = require("../models/roomModel");
const { v4 } = require("uuid");

const router = express.Router();

router.post("/add", async (req, res) => {
    const { reqUsername, userID } = req.body;
    let roomID = "";
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

                roomID = newRoom.roomID;
            } catch (error) {
                console.log(error);
                return res.status(400).send({ error: error.message });
            }
        } else {
            const room = await Room.findOne({ members }).select("roomID");
            roomID = room.roomID;
        }
        console.log(roomID);

        res.status(200).send(roomID);
    } catch (error) {
        console.log(error);
        return res.status(404).send({ error: "User not found" });
    }

    res.end();
});

module.exports = router;
