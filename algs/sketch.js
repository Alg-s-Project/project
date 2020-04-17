let numSlider,
  circleNum,
  diameter,
  isNoLoop,
  dslider,
  moveToPositionX,
  moveToPositionY;

let isCharacterCreated = false;
function setup() {
  noLoop();
  isNoLoop = true;
  // create sliders
  numSlider = createSlider(0, 1000, 100);
  numSlider.addClass("slider");

  // create input
  circleNum = createInput(numSlider.value().toString(), "number");
  circleNum.addClass("input");

  // change value of # of circles input to slider value
  numSlider.input(sliderChange);

  // create diameter slider
  dSlider = createSlider(10, 30, 20);
  dSlider.addClass("slider");
  dSlider.input(dsliderChange);

  // create diameter input box
  diameter = createInput("20", "number");
  diameter.addClass("input");

  // create populate button
  let button = createButton("Populate");
  button.style("margin", "12px");
  button.mousePressed(buttonPressed);

  // put setup code here
  let cnv = createCanvas(900, 600);
  background(15, 0, 146);

  let isCharacterCreated = false;
  cnv.mouseClicked(createCharacter);
}

function createCharacter() {
  if (!isCharacterCreated) {
    console.log("pog");
    isCharacterCreated = true;
    let c = color(255, 69, 0);
    fill(c);
    circle(mouseX, mouseY, 20);
  }
}

function dsliderChange() {
  diameter.value(dSlider.value());
}

// Clears canvas and repopulates with circles with input values from above
function buttonPressed() {
  // loop() runs the draw function once
  loop();
  // boolean to hold value of whether loop has been called. Used so that draw is only run once button pressed and not at page load
  isNoLoop = false;
  clear();
  // clears canvas to repopulate
  createCanvas(900, 600);
  background(15, 0, 146);
}

// Sets value of number of circles input box to its slider's value
function sliderChange() {
  circleNum.value(numSlider.value());
}

function draw() {
  // if-else to check whether to run or not. uses the isNoLoop variable to check whether draw should run.
  if (isNoLoop) {
    return;
  } else {
    noLoop();
    isNoLoop = true;
    // Randomly populate canvas with circles depending on inputted values
    for (let i = 0; i < circleNum.value(); i++) {
      circle(random(0, 900), random(0, 600), diameter.value());
    }
  }
}
