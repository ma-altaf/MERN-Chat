require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const registration = require("./routes/registration");
const user = require("./routes/user");
const jwtAuthenticateToken = require("./middleware/jwtAuthenticateToken");
const Message = require("./models/messageModel");
const jwt = require("jsonwebtoken");

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        const app = express();

        // middlewares
        app.use(
            cors({
                origin: process.env.WEB_URL,
                credentials: true,
            })
        );
        app.use(express.json());
        app.use(cookieParser());
        app.use("/users", registration);
        app.use("/user", jwtAuthenticateToken, user);

        // TODO: remove
        app.get("/", (req, res) => {
            res.send("request received");
        });

        const server = http.createServer(app);
        const io = new Server(server, {
            cookie: true,
            cors: { origin: process.env.WEB_URL, credentials: true },
        });

        io.on("connection", (socket) => {
            console.log(socket.id);
            let roomID, userID;

            const cookieRef = socket.handshake.headers?.cookie;
            if (!cookieRef) {
                socket.disconnect();
            }

            const token = cookieRef.substring(
                cookieRef.indexOf("token="),
                cookieRef.indexOf(";")
            );

            jwt.verify(token, process.env.JWT_SIGN_KEY, (err, user) => {
                if (err) {
                    console.log(err);
                    socket.disconnect();
                }

                userID = user;

                socket.on("join_room", async (reqRoom) => {
                    roomID = reqRoom;
                    await socket.join(roomID);

                    // TODO: user not receiving data
                    socket.to(socket.id).emit("joined", `join!: ${socket.id}`);
                });

                socket.on("send_msg", (message) => {
                    socket.to(roomID).emit("receive_msg", message);

                    Message.create(message);
                });

                socket.on("leave_room", () => {
                    socket.rooms.forEach((room) => socket.leave(room));
                });
            });
        });

        // start the server
        server.listen(process.env.PORT_NUM, () => {
            console.log("connected to port " + process.env.PORT_NUM);
        });
    })
    .catch((e) => {
        console.log(e);
    });
