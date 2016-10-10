var middle;
var can;
var testButton;
var disks = [];
var img;
var go = false;

function setup() {
  testButton = createButton("Use test image");
  testButton.mousePressed(loadTest);
  var p = createP('');
  can = createCanvas(720, 540);

  middle = select("#middle");
  middle.child(testButton);
  middle.child(p);
  middle.child(can);

  middle.dragOver(
    function() {
      highlight("#303030");
    }
  );
  middle.dragLeave(
    function() {
      highlight("#202020");
    }
  );
  middle.drop(gotFile,
    function() {
      highlight("#202020")
    }
  );

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

//   if (frameRate() < 5) {
//     stopStuff();
//   }
}

function highlight(color) {
  middle.style("background-color", color);
}

function loadTest() {
  img = loadImage("test.jpg", startTest);
}

function gotFile(file) {
  if(file.type === "image") {
    img = createImage(file.data).hide;
    // This is supposed to get me a p5 image object, but it doesn't :(
    // See this example: http://p5js.org/examples/dom-drop.html
    // can.resize(img.width, img.height);
    // startStuff();
  } else {
    highlight("#302020");
  }
}

function startTest() {
  img.resize(width, height);
  startStuff();
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
    return color(this.img.pixels[ind], this.img.pixels[ind + 1], this.img.pixels[ind + 2], this.img.pixels[ind + 3]);
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
