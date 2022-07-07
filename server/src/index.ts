import "dotenv/config";
import express from "express";
import { connect } from "mongoose";
import account from "./routes/user";
const cors = require("cors");

connect(process.env.MONGODB_URI!)
    .then(() => {
        const app = express();

        // middlewares
        app.use(cors());
        app.use(express.json());
        app.use("/users", account);

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
