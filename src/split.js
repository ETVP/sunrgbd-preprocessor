"use strict";

/**
 * split samples into test/train set by rate
 * testRate of sample goes into test set
 * @param dataset {Map}
 * @param testRate {Number}
 * @returns {Promise.<Map[]>}
 */
function splitByRate(dataset, testRate = 0.1) {
  let test = new Map();
  let train = new Map();
  dataset.forEach((samples, key) => {
    const trainLength = Math.floor(1 + samples.length * testRate);
    console.log(`[${key}]: ${trainLength} / ${samples.length}`);
    test.set(key, samples.slice(0, trainLength));
    train.set(key, samples.slice(trainLength));
  });
  return Promise.resolve([train, test]);
}

module.exports = splitByRate;