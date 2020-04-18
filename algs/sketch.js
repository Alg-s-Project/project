let numSlider,
  circleNum,
  diameter,
  isNoLoop,
  dslider,
  endExists = false,
  moveToPositionX,
  moveToPositionY,
  character,
  columns = 600,
  rows = 400,
  grid = new Array(columns),
  closedSet = [],
  openSet = [],
  start,
  end,
  path = [],
  algorithmRunned = false,
  foundPath = false,
  circlesRendered = false,
  isTargetReady = false,
  isCharacterCreated = false;

class Circle {
  constructor(x, y, d) {
    this.x = x;
    this.y = y;
    this.distance = d;
    this.radius = d / 2;
    circle(x, y, d);
  }
}

class Spot {
  constructor(x, y) {
    this.i = x;
    this.j = y;

    // f, g values for A*
    this.f = 0;
    this.g = 0;
    this.h = 0;

    // Neighbors
    this.neighbors = [];

    // parent
    this.previous = undefined;

    // isobject?
    this.isObject = false;
  }

  show() {}

  // Figure out who my neighbors are
  addNeighbors(grid) {
    let i = this.i;
    let j = this.j;
    if (i < columns - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < columns - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < columns - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  }
}

// Function to delete element from the array
function removeFromArray(arr, elt) {
  // Could use indexOf here instead to be more efficient
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

// An educated guess of how far it is between two points
function heuristic(a, b) {
  // let d = dist(a.i, a.j, b.i, b.j);
  let d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

function createCharacter() {
  if (!isCharacterCreated) {
    console.log("pog");
    isCharacterCreated = true;
    let c = color(255, 69, 0);
    fill(c);
    // TODO: check for collision with object
    let x = floor(mouseX),
      y = floor(mouseY);
    circle(x, y, 7);
    console.log(`character created at: ${x},${y}`);
    start = grid[x][y];
    if (openSet.length == 0) {
      openSet.push(start);
    } else {
      openSet = [];
      openSet.push(start);
    }
  } else {
    moveToPositionX = floor(mouseX);
    moveToPositionY = floor(mouseY);
    c = color(218, 112, 214);
    fill(c);
    if (!endExists) {
      circle(moveToPositionX, moveToPositionY, 7);
      end = grid[moveToPositionX][moveToPositionY];
      isTargetReady = true;
      endExists = true;
    }
    console.log(
      `X to move to: ${moveToPositionX} \nY to move to: ${moveToPositionY}`
    );
    set();
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
  isCharacterCreated = false;
  circlesRendered = false;
  endExists = false;
  clear();
  // clears canvas to repopulate
  createCanvas(columns, rows);
  background(15, 0, 146);
}

function runAlg() {
  if (!circlesRendered || !isCharacterCreated || !endExists) {
    console.log("create character or circles first please or create end");
  } else {
    loop();
    isNoLoop = false;
  }
}

// Sets value of number of circles input box to its slider's value
function sliderChange() {
  circleNum.value(numSlider.value());
}

// finds all points within a circle and fills the objectGrid[i][j] = true if object exists there
// code taken from stackoverflow from Adam Stelmaszczyk
// https://stackoverflow.com/questions/15856411/finding-all-the-points-within-a-circle-in-2d-space
function fillGridWithObjects(grid, circle) {
  for (let x = circle.x - circle.radius; x <= circle.x; x++) {
    for (let y = circle.y - circle.radius; y <= circle.y; y++) {
      // we don't have to take the square root, it's slow
      if (
        (x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y) <=
        circle.radius * circle.radius
      ) {
        xSym = circle.x - (x - circle.x);
        ySym = circle.y - (y - circle.y);
        // (x, y), (x, ySym), (xSym , y), (xSym, ySym) are in the circle

        if (x > 0 && x < columns - 1) {
          if (y < rows - 1 && y > 0) {
            grid[x][y].isObject = true;
          }
          if (ySym < rows - 1 && ySym > 0) {
            grid[x][ySym].isObject = true;
          }
        }

        if (xSym > 0 && xSym < columns - 1) {
          if (y < rows - 1 && y > 0) {
            grid[xSym][y].isObject = true;
          }
          if (ySym < rows - 1 && ySym > 0) {
            grid[xSym][ySym].isObject = true;
          }
        }
      }
    }
  }
}

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
  dSlider = createSlider(10, 30, 20, 2);
  dSlider.addClass("slider");
  dSlider.input(dsliderChange);

  // create diameter input box
  diameter = createInput("20", "number");
  diameter.addClass("input");

  // create populate button
  let button = createButton("Populate");
  button.style("margin", "12px");
  button.mousePressed(buttonPressed);

  // create run a* button
  let aButton = createButton("Run A*");
  aButton.style("margin-bottom", "12px");
  aButton.mousePressed(runAlg);

  // put setup code here
  let cnv = createCanvas(columns, rows);
  background(15, 0, 146);

  let isCharacterCreated = false;
  cnv.mouseClicked(createCharacter);

  // make 2d array to hold info
  for (let i = 0; i < columns; i++) {
    grid[i] = new Array(rows);
  }

  // Create spots
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  // All the neighbors
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  console.log(grid);
}

function draw() {
  // if-else to check whether to run or not. uses the isNoLoop letiable to check whether draw should run.
  if (isNoLoop) {
    return;
  } else if (!circlesRendered) {
    noLoop();
    isNoLoop = true;
    circlesRendered = true;
    let c = color("white");
    fill(c);
    // Randomly populate canvas with circles depending on inputted values
    for (let i = 0; i < circleNum.value(); i++) {
      let temp = new Circle(
        floor(random(columns)),
        floor(random(rows)),
        diameter.value()
      );
      fillGridWithObjects(grid, temp);
    }
  } else if (!algorithmRunned) {
    noLoop();
    console.log("running algorithm...");
    while (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner]) {
          winner = i;
        }
      }

      let current = openSet[winner];

      // Did finish?
      if (current == end) {
        foundPath = true;
        console.log("done");
        break;
      }

      console.log(`current point: ${current.i},${current.j}`);
      // Best option moves from openSet to closedSet
      removeFromArray(openSet, current);
      closedSet.push(current);

      // Check all the neighbors
      let neighbors = current.neighbors;
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        // Valid next spot?
        if (!closedSet.includes(neighbor) && !neighbor.isObject) {
          let tempG = current.g + heuristic(neighbor, current);

          // Is this a better path than before?
          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }

          // Yes, it's a better path
          if (newPath) {
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }

      // Find the path by working backwards
      path = [];
      var temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
    }
    algorithmRunned = true;
    isNoLoop = false;
    isTargetReady = false;
    // Drawing path as continuous line
    noFill();
    stroke("orange");
    strokeWeight(1);
    beginShape();
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].i, path[i].j);
    }
    endShape();

    if (openSet.length <= 0 && !foundPath) {
      console.log("no solution :(");
    }
  }
}
