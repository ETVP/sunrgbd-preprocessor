"use strict";

const fs = require('./fs-promise');
const fsex = require('fs-extra');
const path = require('path');
const child_process = require('child_process');


function resizeSet(xs, size) {
  let total = 0;
  let count = 1;
  xs.forEach(ss => total += ss.length);
  xs.forEach(ss => {
    ss.forEach(x => {
      let raw = x.image;
      let cwd = process.cwd();
      let rel = path.relative(cwd, raw);
      let target = path.join(`R${size[0]}_${size[1]}${rel}`);
      fsex.ensureFileSync(target);
      console.log(`Resize[${count++}/${total}]: ${rel}`);
      child_process.execSync(`convert ${raw} -resize ${size[0]}x${size[1]}! ${target}`);
      x.image = path.resolve(target);
    });
  });
  return xs;
}

module.exports = resizeSet;
