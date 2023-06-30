let hiddenLayers = [];
let hiddenLayerSize = 0;
let neuralNetDepth = 0;
let randRange = 0;
let finalResultBias = 0;
let calibration = 0;
let learningRounds = 0;
let rounding = false;
let useSamples = false;
let samplesPerUnit = 0;

hiddenLayers.push([]);

const reset = () => {
  previousResults = [];
  previousResult = 0;
  averageResult = 0;
};

const generateNeuralNet = (width, depth) => {
  console.log(width, depth);
  for(let l = 0; l < width; l++) {
    hiddenLayers[0].push({
      weights: [0, 0, 1],
      bias: 0
    });
  }
  for(let i = 1; i <= depth; i++) {
    hiddenLayers.push([]);
    let hiddenLayer = hiddenLayers[i];
    for(let j = 0; j <= width; j++) {
      let neuron = {
        weights: []
      };
      for(let k = 0; k <= width; k++) {
        neuron.weights.push(0);
      }
      hiddenLayer.push(neuron);
    }
  }
}

const getAverageNumberInArray = (array) => {
  const average = (array => array.reduce((a, b) => a + b) / array.length)(array);
  return average;
};

let previousResults = [];
let previousResult = 0;
let averageResult = 0;

const predictNext = (hiddenLayers) => {
  // console.log("previousResult:", previousResult, "averageResult:", averageResult, "previousResults.length:", previousResults.length);
  let hiddenLayerResults = [];
  let initialHiddenLayer = hiddenLayers[0];
  for(let i = 0; i < initialHiddenLayer.length; i++) {
    let neuron = initialHiddenLayer[i];
    let hiddenLayerResult = (neuron.weights[0] * previousResult) + (neuron.weights[1] * averageResult) + (neuron.weights[2] * previousResults.length);
    // console.log("hiddenLayerResult:", hiddenLayerResult);
    if(neuron.bias) {
      hiddenLayerResult -= neuron.bias;
    }
    hiddenLayerResults.push(hiddenLayerResult);
  }
  for(let i = 1; i < hiddenLayers.length; i++) {
    let currentHiddenLayer = hiddenLayers[i];
    let hiddenLayerResultsCopy = hiddenLayerResults;
    hiddenLayerResults = [];
    for(let j = 0; j < currentHiddenLayer.length; j++) {
      let neuron = currentHiddenLayer[j];
      let hiddenLayerResult = 0;
      for(let k = 0; k < hiddenLayerResultsCopy.length; k++) {
        hiddenLayerResult += (neuron.weights[k] * hiddenLayerResultsCopy[k])
      }
      hiddenLayerResults.push(hiddenLayerResult);
    }
  }
  let finalResult = 0;
  for(let i = 0; i < hiddenLayerResults.length; i++) {
    finalResult += hiddenLayerResults[i];
  }
  finalResult = finalResult * calibration;
  finalResult -= finalResultBias;
  previousResults.push(finalResult);
  previousResult = finalResult;
  averageResult = getAverageNumberInArray(previousResults);
  return rounding ? Math.round(finalResult) : finalResult;
}
const squaredError = (expected, actual) => {
  return Math.abs(actual - expected) ** 2;
};
const test = (testingHiddenLayers, y) => {
  reset();
  let totalSquaredError = 0;
  for(let j = 0; j < y.length; j++) {
    let prediction = predictNext(testingHiddenLayers);
    previousResults.push(prediction);
    previousResult = prediction;
    averageResult = getAverageNumberInArray(previousResults);
    let error = squaredError(y[j], prediction);
    totalSquaredError += squaredError(y[j], prediction);
  }
  return totalSquaredError;
};
const learn = (rounds, y) => {
  reset();
  let results = [];
  for(let i = 0; i < rounds; i++) {
    let testingHiddenLayers = hiddenLayers;
    for(let j = 0; j < testingHiddenLayers.length; j++) {
      let testingHiddenLayer = testingHiddenLayers[j]
      for(let k = 0; k < testingHiddenLayer.length; k++) {
        let neuron = testingHiddenLayer[k];
        for(let l = 0; l < neuron.weights.length; l++) {
          neuron.weights[l] += (Math.random() * randRange) - (randRange / 2);
        }
        neuron.bias += (Math.random() * randRange) - (randRange / 2);
      }
    }
    let totalSquaredError = test(testingHiddenLayers, y);
    let meanSquaredError = totalSquaredError / y.length;
    results.push({
      "id": i,
      "hiddenLayer": testingHiddenLayers,
      "meanSquaredError": meanSquaredError
    });
    if(meanSquaredError < test(hiddenLayers, y) / y.length) {
      hiddenLayers = testingHiddenLayers;
    }
    calibration += (Math.random() * randRange) - (randRange / 2);
    finalResultBias += (Math.random() * (randRange * 10)) - (randRange * 5);
  }
  return results;
};

let inputLearningSet = [];

const getSamplesBetween = (a, b, samplesPerUnit) => {
  // you could add some stuff here to validate the inputs
  const incrementSize = (b - a) / samplesPerUnit;
  let sample = 1;
  let result = [];
  while (sample < samplesPerUnit) {
    result.push(a + (incrementSize * sample));
    sample++;
  }
  return result;
}

const addSamples = (arr) => {
  let resultArr = [];
  for(let i = 0; i < arr.length; i++) {
    if(i != arr.length - 1) {
      resultArr = [...resultArr, arr[i], ...getSamplesBetween(arr[i], arr[i + 1], samplesPerUnit)];
    } else {
      resultArr = [...resultArr, arr[i]];
    }
  }
  return resultArr;
}

let learningSet = [];
if(useSamples) {
  learningSet = addSamples(inputLearningSet);
}
const learnWithPresets = () => {
  learn(learningRounds, learningSet);
}

const showResults = (size, samplesPerUnit) => {
  let modelResults = [];
  for(let i = 0; i < size; i++) {
    modelResults.push(predictNext(hiddenLayers));
  }
  reset();
  let finalResults = [];
  if(useSamples) {
    for(let i = 0; i < modelResults.length - 5; i += samplesPerUnit - 1) {
      finalResults.push(modelResults[i]);
    }
    for(let i = modelResults.length - 5; i < modelResults.length; i++) {
      finalResults.push(modelResults[i]);
    }
  } else {
    finalResults = modelResults;
  }
  return finalResults;
}

const setSamplesPerUnit = (samples) => {
  samplesPerUnit = samples;
};

const setHiddenLayerSize = (size) => {
  hiddenLayerSize = size;
};

const setNeuralNetDepth = (depth) => {
  neuralNetDepth = depth;
};

const setRandRange = (range) => {
  randRange = range;
};

const setFinalResultBias = (bias) => {
  finalResultBias = bias;
};

const setCalibration = (calibrationAmount) => {
  calibration = calibrationAmount;
};

const setLearningRounds = (rounds) => {
  learningRounds = rounds;
};

const setRounding = (bool) => {
  rounding = bool;
};

const setUseSamples = (bool) => {
  useSamples = bool;
};

const addInput = (sample) => {
  inputLearningSet.push(sample);
};

const setCustomModel = (model) => {
  hiddenLayers = model;
};

const setPreviousResults = (results) => {
  previousResults = results;
  previousResult = results[results.length - 1];
  averageResult = getAverageNumberInArray(results);
};
export {hiddenLayerSize, neuralNetDepth, randRange, finalResultBias, calibration, learningRounds, rounding, samplesPerUnit, useSamples, hiddenLayers, generateNeuralNet, learnWithPresets, showResults, learn, setSamplesPerUnit, setHiddenLayerSize, setNeuralNetDepth, setRandRange, setFinalResultBias, setCalibration, setLearningRounds, setRounding, setUseSamples, setCustomModel, setPreviousResults, addInput, reset};