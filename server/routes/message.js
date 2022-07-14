const express = require("express");

const router = express.Router();

router.post("/send", (req, res) => {
    try {
        const { userID: senderID, content, roomID } = req.body;
    } catch (error) {
        res.status(400).send({ error: "message does not contain all fields" });
    }
});

module.exports = router;
