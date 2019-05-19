const tf = require("@tensorflow/tfjs"),
//import * as tf from '@tensorflow/tfjs';
//import {IMAGE_H, IMAGE_W, MnistData} from './data';
      data = require("./data"),
      IMAGE_H = data.IMAGE_H,
      IMAGE_W = data.IMAGE_W,
      MnistData = data.MnistData;

const model = {
    data: {},

    createConvModel: function() {
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
    },

    train: async function(model, onIteration) {
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
    },

    showPredictions: async function(model) {
        const testExamples = 100;
        const examples = data.getTestData(testExamples);

        tf.tidy(() => {
          const output = model.predict(examples.xs);
          const axis = 1;
          const labels = Array.from(examples.labels.argMax(axis).dataSync());
          const predictions = Array.from(output.argMax(axis).dataSync());

          console.log(examples, predictions, labels);
        });
    },

    load: async function() {
        this.data = new MnistData();
        await this.data.load();
    },

    setStatus: function(str){
        console.log(str);
    },

    setProgress: function(str) {
        console.log(str);
    }
}

module.exports = model;
