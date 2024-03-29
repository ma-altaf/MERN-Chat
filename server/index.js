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
const Room = require("./models/roomModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("./utils/cloudinary");

const NUM_MSG = 10;

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
        app.use(express.json({ limit: "50mb" }));
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
            maxHttpBufferSize: 1e8,
        });

        io.on("connection", (socket) => {
            console.log("socket id:", socket.id);
            let roomID, userID, lastMsgRef;

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

                const paginateMsg = async (msgRef) => {
                    const msgList = await Message.find({
                        roomID: roomID,
                        createdAt: { $lt: msgRef },
                    })
                        .sort({
                            createdAt: -1,
                        })
                        .limit(NUM_MSG)
                        .populate("sender", "username -_id")
                        .select("content createdAt type -_id");

                    lastMsgRef = msgList[msgList.length - 1]?.createdAt;

                    return msgList;
                };

                socket.on("join_room", async (reqRoom) => {
                    lastMsgRef = Date.now();
                    roomID = reqRoom;
                    await socket.join(roomID);

                    // send the previous messages to the user making the request
                    io.to(socket.id).emit(
                        "joined",
                        await paginateMsg(lastMsgRef)
                    );
                });

                socket.on("get_msg", async () => {
                    // send the previous messages to the user making the request
                    io.to(socket.id).emit(
                        "get_msg",
                        await paginateMsg(lastMsgRef)
                    );
                });

                socket.on("send_msg", async (message) => {
                    const { content, type } = message;
                    let newMsg = {};

                    // filter incorrect request
                    switch (type) {
                        case "text":
                            if (content.trim().length === 0) return;
                            newMsg = {
                                ...message,
                                content: message.content.trim(),
                            };
                            break;
                        case "video":
                        case "audio":
                        case "image":
                            if (content) {
                                // upload file to cloudinary
                                try {
                                    const result =
                                        await cloudinary.uploader.upload(
                                            content,
                                            {
                                                folder: `MERN/rooms/${roomID}`,
                                                resource_type:
                                                    type === "image"
                                                        ? "image"
                                                        : "video",
                                            }
                                        );

                                    newMsg = {
                                        ...message,
                                        content: result.secure_url,
                                    };
                                    io.to(socket.id).emit(
                                        "receive_msg",
                                        newMsg
                                    );
                                } catch (error) {
                                    console.log("error uploading file:", error);
                                }
                            }

                            break;
                        default:
                            // incorrect type
                            return;
                    }

                    socket.to(roomID).emit("receive_msg", newMsg);
                    // save the messages to the database
                    await Message.create({
                        content: newMsg.content,
                        sender: mongoose.Types.ObjectId(userID),
                        roomID: mongoose.Types.ObjectId(roomID),
                        type,
                    });
                    // update the room modifiedAt date
                    await Room.findByIdAndUpdate(roomID, {
                        modifiedAt: Date.now(),
                    });
                });

                socket.on("leave_room", () => {
                    socket.rooms.forEach((room) => {
                        room != socket.id && socket.leave(room);
                    });
                });
            });
        });

        // start the server
        server.listen(process.env.PORT, () => {
            console.log("connected to port " + process.env.PORT);
        });
    })
    .catch((e) => {
        console.log(e);
    });
