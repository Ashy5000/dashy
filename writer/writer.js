import {hiddenLayers, generateNeuralNet, learnWithPresets, showResults, learn, setSamplesPerUnit, setHiddenLayerSize, setNeuralNetDepth, setRandRange, setFinalResultBias, setCalibration, setLearningRounds, setRounding, setUseSamples, setCustomModel, setPreviousResults, addInput, reset} from "../index.js";
import { readFileSync } from "node:fs";

let wordVectorSpace = {};
let model;
let modelSettings = {};

const setup = () => {
    wordVectorSpace = JSON.parse(readFileSync(process.cwd() + "/ldsm/wordVectorSpace.json"));
    model = readFileSync(process.cwd() + "/ldsm/model.json");
    modelSettings = JSON.parse(readFileSync(process.cwd() + "/ldsm/modelSettings.json"));
    if(model == "") {
        generateNeuralNet(10, 10);
        model = hiddenLayers;
    } else {
        setCustomModel(JSON.parse(model));
    }
    setUseSamples(false);
    setSamplesPerUnit(0);
    setFinalResultBias(modelSettings.finalResultBias);
    setCalibration(modelSettings.calibration);
    setRounding(false);
};
setup();

const vectorToWord = (n) => {
    let closestMatchDif = Infinity;
    let closestMatch;
    for(let i in wordVectorSpace) {
        let currentDif = Math.abs(wordVectorSpace[i] - n);
        if(currentDif < closestMatchDif) {
            closestMatchDif = currentDif;
            closestMatch = i;
        }
    }
    return closestMatch;
};

const wordToVector = (word) => {
    return wordVectorSpace[word.toLowerCase()] || 1000;
    // 1000 is the vector code for "error!".
};

const stringToVectors = (str) => {
    let words = str.split(" ");
    let result = [];
    for(let i = 0; i < words.length; i++) {
        result.push(wordToVector(words[i]));
    }
    return result;
};

const vectorsToString = (arr) => {
    let result = [];
    for(let i = 0; i < arr.length; i++) {
        result.push(vectorToWord(arr[i]));
    }
    return result.join(" ");
};

const write = (prompt, length) => {
    setPreviousResults(stringToVectors(prompt));
    return vectorsToString(showResults(length));
};

export { hiddenLayers, stringToVectors, write, setCustomModel };