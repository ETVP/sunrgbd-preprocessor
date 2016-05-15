"use strict";

const path = require('path');
const fs = require('./fs-promise');

` 2 Data: Image depth and label data are in SUNRGBD.zip
  3 image: rgb image
  4 depth: depth image  to read the depth see the code in SUNRGBDtoolbox/read3dPoints/.
  5 extrinsics: the rotation matrix to align the point could with gravity
  6 fullres: full resolution depth and rgb image
  7 intrinsics.txt  : sensor intrinsic
  8 scene.txt  : scene type
  9 annotation2Dfinal  : 2D segmentation
 10 annotation3Dfinal  : 3D bounding box
 11 annotation3Dlayout : 3D room layout bounding box
`;

const DIR = {
  depth: 'depth',
  image: 'image',
  scene: 'scene.txt',
  sensorIntrinsic: 'intrinsics.txt'
};

function listOnlyFile(root, dir) {
  const folder = path.join(root, dir);
  const xs = fs.readdirSync(folder);
  return path.join(folder, xs[0]);
}

class Sample {
  constructor(root) {
    this.root = root;
    this.scene = fs.readStringSync(path.join(this.root, DIR.scene));
    this.image = listOnlyFile(root, DIR.image);
    this.depth = listOnlyFile(root, DIR.depth);
  }
}

function isSampleLocation(location) {
  return fs.stat(location)
    .then(s => {
      if (s.isDirectory()) {
        return fs.readdir(location)
          .then(xs => xs.includes(DIR.scene), rej =>false);
      } else {
        return false;
      }
    }, rej => false);
}

/**
 * group samples by scene
 * @param xs {Sample[]}
 * @return {Map}
 */
function group(xs) {
  let samples = new Map();
  xs.forEach(x => {
    const scene = x.scene;
    if (samples.has(scene)) {
      samples.get(scene).push(x);
    } else {
      samples.set(scene, [x]);
    }
  });
  return samples;
}

exports.Sample = Sample;
exports.isSampleLocation = isSampleLocation;
exports.group = group;
