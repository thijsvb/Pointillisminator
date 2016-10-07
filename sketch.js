var middle;
var testButton;
var disks = [];
var img;
var go = false;

function setup() {
  testButton = createButton("Use test image");
  testButton.mousePressed(loadTest);
  var can = createCanvas(500, 500);

  middle = select("#middle");
  middle.child(testButton);
  middle.child(can);

  clear();
  noStroke();
}

function draw() {
  if (go) {
    clear();
    for (var i = 0; i != disks.length; ++i) {
      fill(disks[i].col());
      ellipse(disks[i].x, disks[i].y, disks[i].dia(), disks[i].dia());
    }
    doStuff();
  }

  if(frameRate() < 1) {
    console.log(frameRate());
    stopStuff();
  }
}

function loadTest() {
  img = loadImage("test.jpg", startStuff);
}

function startStuff() {
  img.loadPixels();
  clear();
  disks = [];
  go = true;
}

function stopStuff() {
  if (go) {
    go = false;
    clear();
    for (var i = 0; i != disks.length; ++i) {
      fill(disks[i].col());
      ellipse(disks[i].x, disks[i].y, disks[i].dia(), disks[i].dia());
    }
  } else {
    clear();
  }
}

function doStuff() {
  var d = new Disk(random(width), random(height), img);

  var count = 0;
  while (d.olap(disks)) {
    d.x = random(width);
    d.y = random(width);
    if (++count > 1000) return;
  }

  while (!d.olap(disks)) {
    ++d.rad;
  }
  --d.rad;

  disks[disks.length] = d;
}


function Disk(x, y, img) {
  this.x = x;
  this.y = y;
  this.min = 3;
  this.max = 7;
  this.rad = this.min
  this.img = img;
  this.dia = function() {
    return this.rad * 2;
  };
  this.col = function() {
    var X = floor(constrain(this.x, 0, this.img.width)) * 4;
    var Y = floor(constrain(this.y, 0, this.img.height)) * 4;
    var ind = Y * this.img.width + X;
    return color(this.img.pixels[ind], this.img.pixels[ind+1], this.img.pixels[ind+2], this.img.pixels[ind+3]);
  };
  this.olap = function(other) {
    if (this.rad > this.max) {
      return true;
    }

    for (var i = 0; i != other.length; ++i) {
      if (dist(this.x, this.y, other[i].x, other[i].y) < 5) {
        return true;
      }
    }
    return false;
  };
}
