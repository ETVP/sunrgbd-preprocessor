"use strict";

const fs = require('fs');
const path = require('path');

function wrap(fn) {
  return function (...args) {
    return new Promise((resolve, reject) =>
      fn(...args, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      }));
  }
}

for (let key of Object.keys(fs)) {
  let fn = fs[key];
  if (fn instanceof Function && !key.endsWith('Sync') && key.match(/[a-z]/)) {
    exports[key] = wrap(fn);
  } else {
    exports[key] = fn;
  }
}

const u8 = {encoding: 'utf-8'};

exports.readString = function (location) {
  return exports.readFile(location, u8);
};

exports.readJSON = function (location) {
  return exports.readString(location).then(JSON.parse);
};

exports.readStringSync = function (location) {
  return fs.readFileSync(location, u8);
};

exports.readJSONSync = function (location) {
  return JSON.parse(exports.readStringSync(location));
};

exports.subdirs = function (location) {
  return exports.readdir(location)
    .then(xs => xs.map(x => path.join(location, x)), rej => []);
};
