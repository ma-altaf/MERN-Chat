require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const registration = require("./routes/Registration");
const cookieParser = require("cookie-parser");

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        const app = express();

        // middlewares
        app.use(cors());
        app.use(express.json());
        app.use(cookieParser());
        app.use("/users", registration);

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
