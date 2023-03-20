const starColors = [
  "#FFFFFF",
  "#FFFFD9",
  "#FFFFA3",
  "#C8C8FF",
  "#9DCBFF",
  "#FF9F9F",
  "#FF5E41",
  "#9D1928",
];

class StarSystem {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Boolean} generateFullSystem
   * @returns
   */
  constructor(x, y, generateFullSystem = false) {
    this.Lehmer = ((x & 0xffff) << 16) | (y & 0xffff);

    this.starExists = this.rndInt(0, 200) == 1;
    if (!this.starExists) return;

    this.starDiameter = this.rndDouble(40, 150);
    this.starColor = color(starColors[this.rndInt(0, starColors.length)]);

    if (!generateFullSystem) return;

    let distanceFromStar = this.rndDouble(60, 200);
    let numPlanets = this.rndInt(0, 10);
    this.planets = [];
    for (let i = 0; i < numPlanets; i++) {
      let p = new Planet();
      p.distance = distanceFromStar;
      distanceFromStar += this.rndDouble(50, 200);
      p.diameter = this.rndDouble(4, 20);
      p.temperature = this.rndDouble(-200, 300);

      p.foliage = this.rndDouble(0, 1);
      p.minerals = this.rndDouble(0, 1);
      p.gases = this.rndDouble(0, 1);
      p.water = this.rndDouble(0, 1);

      // Normalize
      let sum = 1 / (p.foliage + p.minerals + p.gases + p.water);
      p.foliage *= sum;
      p.minerals *= sum;
      p.gases *= sum;
      p.water *= sum;

      p.population = max(this.rndInt(-50000000, 20000000), 0); // 1/5 chance for no pop

      p.ring = this.rndInt(0, 10) == 1;

      let numMoons = max(this.rndInt(-5, 5), 0);
      for (let n = 0; n < numMoons; n++) {
        p.moons.push(this.rndDouble(1, 5));
      }

      this.planets.push(p);
    }
  }

  Lehmer32() {
    let Lehmer = this.Lehmer;
    if (typeof Lehmer !== "bigint") {
      Lehmer = BigInt(Lehmer);
    }
    Lehmer += 0xe120fc15n;
    let tmp = Lehmer * 0x4a39b70dn;
    let m1 = (tmp >> 32n) ^ tmp;
    tmp = m1 * 0x12fad5c9n;
    let m2 = (tmp >> 32n) ^ tmp;
    this.Lehmer = Lehmer;
    return m2;
  }

  /**
   *
   * @param {Number} min
   * @param {Number} max
   * @returns Number
   */
  rndInt(min, max) {
    return Number(this.Lehmer32() % BigInt(max - min)) + min;
  }

  /**
   *
   * @param {Number} min
   * @param {Number} max
   * @returns Number
   */
  rndDouble(min, max) {
    let acc = 1000000;
    let double = Number(this.Lehmer32() % BigInt(acc)) / acc;
    return double * (max - min) + min;
  }
}

class Universe {
  /**
   *
   * @param {Number} w
   * @param {Number} h
   * @param {Number} screens
   */
  constructor(w, h, screens = 1) {
    this.w = w;
    this.h = h;

    this.minx = floor((-screens / 2) * w);
    this.maxx = ceil((screens / 2) * w);

    this.miny = floor((-screens / 2) * h);
    this.maxy = ceil((screens / 2) * h);

    this.topleft = createVector(0, 0);
    this.scale = 16;

    /**
     * @type {StarSystem[][]}
     */
    this.grid = {};

    for (let y = this.miny; y <= this.maxy; y++) {
      this.grid[y] = {};
      for (let x = this.minx; x < this.maxx; x++) {
        this.grid[y][x] = new StarSystem(x, y, true);
      }
    }

    // console.log(this.grid);
  }

  draw() {
    console.log(this.scale);
    let dt = deltaTime / 1000;
    if (keyIsDown(UP_ARROW)) this.topleft.y -= 50 * dt;
    if (keyIsDown(DOWN_ARROW)) this.topleft.y += 50 * dt;
    if (keyIsDown(LEFT_ARROW)) this.topleft.x -= 50 * dt;
    if (keyIsDown(RIGHT_ARROW)) this.topleft.x += 50 * dt;

    this.scale = 16 * max(1, -mousePos/250);

    let sectorsX = width / this.scale;
    let sectorsY = height / this.scale;

    this.topleft.y = max(this.miny, this.topleft.y);
    this.topleft.x = max(this.minx, this.topleft.x);

    this.topleft.y = min(this.maxy - sectorsY, this.topleft.y);
    this.topleft.x = min(this.maxx - sectorsX, this.topleft.x);

    let mouse = createVector(
      int(mouseX / this.scale),
      int(mouseY / this.scale)
    );
    let galaxy_mouse = createVector(
      int(mouse.x + this.topleft.x),
      int(mouse.y + this.topleft.y)
    );

    let screen_sector = createVector(0, 0);

    for (
      screen_sector.y = floor(this.topleft.y);
      screen_sector.y < ceil(this.topleft.y + sectorsY);
      screen_sector.y++
    ) {
      for (
        screen_sector.x = floor(this.topleft.x);
        screen_sector.x < ceil(this.topleft.x + sectorsX);
        screen_sector.x++
      ) {
        let star = this.grid[screen_sector.y][screen_sector.x];

        if (star.starExists) {
          noStroke();
          fill(star.starColor);
          circle(
            screen_sector.x * this.scale +
              this.scale / 2 -
              this.topleft.x * this.scale,
            screen_sector.y * this.scale +
              this.scale / 2 -
              this.topleft.y * this.scale,
            (star.starDiameter / 128) * this.scale
          );

          if (
            galaxy_mouse.x == screen_sector.x &&
            galaxy_mouse.y == screen_sector.y
          ) {
            stroke("orange");
            noFill();
            circle(
              screen_sector.x * this.scale + this.scale / 2 - this.topleft.x * this.scale,
              screen_sector.y * this.scale + this.scale / 2 - this.topleft.y * this.scale,
              this.scale * star.starDiameter / 64
            );
          }
        }
      }
    }

    if (mouseIsPressed) {
      let star = this.grid[galaxy_mouse.y][galaxy_mouse.x];

      if (star.starExists) {
        starSelected = galaxy_mouse;
      } else {
        starSelected = undefined;
      }
    }

    if (starSelected != undefined) {
      let star = this.grid[starSelected.y][starSelected.x];
      drawWindow(star);
    }
  }

  randomSystem() {
    while (this.grid && this.grid[0]) {
      let y = int(random(this.h));
      let x = int(random(this.w));

      if (this.grid[y][x].starExists) {
        return createVector(x, y);
      }
    }
  }
}

class Planet {
  constructor() {
    this.distance = 0;
    this.diameter = 0;
    this.foliage = 0;
    this.minerals = 0;
    this.water = 0;
    this.gases = 0;
    this.temperature = 0;
    this.population = 0;
    this.ring = false;
    this.moons = [];
  }
}

class Ship {
  constructor(pos, r, vel, c) {
    this.pos = pos;
    this.r = r;
    this.vel = vel;
    this.c = c;
    this.maxSpeed = 5;
    this.vel.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.target = null;
  }

  draw() {
    noStroke();
    fill(this.c);
    let normvel = p5.Vector.normalize(this.vel);
    let p1 = p5.Vector.mult(normvel, this.r);
    let p2 = createVector(-p1.y / 2, p1.x / 2);
    let p3 = createVector(p1.y / 2, -p1.x / 2);
    triangle(p1.x + this.pos.x, p1.y + this.pos.y, 
             p2.x + this.pos.x, p2.y + this.pos.y, 
             p3.x + this.pos.x, p3.y + this.pos.y);
  }

  move() {
    this.pos.add(this.vel);
    this.vel.add(this.acceleration);
    this.vel.limit(this.maxSpeed);
    this.acceleration.mult(0);
    if (this.pos.x < -this.r * 2) this.pos.x = width + 20;
    if (this.pos.x > width + this.r * 2) this.pos.x = -20;
    if (this.pos.y < -this.r * 2) this.pos.y = height + 20;
    if (this.pos.y > height + this.r * 2) this.pos.y = -20;
  }

  align() {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of ships) {
      let d = this.pos.dist(other.pos);
      if (other != this && d < perceptionRadius && d != 0) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering = this.updateSteering(steering, total);
    }
    return steering;
  }

  separation() {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of ships) {
      let d = this.pos.dist(other.pos);
      if (other != this && d < perceptionRadius && d != 0) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering = this.updateSteering(steering, total);
    }
    return steering;
  }

  cohesion() {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of ships) {
      let d = this.pos.dist(other.pos);
      if (other != this && d < perceptionRadius && d != 0) {
        steering.add(other.pos);
        total++;
      }
    }
    if (total > 0) {
      steering = this.updateSteering(steering, total);
    }
    return steering;
  }

  flock() {
    let alignment = this.align();
    let cohesion = this.cohesion();
    let separation = this.separation();

    alignment.mult(alignNum);
    cohesion.mult(cohesionNum);
    separation.mult(separationNum);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  updateSteering(steering, total) {
    let targetVec = p5.Vector.sub(this.target, this.pos);
    targetVec.normalize();
    steering.lerp(targetVec, 0.9);
    steering.setMag(this.maxSpeed);
    steering.sub(this.velocity);
    steering.limit(this.maxForce);
    return steering;
  }

  chooseTarget() {
    if (this.target == null || p5.Vector.sub(this.target, this.pos).mag() < 1) {
      this.target = universe.randomSystem()
    }
  }
}

/**
 * @type {p5.Vector}
 */
let galaxyOffset;
/**
 * @type {p5.Vector}
 */
let starSelected;

let universe;

/**
 * @type {Ship[]}
 */
let ships = [];

function setupUniverse() {
  galaxyOffset = createVector(0, 0);
  starSelected = undefined;
  universe = new Universe(width / 16, height / 16, 5);

  for (let i = 0; i < 15; i++) {
    ships.push(new Ship(
      createVector(
        random(0, width),
        random(0, height),
      ),
      random(5, 15),
      createVector(
        random(-5, 5),
        random(-5, 5)
      ),
      color(
        random(256),
        random(256),
        random(256)
      )
    ));
  }
}

function drawUniverse() {
  background(0);
  universe.draw();
  ships.forEach((s) => {
    if (s != null) {
      s.chooseTarget();
      s.move();
      s.draw();
      s.flock();
    }
  });
}

/**
 *
 * @param {StarSystem} star
 */
function drawWindow(star) {
  // Draw window
  noStroke();
  fill("darkblue");
  let h = height / 3;
  rect(8, height - h + 8, width - 16, h - 16);
  noFill();
  stroke("white");
  rect(8, height - h + 8, width - 16, h - 16);

  // Draw star
  let body = createVector(14, height - 8 - h / 2);
  let step = star.starDiameter * (h / 200);
  body.x += step / 2;
  noStroke();
  fill(star.starColor);
  circle(body.x, body.y, step);
  body.x += step / 2 + 8;

  for (let planet of star.planets) {
    if (body.x + planet.diameter >= width) break;
    let pstep = planet.diameter * (h / 200);
    body.x += 2.5 * pstep;
    noStroke();
    fill("red");
    circle(body.x, body.y, pstep);

    let moon = createVector(body.x, body.y);
    moon.y += pstep + 10;

    for (let m of planet.moons) {
      moon.y += m;
      noStroke();
      fill("grey");
      circle(moon.x, moon.y, 2 * m);
      moon.y += m + 10;
    }
  }
}
