import chalk from "chalk";
import create from "prompt-sync";

const ctx = new chalk.constructor({level: 3});

const prompt = create({sigint: true});
let actualHiddenLayer = [];
let hiddenLayerSize = 0;
let randRange = 0;
let finalResultBias = 0;
let calibration = 0;
let learningRounds = 0;
let rounding = false;

let turbo = false;

if(prompt("Do you want to use Dashy Turbo? (y/n) ") == "y") {
  if(prompt("Please enter access code: ") == "1701") {
    turbo = true;
  } else {
    console.log(chalk.red("Access code not recognized. Proceeding with non-Turbo version."));
  }
}

let title = chalk.green("DASHY");
if(turbo) {
  title += " " + chalk.bgWhite(chalk.red("T") + chalk.hex('#FFA500')("U") + chalk.yellow("R") + chalk.green("B") + chalk.blue("O"));
}
console.log(title);

const configure = () => {
  if(prompt("Would you like to configure your settings to perfect your model? (y/n): ") == "n") {
    return;
  }
  console.log("You may press enter to skip any one of these configuration settings. The default value is 0 or your previous configuration.");
  hiddenLayerSize = Number(prompt(chalk.yellow("Enter hidden layer size: "))) || hiddenLayerSize;
  if(hiddenLayerSize > 10 && !turbo) {
    hiddenLayerSize = 10;
    console.log("Hidden layer size set to 10. Use Dashy Turbo for a larger hidden layer.");
  }
  randRange = Number(prompt(chalk.yellow("Enter learning range (controls output calibration and learning speed): "))) || randRange;
  finalResultBias = Number(prompt(chalk.yellow("Enter final neuron bias (number subtracted from final result): "))) || finalResultBias;
  calibration = Number(prompt(chalk.yellow("Enter calibration amount (number multiplied by final result): "))) || calibration;
  learningRounds = Number(prompt(chalk.yellow("Enter number of learning rounds: "))) || learningRounds;
  if(learningRounds > 10 && !turbo) {
    learningRounds = 10;
    console.log("Number of learning rounds set to 10. Use Dashy Turbo for more learning rounds.");
  }
  rounding = prompt(chalk.yellow("Would you like to enable output rounding? (y/n): ")) == "y";
  return true;
}
configure();
for(let i = 0; i < hiddenLayerSize; i++) {
  actualHiddenLayer.push({
    weights: [0, 0, 1]
  });
}

const getAverageNumberInArray = (array) => {
  const average = (array => array.reduce((a, b) => a + b) / array.length)(array);
  return average;
};

let previousResults = [];
let previousResult = 0;
let averageResult = 0;

const predictNext = (hiddenLayer) => {
  // console.log("previousResult:", previousResult, "averageResult:", averageResult, "previousResults.length:", previousResults.length);
  let hiddenLayerResults = [];
  for(let i = 0; i < hiddenLayer.length; i++) {
    let neuron = hiddenLayer[i];
    let hiddenLayerResult = (neuron.weights[0] * previousResult) + (neuron.weights[1] * averageResult) + (neuron.weights[2] * previousResults.length);
    // console.log("hiddenLayerResult:", hiddenLayerResult);
    hiddenLayerResults.push(hiddenLayerResult);
  }
  let finalResult = 0;
  for(let i = 0; i < hiddenLayerResults.length; i++) {
    finalResult += hiddenLayerResults[i];
  }
  finalResult -= finalResultBias;
  previousResults.push(finalResult);
  previousResult = finalResult;
  averageResult = getAverageNumberInArray(previousResults);
  return rounding ? Math.round(finalResult * calibration) : finalResult * calibration;
}
const squaredError = (expected, actual) => {
  return Math.abs(actual - expected) ** 2;
};
const test = (testingHiddenLayer, y) => {
  previousResults = [];
  previousResult = 0;
  averageResult = 0;
  let totalSquaredError = 0;
  for(let j = 0; j < y.length; j++) {
    let prediction = predictNext(testingHiddenLayer);
    previousResults.push(prediction);
    previousResult = prediction;
    averageResult = getAverageNumberInArray(previousResults);
    let error = squaredError(y[j], prediction)
    totalSquaredError += squaredError(y[j], prediction);
  }
  return totalSquaredError;
};
const learn = (rounds, y) => {
  let results = [];
  for(let i = 0; i < rounds; i++) {
    let testingHiddenLayer = actualHiddenLayer;
    for(let j = 0; j < testingHiddenLayer.length; j++) {
      let neuron = testingHiddenLayer[j];
      for(let k = 0; k < neuron.weights.length; k++) {
        neuron.weights[k] += (Math.random() * randRange) - (randRange / 2);
      }
    }
    let totalSquaredError = test(testingHiddenLayer, y);
    let meanSquaredError = totalSquaredError / y.length;
    results.push({
      "id": i,
      "hiddenLayer": testingHiddenLayer,
      "meanSquaredError": meanSquaredError
    });
    if(meanSquaredError < test(actualHiddenLayer, y) / y.length) {
      actualHiddenLayer = testingHiddenLayer;
    }
  }
  return results;
};

let learningSet = [];
let learningSetSize = Number(prompt(chalk.yellow("Enter training set size: ")))
for(let i = 0; i < learningSetSize; i++) {
  learningSet.push(Number(prompt(chalk.green(`Value #${i + 1}- `))));
}

learn(learningRounds, learningSet);
console.log("Your results:");
const showResults = () => {
  for(let i = 0; i < learningSetSize + 5; i++) {
    console.log(predictNext(actualHiddenLayer));
  }
}
showResults();
let configuring = true;
while(configuring) {
  configuring = configure();
  if(configuring) {
    if(prompt(chalk.red("Would you like to retrain your model? (y/n): ")) == "y") {
      console.log("Retraining...")
      learn(learningRounds, learningSet);
    }
    previousResults = [];
    previousResult = 0;
    averageResult = 0;
    showResults();
  }
}