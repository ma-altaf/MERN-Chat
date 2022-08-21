const express = require("express");
const User = require("../models/userModel");
const Room = require("../models/roomModel");

const router = express.Router();

router
    .post("/add", async (req, res) => {
        const { reqUsername, userID } = req.body;
        let roomID = "";
        try {
            const { _id } = await User.findOne({ username: reqUsername });

            if (_id == userID)
                return res
                    .status(405)
                    .send({ error: "Cannot request yourself" });

            const members = [userID, _id].sort();

            if (!(await Room.exists({ members }))) {
                try {
                    const newRoom = await Room.create({
                        members,
                    });

                    roomID = newRoom._id;
                } catch (error) {
                    console.log("error:", error);
                    return res.status(400).send({ error: error.message });
                }
            } else {
                const room = await Room.findOne({ members }).select("_id");
                roomID = room._id;
            }
            console.log(roomID.toString());

            return res.status(200).send(roomID.toString());
        } catch (error) {
            console.log("error:", error);
            return res.status(404).send({ error: "User not found" });
        }
    })
    .get("/contactList", async (req, res) => {
        const { userID } = req.body;

        const rooms = await Room.find({ members: { $all: userID } })
            .select("_id members")
            .populate("members", "avatar.url username about")
            .sort({ modifiedAt: -1 });

        res.send(
            rooms.map((room) => {
                const { _id, members } = room;

                const contactDetail = members.find(
                    (member) => member._id != userID
                );

                return {
                    roomID: _id,
                    username: contactDetail.username,
                    avatarURL: contactDetail.avatar.url,
                    about: contactDetail.about,
                };
            })
        );
    })
    .post("/contactDetail", async (req, res) => {
        const { userID, roomID } = req.body;

        const { members } = await Room.findById(roomID).populate(
            "members",
            "avatar.url username about"
        );
        const contactDetail = members.find((member) => member._id != userID);

        res.status(200).send({
            username: contactDetail.username,
            avatarURL: contactDetail.avatar.url,
            about: contactDetail.about,
        });
    });

module.exports = router;
