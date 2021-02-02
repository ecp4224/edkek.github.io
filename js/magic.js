//let angle = 0;
//let w = 50;
let ma;
let maxD;
let winWidth;
let winHeight;

let analyser;
let frequencyData;
let intensity;

var temp = 0;

entity_list = []

function setup() {
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;

  createCanvas(winWidth, winHeight, WEBGL);
  ma = atan(cos(QUARTER_PI/0.6));
  maxD = dist(0, 0, 400, 400);

  init();

  var ctx = new AudioContext();
  var audio = document.getElementById('music');
  audio.crossOrigin = "anonymous";
  var audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();

  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);

  frequencyData = new Uint8Array(analyser.frequencyBinCount);

  intensity = 360 / (analyser.frequencyBinCount / 2);
  audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);

  button = createButton('Play');
  button.position(20, 65);
  button.mousePressed(onplay);
  //createH1("Coming Soon..");
}

function onplay() {
  audio.play();
}

function registerEntity(entity) {
  entity_list.push(entity);
}

function draw() {
  analyser.getByteFrequencyData(frequencyData);

  background(50);
  ortho(-winWidth/2, winWidth/2, winHeight/2, -winHeight/4, -1380, 1380);

  ambientLight(40);
  directionalLight(100, 100, 100, 0.5, 0.5, 0);
  //pointLight(0, 0, 255, 0, 0, 0);

  rotateX(ma);
  rotateY(-QUARTER_PI)﻿


  //pointLight(0, 0, 255, 0, 10, 0);

  for (let i = 0; i < entity_list.length; i++) {
    let e = entity_list[i];

    pointLight(100, 200, 255, e.x, 500, e.z);

    let w = e.width;
    let h = e.height;
    let x = e.x;
    let y = e.y;
    let z = e.z;

    push();

    if (typeof e.update === 'function') {
      e.update();
    }
    translate(x, 0, z);
    box(w, h, w);

    pop();
  }

  //console.log("Lights: " + temp);
  temp = 0;
}

function init() {
  let box_seperate = 2;
  let box_size = 70;
  let bw = 870;
  let bh = 870;

  let x = 0;
  let z = 0;
  let id = 0;
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      registerEntity(groundCube(x, z, box_size, id));

      x += (box_size + box_seperate);

      id++;
    }
    x = 0;
    z += (box_size + box_seperate);
  }

  /*for (let z = 0; z < bw-1; z += (box_size + box_seperate)) {
    for (let x = 0; x < bh-1; x+= (box_size + box_seperate)) {
      registerEntity(groundCube(x, z, box_size));

    }
  }*/

  console.log("Registered " + entity_list.length + " entities!");
}
function groundCube(x, z, w, id) {
  return {
    "x": x,
    "z": z,
    "y": 0,
    "id": id,
    "width": w,
    "height": 50,
    "isEasing": false,
    "easeTarget": 0,
    "easeStart": 0,
    "easeDuration": 0,
    "easeStartTime": 0,
    "startEase": function(target) {
      this.isEasing = true;
      this.easeTarget = target;
      this.easeStart = this.height;
      this.easeStartTime = millis();
      this.easeDuration = random(50) * 500;
    },
    "update": function() {
      //normalMaterial();
      var value = frequencyData[id];

      this.height = value;

      specularMaterial(44,252,251);

      /*if (!this.isEasing) {
        let test = random(10000);

        if (test < 10) {
          this.startEase(random(100));
        }
      } else {
        let value = ease(this.easeStart, this.easeTarget,
          this.easeDuration, (millis() - this.easeStartTime));

        this.height = value;

        if (this.height == this.easeTarget) {
          this.isEasing = false;

          if (this.height > 50 || this.height < 50) {
            this.startEase(50);
          }
        }
      }*/
    }
  }
}

function ease(start, target, duration, timeSinceStart) {
  let value = start;
  if (timeSinceStart > 0.0 && timeSinceStart < duration) {
    let range = target - start;
    let percent = timeSinceStart / (duration / 2.0);
    if (percent < 1.0) {
      value = start + ((range / 2.0) * percent * percent * percent);
    } else {
      let shiftedPercent = percent - 2.0;
      value = start + ((range / 2.0) *
          ((shiftedPercent * shiftedPercent * shiftedPercent) + 2.0));
    }
  } else if (timeSinceStart >= duration) {
    value = target;
  }
  return value;
}
