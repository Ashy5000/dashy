import {hiddenLayerSize, neuralNetDepth, randRange, finalResultBias, calibration, learningRounds, rounding, samplesPerUnit, useSamples, generateNeuralNet, learnWithPresets, showResults, learn, setSamplesPerUnit, setHiddenLayerSize, setNeuralNetDepth, setRandRange, setFinalResultBias, setCalibration, setLearningRounds, setRounding, setUseSamples, addInput, reset} from "./index.js";

import chalk from "chalk";
const ctx = new chalk.constructor({level: 3});

import create from "prompt-sync";
const prompt = create({sigint: true});

let turbo = false;

if(prompt("Do you want to use Dashy Turbo? (y/n) ") == "y") {
  if(prompt("Please enter access code: ") == "1701") {
    turbo = true;
  } else {
    console.log(chalk.red("Access code not recognized. Proceeding with non-Turbo version."));
  }
}

setSamplesPerUnit(turbo ? 3 : 2);

let title = chalk.green("DASHY");
if(turbo) {
  title += " " + chalk.bgWhite(chalk.red("T") + chalk.hex('#FFA500')("U") + chalk.yellow("R") + chalk.green("B") + chalk.blue("O"));
}

const configure = () => {
    if(prompt("Would you like to configure your settings to perfect your model? (y/n): ") == "n") {
        return;
    }
    console.log("You may press enter to skip any one of these configuration settings. The default value is 0 or your previous configuration.");
    setHiddenLayerSize(Number(prompt(chalk.yellow("Enter hidden layer size: "))) || hiddenLayerSize);
    if(hiddenLayerSize > 10 && !turbo) {
        setHiddenLayerSize(10);
        console.log("Hidden layer size set to 10. Use Dashy Turbo for a larger hidden layer.");
    }
    setNeuralNetDepth(Number(prompt(chalk.yellow("Enter neural net depth: "))));
    if(neuralNetDepth > 1 && !turbo) {
        setNeuralNetDepth(1);
        console.log("Neural net depth set to 1. Use Dashy Turbo for a deeper neural net.");
    }
    setRandRange(Number(prompt(chalk.yellow("Enter learning range (controls output calibration and learning speed): "))) || randRange);
    setFinalResultBias(Number(prompt(chalk.yellow("Enter final neuron bias (number subtracted from final result): "))) || finalResultBias);
    setCalibration(Number(prompt(chalk.yellow("Enter calibration amount (number multiplied by final result): "))) || calibration);
    setLearningRounds(Number(prompt(chalk.yellow("Enter number of learning rounds: "))) || learningRounds);
    if(learningRounds > 10 && !turbo) {
        setLearningRounds(10);
        console.log("Number of learning rounds set to 10. Use Dashy Turbo for more learning rounds.");
    }
    setRounding(prompt(chalk.green("Would you like to enable output rounding? (y/n): ")) == "y");
    setUseSamples(prompt(chalk.green("Would you like to divide your training data into samples? Note: Only use if your function does not contain curves. (y/n): ")) == "y");
    return true;
}
configure();
generateNeuralNet();
let learningSetSize = Number(prompt(chalk.yellow("Enter training set size: ")))
for(let i = 0; i < learningSetSize; i++) {
  addInput(Number(prompt(chalk.green(`Value #${i + 1}- `))));
}

learnWithPresets();

console.log("Your results:");
console.log(showResults(learningSetSize + 5, useSamples ? samplesPerUnit : 0).join("\n"));
let configuring = true;
while(configuring) {
  configuring = configure();
  if(configuring) {
    if(prompt(chalk.red("Would you like to retrain your model? (y/n): ")) == "y") {
      console.log("Retraining...")
      learnWithPresets();
    }
    // reset();
    showResults(learningSetSize + 5);
  }
}