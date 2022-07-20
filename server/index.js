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
            console.log("socket id:", socket.id);
            let roomID, userID;

            const cookieRef = socket.handshake.headers?.cookie;

            let token = cookieRef?.substring(
                cookieRef.indexOf("token=") + 6 // 6 since token= make 6 char
            );

            if (token && token.indexOf(";") > 0)
                token = token.substring(0, token.indexOf(";") || 0);

            if (!token) {
                console.log("cookie:", cookieRef);
                console.log("token:", token);
                return socket.disconnect();
            }

            jwt.verify(token, process.env.JWT_SIGN_KEY, (err, user) => {
                if (err) {
                    console.log(err);
                    return socket.disconnect();
                }

                userID = user.userID;

                console.log("user id:", userID);

                socket.on("join_room", async (reqRoom) => {
                    roomID = reqRoom;
                    await socket.join(roomID);

                    // TODO: user not receiving data
                    io.to(socket.id).emit("joined", `join!: ${socket.id}`);
                });

                socket.on("send_msg", (message) => {
                    const content = message?.content;
                    if (typeof content === "string" && content.length != 0) {
                        socket.broadcast
                            .to(roomID)
                            .emit("receive_msg", message);

                        // save the messages to the database
                        Message.create({
                            content,
                            sender: mongoose.Types.ObjectId(userID),
                            roomID: mongoose.Types.ObjectId(roomID),
                        });
                    }
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
