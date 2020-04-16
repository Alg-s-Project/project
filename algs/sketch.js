let numSlider, circleNum, diameter, isNoLoop, dslider;

function setup() {
  noLoop();
  isNoLoop = true;
  // create sliders
  numSlider = createSlider(0, 1000, 100);
  numSlider.addClass("slider");
  

  // create input
  circleNum = createInput(numSlider.value().toString(), "number");
  circleNum.addClass("input");

  // change value of input to slider value
  numSlider.input(sliderChange);

  dSlider = createSlider(10, 30, 20);
  dSlider.addClass('slider')
  dSlider.input(dsliderChange)

  // create diameter
  diameter = createInput("20", "number");
  diameter.addClass("input");

  // create button
  let button = createButton("Populate");
  button.style("margin", "12px");
  button.mousePressed(buttonPressed);

  // put setup code here
  let cnv = createCanvas(900, 600);
  background(15, 0, 146);
}

function dsliderChange() {
  diameter.value(dSlider.value())
}

function buttonPressed() {
  loop();
  isNoLoop = false;
  clear();
  createCanvas(900,600)
  background(15,0,146)
}

function sliderChange() {
  circleNum.value(numSlider.value());
}

function draw() {
  if (isNoLoop) {
    return;
  } else {
    noLoop();
    isNoLoop = true;
    for (let i = 0; i < circleNum.value(); i++) {
      circle(randomCoord(900), randomCoord(600), diameter.value());
    }
  }
}

// creates random coordinate
// input: x = coordinate to go to [0,x]
// returns random number between 0 and x inclusive
function randomCoord(x) {
  return Math.floor(Math.random() * x);
}
