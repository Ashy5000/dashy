import { write } from "./writer.js";
import create from "prompt-sync";
const prompt = create({sigint: true});
while(true) {
    let userPrompt = prompt("Give me a prompt, please: ");
    let length = Number(prompt("Specify length: "));
    console.log(write(userPrompt, length));
}