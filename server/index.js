require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const registration = require("./routes/registration");
const user = require("./routes/user");
const cookieParser = require("cookie-parser");
const jwtAuthenticateToken = require("./middleware/jwtAuthenticateToken");

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        const app = express();

        // middlewares
        app.use(cors({ origin: true, credentials: true }));
        app.use(express.json());
        app.use(cookieParser());
        app.use("/users", registration);
        app.use("/user", jwtAuthenticateToken, user);

        // TODO: remove
        app.get("/", (req, res) => {
            res.send("request received");
        });

        // start the server
        app.listen(process.env.PORT_NUM, () => {
            console.log("connected to port " + process.env.PORT_NUM);
        });
    })
    .catch((e) => {
        console.log(e);
    });
