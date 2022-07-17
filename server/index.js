require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const registration = require("./routes/registration");
const user = require("./routes/user");
const message = require("./routes/message");
const jwtAuthenticateToken = require("./middleware/jwtAuthenticateToken");

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        const app = express();
        const server = http.createServer(app);
        const io = new Server(server, {
            cors: { origin: process.env.WEB_URL },
        });

        io.on("connection", (socket) => {
            console.log(socket.id);
            socket.on("join_room", async (roomID) => {
                await socket.join(roomID);

                socket.to(roomID).emit("joined", "join!");
            });

            socket.on("leave_room", () => {
                socket.rooms.forEach((room) => socket.leave(room));
            });
        });

        // middlewares
        app.use(cors({ origin: true, credentials: true }));
        app.use(express.json());
        app.use(cookieParser());
        app.use("/users", registration);
        app.use("/user", jwtAuthenticateToken, user);
        app.use("/message", jwtAuthenticateToken, message);

        // TODO: remove
        app.get("/", (req, res) => {
            res.send("request received");
        });

        // start the server
        server.listen(process.env.PORT_NUM, () => {
            console.log("connected to port " + process.env.PORT_NUM);
        });
    })
    .catch((e) => {
        console.log(e);
    });
