import { write } from "./writer.js";
import bodyParser from "body-parser";
import express from "express";
const app = express();
const port = 3000;

app.use(bodyParser());

app.get("/prompt/ldsm-standard", (req, res) => {
    res.send(write(req.body.prompt, JSON.parse(req.body.length)));
});

app.listen(port);