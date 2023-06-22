import { hiddenLayers, write, setCustomModel } from "./writer.js";
import create from "prompt-sync";
import { writeFile, readFileSync } from "node:fs";
import { useInterface } from "./writerInterface.js";
import { GPU } from "gpu.js";

const gpu = new GPU();

const prompt = create({sigint: true});

const randRange = 0.8;
const maxSize = 20;

const generateWeights = (base) => {
    let baseCopy = JSON.parse(JSON.stringify(base));
    for(let i = 0; i < baseCopy.length; i++) {
        for(let j = 0; j < baseCopy[i].length; j++) {
            baseCopy[i][j] = baseCopy[i][j].weights;
        }
    }
    for(let i = 0; i < baseCopy.length; i++) {
        for(let j = 0; j < baseCopy[i].length; j++) {
            while(baseCopy[i][j].length < maxSize) {
                baseCopy[i][j].push(0);
            }
        }
    }
    return baseCopy;
};
const buildModelWithoutGPU = (base) => {
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
const generateModelWithGPU = gpu.createKernel(function(base) {
    const i = this.thread.z;
    const j = this.thread.y;
    const k = this.thread.x;
    const randRange = 0.8;
    const newValue = base[i][j][k] + (Math.random() * randRange) - (randRange / 2);
    return newValue;
}, {
    output: [20, 5, 20],
    pipeline: false
});

const buildModelWithGPU = (base) => {
    let result = generateModelWithGPU(base);
    let newModel = Array(result.length).fill().map(() => Array(result[0].length).fill().map(() => Array(result[0][0].length).fill()));
    for (let j = 0; j < result.length; j++) {
        for (let k = 0; k < result[j].length; k++) {
            let arr = Array.from(result[j][k]);
            let obj = { weights: [] };
            let originalLength = j == 0 ? 3 : arr.length;
            for (let l = 0; l < originalLength; l++) {
                obj.weights.push(arr[l]);
            }
            newModel[j][k] = obj;
        }
    }
    return newModel;
}
const buildModel = (base, useGPU) => {
    if(useGPU) {
        let weights = generateWeights(base);
        return buildModelWithGPU(weights);
    } else {
        return buildModelWithoutGPU(base);
    }
};
const train = () => {
    let fragment = prompt("Enter fragment: ");
    let length = Number(prompt("Enter length: "));
    let mode = prompt("Specify mode (1/2/3/4): ");
    let useGPU = prompt("Use GPU? (y/n): ") == "y";
    console.log("useGPU set to " + useGPU);
    let models = [hiddenLayers];
    while(prompt("Would you like to continue training? (y/n): ") == "y") {
        if(mode == "3") {
            let desiredFragment = prompt("Enter desired fragment: ");
            let matchFound = false;
            console.log("Building variations...");
            while(!matchFound) {
                models.push(buildModel(models[0]), useGPU);
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
            console.log("trainingData: " + trainingData);
            let matchFound = false;
            while(!matchFound) {
                let currentModel = buildModel(models[0], useGPU);
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
        let modelCount = mode == "2" ? 2 : 20;
        for(let i = 0; i < modelCount - 1; i++) {
            models.push(buildModel(models[0], useGPU));
        }
        console.log("Variations built.");
        for(let i = 0; i < models.length; i++) {
            setCustomModel(models[i]);
            if(mode == "1") {
                console.log(i + 1 + ": " + write(fragment, length));
            } else if(mode == "2") {
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