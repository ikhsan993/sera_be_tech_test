import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import compresssion from "compression";
import mongoose from "mongoose";
import router from "./routes";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(3030, () => {
  console.log("Server running in port 3030");
});

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
