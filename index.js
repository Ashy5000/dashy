import "chalk";
let actualHiddenLayer = [];
let hiddenLayerSize = 5;
let randRange = 0.2;
let finalResultBias = 50;
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

let calibration = 0.1;

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
  return finalResult * calibration;
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
let learningSet = [0, 1, 2, 3, 4, 5];
learn(20, learningSet);
for(let i = 0; i < 5; i++) {
  console.log(predictNext(actualHiddenLayer));
}