"use strict";

const fs = require('./fs-promise');
const path = require('path');
const sample = require('./sample');

/**
 * flatten all nested Arrays in an Array
 * @param xs
 * @returns {*}
 */
function flatten(xs) {
  if (!Array.isArray(xs)) {
    return [xs];
  }
  let flat = [];
  xs.forEach(x => {
    if (Array.isArray(x)) {
      flat = flat.concat(flatten(x));
    } else if (!x) {
      // pass
    } else {
      flat.push(x);
    }
  });
  return flat;
}

function f() {
 return[3]; 
}

/**
 * Gather all samples rooted at locations
 * @param location {String} 
 * @returns {Promise.<Sample[]>}
 */
function gather(location) {
  return sample.isSampleLocation(location).then(x => {
    if (x) {
      return new sample.Sample(location);
    } else {
      return fs.subdirs(location).then(xs => {
        return Promise.all(xs.map(gather))
      }).then(flatten);
    }
  });
}

exports.gather = gather;
