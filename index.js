"use strict";

const minimist = require('minimist');
const fs = require('./src/fs-promise');
const walker = require('./src/walker');
const splitByRate = require('./src/split');
const resizeSet = require('./src/resize');
const dump = require('./src/dump');
const sample = require('./src/sample');
const filter = require('./src/filter');

function nullify(promise, fallback = null) {
  return promise.catch(() => fallback);
}

function parseDatasetPath(path_) {
  if (path_) {
    return Promise.resolve(path_);
  } else {
    return Promise.reject("Must specify the root of your SUNRGB-D copy.");
  }
}

function parseSceneList(source) {
  return nullify(fs.readJSON(source).catch(() => source.split(',')));
}

function parsePixelSize(size) {
  return nullify(new Promise((resolve) => {
    const match = /(\d+)x(\d+)/.exec(size);
    resolve(match != null ? [parseInt(match[1]), parseInt(match[2])] : null);
  }));
}

function parseArguments(argv) {
  const {
    _: [datasetPath],
    r:resize_,
    s:scenes_,
    o: output
  } = minimist(argv);
  return Promise.all([
    parseDatasetPath(datasetPath),
    parsePixelSize(resize_),
    parseSceneList(scenes_),
    Promise.resolve(output)
  ]);
}

parseArguments(process.argv.slice(2))
  .then(([datasetPath, resize, scenes, output]) => {
    console.log(`Scanning: ${datasetPath}`);
    if (resize) {
      console.log(`Resize: ${resize}`);
    }
    if (scenes) {
      console.log(`Scenes: ${scenes}`);
    }
    if (output) {
      console.log(`Output: ${output}`)
    }
    return walker.gather(datasetPath)
      .then(sample.group)
      .then(xs => filter(scenes, xs))
      .then(xs => resize ? resizeSet(xs, resize) : xs)
      .then(splitByRate)
      .then(xs => dump(xs, output))
      .then(() => console.log('Done.'))
  }).catch(console.error);
