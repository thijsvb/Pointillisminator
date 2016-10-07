var goButton, hoButton, box;
var disks = [];
var img;
var go = false;

function preload() {
  img = loadImage("test.jpg");
}

function setup() {
  goButton = createButton("GO!");
  goButton.mousePressed(startStuff);
  hoButton = createButton("HO!");
  hoButton.mousePressed(stopStuff);
  var ln = createP('');
  var can = createCanvas(500, 500);

  var middle = select('#middle');
  middle.child(goButton);
  middle.child(hoButton);
  middle.child(ln);
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
}

function startStuff() {
  clear();
  disks = [];
  var h = random(255);
  tCol = color(h, 255, 255);
  mCol = color((h + 75) % 256, 255, 255);
  bCol = color((h + 171) % 256, 255, 255);
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
  var ranX = random(width);
  var ranY = random(height);
  var d = new Disk(ranX, ranY, img);

  var count = 0;
  while (d.olap(disks)) {
    ranX = random(width);
    ranY = random(height);
    d.x = ranX;
    d.y = ranY;

    if (box.checked()) {
      fill(255);
      ellipse(ranX, ranY, 10, 10);
    }
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
  this.max = 13;
  this.rad = this.min
  this.img = img;
  this.dia = function() {
    return this.rad * 2;
  };
  this.col = function() {
    var X = floor(constrain(this.x, 0, this.img.width)) * 4;
    var Y = floor(constrain(this.y, 0, this.img.height)) * 4;
    this.img.loadPixels();
    var ind = Y * this.img.width + X;
    return color(this.img.pixels[ind], this.img.pixels[ind+1], this.img.pixels[ind+2], this.img.pixels[ind+3]);
  };
  this.olap = function(other) {
    if (this.rad > this.max) {
      return true;
    }

    for (var i = 0; i != other.length; ++i) {
      if (dist(this.x, this.y, other[i].x, other[i].y) < this.rad) {
        return true;
      }
    }
    return false;
  };
}
