initTable();

import * as tf from '@tensorflow/tfjs';
import {IMAGE_H, IMAGE_W, MnistData} from './data';

function createConvModel() {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_H, IMAGE_W, 1],
    kernelSize: 3,
    filters: 16,
    activation: 'relu'
  }));

  model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
  model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
  model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
  model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
  model.add(tf.layers.flatten({}));
  model.add(tf.layers.dense({units: 64, activation: 'relu'}));
  model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

  return model;
}

async function train(model, onIteration) {
  console.log('Training model...');

  const LEARNING_RATE = 0.01;

  const optimizer = 'rmsprop';

  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  const batchSize = 320;

  const validationSplit = 0.15;

  const trainEpochs = 3;

  let trainBatchCount = 0;

  const trainData = data.getTrainData();
  const testData = data.getTestData();

  const totalNumBatches =
      Math.ceil(trainData.xs.shape[0] * (1 - validationSplit) / batchSize) *
      trainEpochs;

  let valAcc;
  await model.fit(trainData.xs, trainData.labels, {
    batchSize,
    validationSplit,
    epochs: trainEpochs,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        trainBatchCount++;
        setProgress(
            `Training... (` +
            `${(trainBatchCount / totalNumBatches * 100).toFixed(1)}%` +
            ` complete). To stop training, refresh or close page.`);
        setStatus("Training - Batch count: " + trainBatchCount + " loss: " + logs.loss + "\n" +
                  "accuracy " + logs.acc);
        if (onIteration && batch % 10 === 0) {
          onIteration('onBatchEnd', batch, logs);
        }
        await tf.nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        valAcc = logs.val_acc;
        setStatus("Validation - Batch count: " + trainBatchCount + " loss: " + logs.val_loss + "\n" +
                  "accuracy: " + logs.val_acc);
        if (onIteration) {
          onIteration('onEpochEnd', epoch, logs);
        }
        await tf.nextFrame();
      }
    }
  });

  const testResult = model.evaluate(testData.xs, testData.labels);
  const testAccPercent = testResult[1].dataSync()[0] * 100;
  const finalValAccPercent = valAcc * 100;
  setStatus(
      `Final validation accuracy: ${finalValAccPercent.toFixed(1)}%; ` +
      `Final test accuracy: ${testAccPercent.toFixed(1)}%`);
}

async function showPredictions(model) {
  const testExamples = 100;
  const examples = data.getTestData(testExamples);

  tf.tidy(() => {
    const output = model.predict(examples.xs);
    const axis = 1;
    const labels = Array.from(examples.labels.argMax(axis).dataSync());
    const predictions = Array.from(output.argMax(axis).dataSync());

    console.log(examples, predictions, labels);
  });
}

let data;
async function load() {
  data = new MnistData();
  await data.load();
}

function setTrainButtonCallback(callback) {
  const trainButton = document.getElementById('train');
  trainButton.addEventListener('click', () => {
    trainButton.setAttribute('disabled', true);
    callback();
  });
}

setTrainButtonCallback(async () => {
  setStatus("Loading MNIST data...");
  await load();

  setStatus("Creating model...");
  const model = createConvModel();
  model.summary();

  setStatus("Starting model training...");
  await train(model, () => showPredictions(model));
  await setPredictButton(model);
});

function setPredictButton(model) {
  let predictBtn = document.getElementById("predict");
  let m = model;
  predictBtn.addEventListener("click", function() {
    tf.tidy(() => {
      let data = convertGridToData();
      let output = m.predict(tf.tensor4d(data, [1, 28, 28, 1]));
      const axis = 1;
      const predictions = output.argMax(axis).dataSync();

      document.getElementById("prediction").innerHTML = predictions[0];
    });
  });
}

function convertGridToData() {
  let cells = document.querySelectorAll("td");
  let dataArr = [];
  cells.forEach( function(cell) {
    if(cell.getAttribute("style") == "background-color: black;") {
      dataArr.push(255);
    } else {
      dataArr.push(0);
    }
  });
  return dataArr;
}

//TODO: Increase resolution
function initTable() {
  let table = document.getElementById("drawingGrid");
  for(let i = 0; i < 28; i++) {
    let row = table.insertRow(i);
    for(let j = 0; j < 28; j++) {
      row.insertCell(j);
    }
  }

  var mouseDown = 0;

  document.body.addEventListener("mousedown", function() {
    mouseDown = 1;
  });

  document.body.addEventListener("mouseup", function() {
    mouseDown = 0;
  });

  document.body.addEventListener("mousemove", function(e) {
    if( mouseDown == 1 && e.target.tagName == "TD") {
        e.target.setAttribute("style", "background-color: black;");
      }
  });

  let clearBtn = document.getElementById("clear");
  clearBtn.addEventListener("click", function() {
    let cells = document.querySelectorAll("td");
    cells.forEach( function(cell) {
      cell.setAttribute("style", "");
    });
  });
}

function setStatus(str) {
  document.getElementById("status").innerHTML = str;
}

function setProgress(str) {
  document.getElementById("progress").innerHTML = str;
}
