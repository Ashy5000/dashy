import { hiddenLayers, write, setCustomModel } from "./writer.js";
import create from "prompt-sync";
import { writeFile, readFileSync } from "node:fs";
import { useInterface } from "./writerInterface.js";
const prompt = create({sigint: true});
const randRange = 0.8;

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
    let mode = prompt("Specify mode (1/2/3/4): ");
    let models = [hiddenLayers];
    while(prompt("Would you like to continue training? (y/n): ") == "y") {
        if(mode == "3") {
            let desiredFragment = prompt("Enter desired fragment: ");
            let matchFound = false;
            console.log("Building variations...");
            while(!matchFound) {
                models.push(buildModel(models[0]));
                let currentModel = models[models.length - 1];
                setCustomModel(currentModel);
                let result = write(fragment, length);
                if(result == desiredFragment) {
                    console.log("Match found.");
                    matchFound = true;
                    models = [currentModel];
                }
            }
            break;
        }
        if(mode == "4") {
            const trainingData = JSON.parse(readFileSync(process.cwd() + "/ldsm/trainingData.json"));
            console.log(trainingData);
            let matchFound = false;
            while(!matchFound) {
                let currentModel = buildModel(models[0]);
                setCustomModel(currentModel);
                let mistake = false;
                for(let i = 0; i < trainingData.length; i++) {
                    let result = write(trainingData[i].fragment, trainingData[i].length);
                    if(result != trainingData[i].desired) {
                        mistake = true;
                    }
                }
                if(!mistake) {
                    matchFound = true;
                    models = [currentModel];
                }
            }
            break;
        }
        console.log("Building variations...");
        for(let i = 0; i < 19; i++) {
            models.push(buildModel(models[0]));
        }
        console.log("Variations built.");
        for(let i = 0; i < models.length; i++) {
            setCustomModel(models[i]);
            if(mode == "1") {
                console.log(i + 1 + ": " + write(fragment, length));
            } else {
                useInterface();
            }
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