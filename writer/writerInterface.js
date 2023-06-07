import { write } from "./writer.js";
import create from "prompt-sync";
const prompt = create({sigint: true});
const useInterface = () => {
    while(true) {
        let userPrompt = prompt("Give me a prompt, please: ");
        let length = Number(prompt("Specify length: "));
        if(userPrompt && length) {
            console.log(write(userPrompt, length));
        } else {
            return;
        }
    }
}
export { useInterface };
useInterface();