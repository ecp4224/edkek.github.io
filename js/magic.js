var radius = 300;
var bars = [];
var frequencyData;
var analyser;
var start = 0;
var intensity = 200;
var timeLeft = 38;
var faded = false;

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

window.onload = function() {
  $('#time').css({'display': 'none'})
  if (typeof AudioContext === "undefined") {
    $('h1').text(":(");
    $('p').text("This browser is not supported...");
    $('#author').hide();
    return;
  }
  var ctx = new AudioContext();
  var audio = document.getElementById('music');
  audio.crossOrigin = "anonymous";
  var audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();

  audioSrc.connect(analyser);
  analyser.connect(ctx.destination);

  frequencyData = new Uint8Array(analyser.frequencyBinCount);

  intensity = 360 / (analyser.frequencyBinCount / 2);

  //document.querySelector('video').defaultPlaybackRate = 0.04;

  gameWidth = $(window).width();
  gameHeight = $(window).height();

  showIntro();

  audio.play();
  audio.ontimeupdate = function() {
    timeLeft--;
    if (timeLeft <= 0 && !faded) {
      faded = true;
      $('#myCanvas').fadeIn();
      createBars();
      $('#intro2').fadeOut();
      $('#time').fadeIn();
      renderFrame();
    }
  };
  audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);

  showAuthor();
};

function createBars() {
    var centerX = Math.floor(window.innerWidth/2);
    var centerY = Math.floor(window.innerHeight/4);
    radius = window.innerWidth / 8;
    centerY = centerY - (radius / 8);

    for (var i = 0; i < 360 / intensity; i++) {
        var e = $("<div class='bar no-interact'></div>");

        var degree = (i * intensity) - 90;
        var rad = Math.radians(i * intensity);

        var x = (centerX + radius * Math.cos(rad));
        var y = (centerY + radius * Math.sin(rad));

        e.css({top: y, left: x, position: 'absolute'});
        e.css({'transform': 'rotate(' + degree + 'deg)', '-webkit-transform': 'rotate(' + degree + 'deg)'});

        e.appendTo('.bars');

        bars.push(e);
    }
}

function renderFrame() {
    analyser.getByteFrequencyData(frequencyData);

    var centerX = Math.floor(window.innerWidth/2);
    var centerY = Math.floor(window.innerHeight/4);

    radius = window.innerWidth / 8;
    centerY = centerY - (radius / 8);

    for (var i = start; i < (360 / intensity) + start; i++) {
        var value = frequencyData[i];
        var bar = bars[i - start];

        var rad = Math.radians((i - start) * intensity);

        var x = (centerX + radius * Math.cos(rad));
        var y = (centerY + radius * Math.sin(rad));

        bar.css({'height': value, 'top': y, 'left': x});
    }

    updateTime();

    requestAnimationFrame(renderFrame);
}

function updateTime() {
    var time = $('#time');

    var now = new Date();

    var hours = now.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }

    var minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    time.text(hours + ':' + minutes);
}

function showAuthor() {
  var tooltip = new HTML5TooltipUIComponent;
  var target = document.getElementById("author");

  tooltip.set({
    color: "bamboo",
    contentText: "Mix by NEOTIC",
    stickTo: "left",
    target: target
  });

  tooltip.mount();
  tooltip.show();

  target.addEventListener('mouseenter',function(){
    tooltip.show();
  });

  target.addEventListener('mouseleave',function(){
    tooltip.hide();
  });

  setTimeout(function() {
    tooltip.hide();
    setTimeout(function() {
      nextIntro();
    }, 4500);
  }, 4500);
}

function showGithub() {
  var tooltip = new HTML5TooltipUIComponent;
  var target = document.getElementById("github");

  tooltip.set({
    color: "bamboo",
    contentText: "Check out my other projects",
    stickTo: "left",
    target: target
  });

  tooltip.mount();
  tooltip.show();

  target.addEventListener('mouseenter',function(){
    tooltip.show();
  });

  target.addEventListener('mouseleave',function(){
    tooltip.hide();
  });

  setTimeout(function() {
    tooltip.hide();
    nextIntro();
    bindHover();
  }, 4500);
}

function nextIntro() {
  var name = $('#intro');
  var time = $('#intro2');
  name.addClass('down');
  time.addClass('center');
  name.removeClass('center');
  time.removeClass('up');
}

function showIntro() {
  var time = $('#intro2');
  var name = $('#intro');
  name.removeClass('up'); //Just in case?
  time.addClass('up');
  name.addClass('center');
  time.removeClass('center');
  name.removeClass('down');
}


$(function(){
  /*
    :glitchBoy
  */
  function glitchBoy(canvas, options){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.origCanvas = document.createElement('canvas');
    this.origContext = this.origCanvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.options = options;
  }
  glitchBoy.prototype.drawImage = function(img, x, y){
    this.canvas.getContext("2d").drawImage(img, x, y);
  };
  glitchBoy.prototype.glitchWave = function(renderLineHeight, cuttingHeight){
    var image = this.ctx.getImageData(0, renderLineHeight, this.width, cuttingHeight);
    this.ctx.putImageData(image, 0, renderLineHeight - 10);
  };
  glitchBoy.prototype.glitchSlip = function(waveStrength, startHeight, endHeight){
    if(endHeight < startHeight){
      var temp = endHeight;
      endHeight = startHeight;
      startHeight = temp;
    }
    for(var h = startHeight; h < endHeight; h++){
      if(Math.random() < 0.1)h++;
      var image = this.ctx.getImageData(0, h, this.width, 1);
      this.ctx.putImageData(image, Math.random()*waveStrength-(waveStrength/2), h);
    }
  };
  glitchBoy.prototype.glitchFillRandom = function(fillCnt, cuttingMaxHeight){
    var cw = this.width;
    var ch = this.height;
    for(var i = 0; i< fillCnt; i++){
      var rndX = cw * Math.random();
      var rndY = ch * Math.random();
      var rndW = cw * Math.random();
      var rndH = cuttingMaxHeight * Math.random();
      var image = this.ctx.getImageData(rndX,rndY,rndW, rndH);
      this.ctx.putImageData(image, (rndX* Math.random())%cw, rndY);
    }
  }
  glitchBoy.prototype.process = function () {

  }

  /*
    :videoGirl
  */
  function videoGirl(options, callback){
    var options = $.extend({
      src:"",
      type:'video/ogg',
      controls:false,
      autoplay:true,
      loop:true,
      muted:true,
      playbackRate: 1
    }, options);
    var video = document.createElement('video');
    video.crossOrigin = 'anonymous'; // important!!!!
    video.controls = options.controls;
    video.autoplay = options.autoplay;
    video.loop = options.loop;
    video.muted = options.muted;
    video.defaultPlaybackRate = options.playbackRate;
    var source = document.createElement('source');
    source.src = options.src;
    source.type = options.type;
    video.appendChild(source);
    this.video = video;
    this.source = source;
    //video.play();
    // load
    if(callback !== null){
      video.addEventListener('loadeddata', callback);
    }
  };


  // sync
  var FPS = 30;
  var frm = 0;
  var vGirl = new videoGirl({
    src:'../media/love.webm',
    type:'video/webm',
    playbackRate: 0.5
  }, sync);
  function sync(){
    var canvas = document.getElementById("myCanvas");
    var glitch = new glitchBoy(canvas);
    setInterval(function(){
      frm++;
      glitch.drawImage(vGirl.video, 0, 0);
      glitch.glitchWave((frm * 3) % glitch.height, 10);
      if(frm %100 < 10){
        // fillCnt, cuttingMaxHeight
        glitch.glitchFillRandom(5, 20);
      }
      if(80 < frm%100){
        glitch.glitchSlip(10,200,300);
      }
      if(95 < frm%100){
        glitch.glitchSlip(10,100* Math.random(),400 * Math.random());
      }
    }, 1000/FPS);
  }

});
