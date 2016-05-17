"use strict";

function filter(scenes, xs) {
  let ys = new Map();
  scenes.forEach(scene => {
    if (xs.has(scene)) {
      ys.set(scene, xs.get(scene));
    }
  });
  return ys;
}

module.exports = filter;