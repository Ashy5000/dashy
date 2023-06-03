import { hiddenLayers, stringToVectors, write, setCustomModel } from "./writer.js";
import create from "prompt-sync";
import { writeFile } from "node:fs";
const prompt = create({sigint: true});
const randRange = 1;

const buildModel = (base) => {
    let testingModel = JSON.parse(JSON.stringify(base));
    for(let j = 0; j < testingModel.length; j++) {
        let testingHiddenLayer = testingModel[j];
        for(let k = 0; k < testingHiddenLayer.length; k++) {
            let neuron = testingHiddenLayer[k];
            for(let l = 0; l < neuron.weights.length; l++) {
                neuron.weights[l] += (Math.random() * randRange) - (randRange / 2);
            }
        }
    }
    return testingModel;
};

const train = () => {
    let fragment = prompt("Enter fragment: ");
    let length = Number(prompt("Enter length: "));
    let models = [hiddenLayers];
    while(prompt("Would you like to continue training? (y/n): ") == "y") {
        console.log("Building variations...");
        for(let i = 0; i < 9; i++) {
            models.push(buildModel(models[0]));
        }
        console.log("Variations built.");
        for(let i = 0; i < models.length; i++) {
            setCustomModel(models[i]);
            console.log(i + 1 + ": " + write(fragment, length));
        }
        let chosenModel = models[Number(prompt("Which model would you like to use? ")) - 1];
        models = [chosenModel];
        setCustomModel(chosenModel);
    }
    console.log("Saving file, do not exit...");
    writeFile(process.cwd() + "/ldsm/model.json", JSON.stringify(models[0]), "utf8", (err) => {
        if (err) throw err;
        console.log("Model saved. Training complete.");
    });
};
train();