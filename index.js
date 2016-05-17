"use strict";

const fs = require('./src/fs-promise');
const walker = require('./src/walker');
const path = require('path');
const splitByRate = require('./src/split');
const resizeSet = require('./src/resize');
const dump = require('./src/dump');
const sample = require('./src/sample');
const filter = require('./src/filter');

let datasetPath, resize, args = process.argv.slice(2);

if (args.length == 1) {
  datasetPath = args[0];
  resize = false;
} else if (args.length == 3) {
  datasetPath = args[0];
  resize = args.slice(1).map(x => parseInt(x));
  console.log('Resizeing:', resize);
} else {
  console.error(process.argv);
  process.exit(-1);
}

const scenes = [
  "bathroom",
  "bedroom",
  "office",
  "classroom"
];

console.log(`Scanning: ${datasetPath}`);

walker.gather(datasetPath)
  .then(sample.group)
  .then(xs => filter(scenes, xs))
  .then(xs => resize ? resizeSet(xs, resize) : xs)
  .then(splitByRate)
  .then(dump)
  .then(() => console.log('Done.'))
  .catch(err => console.error(err));
