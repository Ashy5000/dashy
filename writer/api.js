import { write } from "./writer.js";
import bodyParser from "body-parser";
import express from "express";
const app = express();
const port = 3000;

app.use(bodyParser());

app.post("/prompt/ldsm-standard", (req, res) => {
    console.log("Incoming request!");
    const data = req.body;
    console.log("data: " + JSON.stringify(data));
    const response = {
        result: write(data.prompt, Number(data.length))
    };
    console.log(response);
    res.json(response);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});