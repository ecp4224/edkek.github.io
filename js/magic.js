//let angle = 0;
//let w = 50;
let ma;
let maxD;
let winWidth;
let winHeight;

entity_list = []

function setup() {
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;

  createCanvas(winWidth, winHeight, WEBGL);
  ma = atan(cos(QUARTER_PI/0.6));
  maxD = dist(0, 0, 400, 400);

  init();
}

function registerEntity(entity) {
  entity_list.push(entity);
}

function draw() {
  background(100);
  ortho(-winWidth, winWidth, winHeight, -winHeight, -2500, 20000);

  ambientLight(100);
  directionalLight(255, 0, 0, 0.25, 0.25, 0);
  //pointLight(0, 0, 255, 0, 0, 0);

  rotateX(-ma);
  rotateY(-QUARTER_PI)﻿

  for (let i = 0; i < entity_list.length; i++) {
    let e = entity_list[i];

    push();

    if (typeof e.update === 'function') {
      e.update();
    }

    let w = e.width;
    let h = e.height;
    let x = e.x;
    let y = e.y;
    let z = e.z;
    translate(x - width / 2, 0, z - height / 2);
    box(w, h, w);

    pop();
  }
}

function init() {
  let box_seperate = 2;
  let box_size = 100;
  let bw = 4000;
  let bh = 4200;

  for (let z = 0; z < bw-1; z += (box_size + box_seperate)) {
    for (let x = 0; x < bh-1; x+= (box_size + box_seperate)) {
      registerEntity(groundCube(x, z));
    }
  }
}

function groundCube(x, z) {
  return {
    "x": x,
    "z": z,
    "y": 0,
    "width": 100,
    "height": 50,
    "isEasing": false,
    "easeTarget": 0
    "easeStart": 0
    "update": function() {
      pointLight(0, 0, 255, this.x, 10, this.z);
      specularMaterial(250);
    }
  }
}
