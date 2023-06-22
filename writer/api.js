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

app.get("/version", (req, res) => {
    res.json( {"version": "June 2023"} );
});

app.get("/trainingStage", (req, res) => {
    res.json( {"trainingStage": [1, 2]});
});

app.get("/appVersion", (req, res) => {
    res.json( {"version": "6.23"} );
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});