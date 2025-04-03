// "HIDDEN"
// 2025.Jan.8th
// Author: Yuqin Jing
//Instructions:
//“俠隱HIDDEN” is an interactive digital art project that explores the relationship between action and time, inspired and stylized by the philosophical concept of “Taoism and Nature” that frequently referenced in Chinese martial arts literature.

// The project simulates a dynamic visual of a “wind” or “airflow” in ink-wash style by creating a particle class function. Users are also given the ability to interact by using their mouse as a "blade", guiding them to try slicing through the "airflow" and make it disappear. However, when the users realize that while their actions can only influence the "airflow," instead of completely vanishing it, the hidden rules of this project will be revealed.

// "Drawing a blade to cut water only makes it flow more swiftly" is an ancient Chinese proverb. In this project, the real and only way to make the “airflow” vanish is to stop the interaction. By "taking non-action" and allowing time to flow naturally, the "airflow" will eventually disappear. The project hopes to illustrate this underlying philosophy through the conflict between user interaction and the natural force of time.

let diameter;

let startScreen = true;

// For function drawBGlines
let linesNum = 30;
let motion = 0;

// For airflow particles
let winds = [];
let center;

// For timer
let mousePressTime;
let fadeTime = 60000;

function preload() {
  startBG = loadImage("TITLE.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  diameter = width / 6;

  background(240);

  // Pre-set a magnetic point in center for ink airflows particles.
  center = createVector(width / 2, height / 2);
  // Ink airflows particles number set up, and go into the screen from above.
  for (let windNum = 0; windNum < 500; windNum = windNum + 1) {
    winds.push(new Wind(center.x, center.y - height));
  }

  // Timer pre-set
  mousePressTime = millis();
}

function draw() {
  // Make a start screen
  if (startScreen) {
    background(255);

    // Start screen background image resize and centralize
    let imgWidth = startBG.width / 3;
    let imgHeight = startBG.height / 3;
    image(
      startBG,
      width / 2 - imgWidth / 2,
      height / 2 - imgHeight / 2,
      imgWidth,
      imgHeight
    );

    // Start screen introdunction text
    fill(0, 99);
    noStroke();
    textSize(10);
    textFont("Helvetica");
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("Consider the mouse as a blade.", width / 2, height / 2 + height / 5);
    text(
      "By clicking and dragging the mouse to slice the ink airflows until they vanished.",
      width / 2,
      height / 2 + height / 4.6
    );
    text("Press F : Fullscreen", width / 2, height / 2 + height / 3);
    text("Press S : Start", width / 2, height / 2 + height / 2.8);
  } else {
    // Start the main animation
    background(255, 3);

    // Opening scene.
    noFill();
    strokeWeight(2);
    motion = motion + 0.01;
    drawBGLines();

    // Ink airflow particles.
    for (let wind of winds) {
      wind.update();
      wind.display();
    }

    // Timer reset if mouseIsPressed.
    if (mouseIsPressed) {
      mousePressTime = millis();
    }

    // Ink airflow particles fade out timer.
    if (millis() - mousePressTime > fadeTime) {
      winds = [];
    }
  }
}

// Ink airflows particles class.
class Wind {
  // initial property of particles.
  constructor(x, y) {
    // Beginning point.
    this.pos = createVector(x, y);
    // Random initial velocity.
    this.vel = p5.Vector.random2D().mult(random(1, 5));
    // Initial acceleration.
    this.acc = createVector(0, 0);
    // Particles' trail class
    this.trail = [];
    // Particles' trail length.
    this.maxTrail = 4;
    // Maximum range of particles' motion
    this.maxRange = width / 2;
  }

  
  update() {
    // Set the magnetic point of particles to the center of the screen.
    let toCenter = p5.Vector.sub(center, this.pos);
    let distToCenter = toCenter.mag();
    if (distToCenter > this.maxRange) {
      // Strong mag if too far.
      toCenter.setMag(0.1 * distToCenter);
    } else {
      // Gentle mag while normal time.
      toCenter.setMag(0.006 * distToCenter);
    }
    this.acc.add(toCenter);

    // Add noise effect to particles.
    let noiseLevel = noise(
      this.pos.x * 0.002,
      this.pos.y * 0.002,
      frameCount * 0.01
    );
    let angle = noiseLevel * TWO_PI * 3;
    // Particles will move in neatly direction with bigger num.
    let force = p5.Vector.fromAngle(angle).mult(1.2);
    this.acc.add(force);
    // A little bit of random noise for each single particle to create some run-out-of-ink effects.
    let randomForce = p5.Vector.random2D().mult(0.4);
    this.acc.add(randomForce);

    // Speed, length and direction limitations and corrections.
    this.vel.add(this.acc);
    this.vel.limit(3);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    // Mouse interaction function.
    if (mouseIsPressed) {
      let blade = createVector(mouseX, mouseY);
      let bladeDis = dist(this.pos.x, this.pos.y, blade.x, blade.y);
      // Sharper gap with smaller num.
      if (bladeDis < height / 7) {
        let flee = p5.Vector.sub(this.pos, blade).normalize().mult(5);
        this.acc.add(flee);
      }
    }
  }

  display() {
    // Particles visaul setup.
    let windColor = random(0, 10);
    let windAlpha = random(90, 100);
    stroke(windColor, windAlpha);
    strokeWeight(random(1, 10));
    noFill();

    beginShape();
    for (let t of this.trail) {
      curveVertex(t.x, t.y);
    }
    endShape();
  }
}

// Background lines function setup.
function drawBGLines(bgX, bgY) {
  for (let c = 0; c < linesNum; c++) {
    let color = map(c, 0, linesNum, 0, 50);
    stroke(color);

    beginShape();
    for (let x = -100; x < width + 200; x = x + 100) {
      let n = noise(x * 0.01 + motion, c * 0.001 + motion);
      let y = map(n, 0, 1, -height / 2, height / 2);
      curveVertex(x, y + motion * 200);
    }
    endShape();
  }
}

// Fullscreen adapter setup.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  diameter = width / 6;

  center = createVector(width / 2, height / 2);
}

// Fullscreen function setup.
function keyPressed() {
  if (key == "f" || key == "F") {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  if (key == "s" || key == "S") {
    startScreen = false;
    
    // Reset timer and particles to avoid the situation that user spend more than 1 mins on the start screen.
    mousePressTime = millis();
    winds = []; 
    for (let windNum = 0; windNum < 500; windNum++) {
      winds.push(new Wind(center.x, center.y - height)); 
    }
  }
}

// Timer reset function.
function mousePressed() {
  mousePressTime = millis();
}
