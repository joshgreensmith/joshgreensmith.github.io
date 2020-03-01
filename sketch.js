// http://scienceworld.wolfram.com/physics/DoublePendulum.html
// https://en.wikipedia.org/wiki/Double_pendulum
// http://www.physicsandbox.com/projects/double-pendulum.html

// NEED TO SYNCHRONISE THIS VERSION WITH WEB VERSION AND THEN WORK ON RADIANS IMPLEMENTATION

var maxPointsLength = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);

  l1Slider = createSlider(10, 200, 150, 0.1);
  l1Slider.position(20, 20);

  l2Slider = createSlider(10, 200, 100, 0.1);
  l2Slider.position(20, 40);

  m1Slider = createSlider(1, 25, 10, 0.1);
  m1Slider.position(20, 60);

  m2Slider = createSlider(1, 25, 10, 0.1);
  m2Slider.position(20, 80);

  // Bearing1Slider = createSlider(0, 360, 60, 0.1);
  Bearing1Slider = createSlider(0, 360, 300, 0.1);
  Bearing1Slider.position(20, 100);

  // Bearing2Slider = createSlider(0, 360, 146, 0.1);
  Bearing2Slider = createSlider(0, 360, 302, 0.1);
  Bearing2Slider.position(20, 120);

  timeSlider = createSlider(0.01, 1, 0.15, 0.001);
  timeSlider.position(20, 140);

  reset();
}

function reset() {
  // Initialise all values
  g = 9.81;
  l1 = l1Slider.value();
  l2 = l2Slider.value();
  m1 = m1Slider.value();
  m2 = m2Slider.value();
  time = timeSlider.value();
  Theta1 = Bearing1Slider.value() * (2 * PI / 360) - PI;
  Theta2 = Bearing2Slider.value() * (2 * PI / 360) - PI;

  dTheta1 = 0;
  dTheta2 = 0;
  d2Theta1 = 0;
  d2Theta2 = 0;

  paused = false;
  points = [];

  loopCounter = 0;
  looped = false;
  timeSteps = 0;
}

function keyPressed() {
  if (keyCode == 13) {
    reset();
  }
  if (keyCode == 32) {
    paused ^= true;
  }
}

function draw() {
  background(255);

  // Draw text for sliders
  strokeWeight(0.5);
  stroke(0);
  fill(0);
  text("L1 = " + l1Slider.value().toFixed(0), 160, 32);
  text("L2 = " + l2Slider.value().toFixed(0), 160, 52);
  text("M1 = " + m1Slider.value().toFixed(0), 160, 72);
  text("M2 = " + m2Slider.value().toFixed(0), 160, 92);
  text("Bearing1 = " + Bearing1Slider.value().toFixed(2), 160, 112);
  text("Bearing2 = " + Bearing2Slider.value().toFixed(2), 160, 132);
  text("Time = " + timeSlider.value().toFixed(3), 160, 152);
  text("Loop count = " + loopCounter, 300, 32);

  if (looped) {
    text("Time steps to loop = " + timeStepsToLoop, 300, 52);
    text("Time to loop = " + (timeStepsToLoop * time).toFixed(1), 300, 72);
  }

  if (!paused) {
    // Update angles of pendulums
    prevTheta2 = Theta2;
    mu = 1 + (m1 / m2);
    d2Theta1 = (g * (sin(Theta2) * cos(Theta1 - Theta2) - mu * sin(Theta1)) - (l2 * dTheta2 * dTheta2 + l1 * dTheta1 * dTheta1 * cos(Theta1 - Theta2)) * sin(Theta1 - Theta2)) / (l1 * (mu - cos(Theta1 - Theta2) * cos(Theta1 - Theta2)));
    d2Theta2 = (mu * g * (sin(Theta1) * cos(Theta1 - Theta2) - sin(Theta2)) + (mu * l1 * dTheta1 * dTheta1 + l2 * dTheta2 * dTheta2 * cos(Theta1 - Theta2)) * sin(Theta1 - Theta2)) / (l2 * (mu - cos(Theta1 - Theta2) * cos(Theta1 - Theta2)));
    dTheta1 += d2Theta1 * time;
    dTheta2 += d2Theta2 * time;
    Theta1 += dTheta1 * time;
    Theta2 += dTheta2 * time;

    // If line is longer than maxPointsLength, splice the first points vector in array
    if (points.length > maxPointsLength) {
      points.splice(0, 1);
    }
    // Push the current end point to the points array
    currentX = width / 2 - (l1 * sin(Theta1) + l2 * sin(Theta2));
    currentY = height / 2 + l1 * cos(Theta1) + l2 * cos(Theta2);
    points.push(createVector(currentX, currentY));

    // Test to see if bottom pendulum has looped
    prevRotatedPendulum2Bearing = (prevTheta2 * 360 / (2 * PI)) % 360;
    rotatedPendulum2Bearing = (Theta2 * 360 / (2 * PI)) % 360;

    // test to see if bearing crosses 180
    if (prevRotatedPendulum2Bearing < 180  && rotatedPendulum2Bearing > 180 && prevRotatedPendulum2Bearing > 100) {
      loopCounter++;
      if (!looped) {
        looped = true;
        timeStepsToLoop = timeSteps;
      }
    }

    if (prevRotatedPendulum2Bearing > -180  && rotatedPendulum2Bearing < -180 && prevRotatedPendulum2Bearing < -100) {
      loopCounter++;
      if (!looped) {
        looped = true;
        timeStepsToLoop = timeSteps;
      }
    }
  }


  // Draw coloured line
  strokeWeight(5);
  stroke(0, 255, 0, 100);
  noFill();
  beginShape()
  for (i in points) {
    vertex(points[i].x, points[i].y);
  }
  endShape();

  // Draw pendulum lines
  translate(width / 2, height / 2);
  stroke(0);
  rotate(Theta1);
  line(0, 0, 0, l1);
  translate(0, l1);
  rotate(Theta2 - Theta1);
  line(0, 0, 0, l2);
  strokeWeight(map(m1, 0, 10, 10, 25));
  point(0, 0);
  strokeWeight(map(m2, 0, 10, 10, 25));
  point(0, l2);

  timeSteps++;

}
