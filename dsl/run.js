import { readFileSync } from "node:fs";
import create from "prompt-sync";
import {hiddenLayerSize, neuralNetDepth, randRange, finalResultBias, calibration, learningRounds, rounding, samplesPerUnit, useSamples, generateNeuralNet, learnWithPresets, showResults, learn, setSamplesPerUnit, setHiddenLayerSize, setNeuralNetDepth, setRandRange, setFinalResultBias, setCalibration, setLearningRounds, setRounding, setUseSamples, addInput, reset} from "../index.js";

const prompt = create({sigint: true});

const path = prompt("Enter file path: ");
const fileContents = readFileSync(path, { "encoding": "utf8" });
const lines = fileContents.split("\n");

let data = [];
let variables = {};
let evaluatingIfDepth = 0;
let codeIfDepth = 0;

let whileDepth = 0;
let whileConditions = [];

const evaluate = (lines) => {
  for(let i = 0; i < lines.length; i++) {
    if(codeIfDepth > evaluatingIfDepth && codeIfDepth > 0) {
      codeIfDepth--;
      continue;
    }
    const words = lines[i].split(" ");
    const operation = words[0];
    if(operation == "init") {
      console.log("Initializing...");
      generateNeuralNet(hiddenLayerSize, neuralNetDepth);
      console.log("Model ready.");
    } else if(operation == "set") {
      let variableName = words[1];
      let value = words[2] != "getvar" ? words[2] : variables[words[3]];
      if(variableName == "width") {
        setHiddenLayerSize(Number(value));
      } else if(variableName == "depth") {
        setNeuralNetDepth(Number(value));
      } else if(variableName == "rand") {
        setRandRange(Number(value));
      } else if(variableName == "rounds") {
        setLearningRounds(Number(value));
      } else if(variableName == "round") {
        setRounding(value == "+" ? true : false);
      } else if(variableName == "data") {
        data = JSON.parse(value);
      } else if(variableName == "calibration") {
        setCalibration(Number(value));
      } else if(variableName == "finalBias") {
        setFinalResultBias(Number(value));
      }
    } else if(operation == "train") {
      console.log("Training model...");
      learn(learningRounds, data);
      console.log("Training succesfully completed.");
    } else if(operation == "output") {
      console.log(showResults(data.length + 5).join("\n"));
    } else if(operation == "mkvar") {
      variables[words[1]] = words[2] != "getvar" ? words[2] : variables[words[3]];
    } else if(operation == "setvar") {
      if(variables[words[1]]) {
        variables[words[1]] = words[2] != "getvar" ? words[2] : variables[words[2]];
      } else {
        console.error("ERR: Variable not found");
      }
    } else if(operation == "log") {
      console.log(words[1] != "getvar" ? words[1] : variables[words[2]])
    } else if(operation == "end") {
      break;
    } else if(operation == "if") {
      codeIfDepth++;
      if(words[1] == "+" || (words[1] == "getvar" && variables[words[2]] == "+")) {
        evaluatingIfDepth++;
      }
    } else if(operation == "closeif") {
      codeIfDepth--;
      evaluatingIfDepth--;
    } else if(operation == "while") {
      whileDepth++;
      whileConditions.push(words.slice(1));
        while(lines[i] != "closewhile") {
          i++;
        }
    } else if(operation == "closewhile") {
      let condition = whileConditions[whileDepth - 1];
      if(condition[0] == "+" || (condition[0] == "getvar" && variables[condition[1]] == "+")) {
        while(lines[i].split(" ")[0] != "while") {
          i--;
        }
      } else {
        whileDepth--;
        whileConditions.pop();
      }
    } else if(operation == ">") {
      variables[words[1]] = (Number(variables[words[2]]) > Number(variables[words[3]])) ? "+" : "-";
    } else if(operation == "<") {
      variables[words[1]] = (Number(variables[words[2]]) < Number(variables[words[3]])) ? "+": "-";
    } else if(operation == "=") {
      variables[words[1]] = (Number(variables[words[2]]) = Number(variables[words[3]])) ? "+": "-";
    }
  }
};
evaluate(lines);
console.log("Program finished.");