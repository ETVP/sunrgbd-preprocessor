"use strict";

const fs = require('./fs-promise');
const path = require('path');

/**
 * dump a scene-[Sample] Map to a String of scene-imagePath mapping
 * @param ss {Map}
 * @return {string}
 */
function dumpSampleSet(ss) {
  let perScene = [];
  let scenes = Array.from(ss.keys());
  ss.forEach((xs, scene) => {
    perScene.push(xs.map(x => `${x.image} ${scenes.indexOf(scene)}`).join('\n'));
  });
  return perScene.join('\n');
}

/**
 * dump train/test set
 * @param trainSet
 * @param testSet
 * @return {Promise}
 */
function dump([trainSet, testSet]) {
  const trainDump = dumpSampleSet(trainSet);
  const testDump = dumpSampleSet(testSet);
  const labelsDump = JSON.stringify(Array.from(trainSet.keys()), null, '  ');
  const base = process.cwd();
  const trainPath = path.join(base, 'train.txt');
  const testPath = path.join(base, 'test.txt');
  const labelPath = path.join(base, 'label.json');

  return Promise.all([
    [testPath, testDump],
    [trainPath, trainDump],
    [labelPath, labelsDump]
  ].map(xs => fs.writeFile(...xs)));
}

module.exports = dump;
