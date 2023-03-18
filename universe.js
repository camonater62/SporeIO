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
  constructor(w, h, screens=1) {
    this.w = w;
    this.h = h;

    this.grid = {};

    for (let y = floor(-screens / 2 * h); y < ceil(screens / 2 * h); y++) {
      this.grid[y] = {};
      for (let x = floor(-screens / 2 * w); x < ceil(screens / 2 * w); x++) {
        this.grid[y][x] = new StarSystem(x, y, true);
      }
    }

    console.log(this.grid);
  }

  draw() {
    let sectorsX = width / 16;
    let sectorsY = height / 16;
  
    let mouse = createVector(int(mouseX / 16), int(mouseY / 16));
    let galaxy_mouse = createVector(
      int(mouse.x + galaxyOffset.x),
      int(mouse.y + galaxyOffset.y)
    );
  
    let screen_sector = createVector(0, 0);
  
    for (screen_sector.y = 0; screen_sector.y < sectorsY; screen_sector.y++) {
      for (screen_sector.x = 0; screen_sector.x < sectorsX; screen_sector.x++) {
        let star = this.grid[screen_sector.y][screen_sector.x];
  
        if (star.starExists) {
          noStroke();
          fill(star.starColor);
          circle(
            screen_sector.x * 16 + 8,
            screen_sector.y * 16 + 8,
            star.starDiameter / 8
          );
  
          if (mouse.x == screen_sector.x && mouse.y == screen_sector.y) {
            stroke("orange");
            noFill();
            circle(
              screen_sector.x * 16 + 8,
              screen_sector.y * 16 + 8,
              star.starDiameter / 4
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

/**
 * @type {p5.Vector}
 */
let galaxyOffset;
/**
 * @type {p5.Vector}
 */
let starSelected;

let universe;

function setupUniverse() {
  galaxyOffset = createVector(0, 0);
  starSelected = undefined;
  universe = new Universe(width / 16, height / 16, 5);
}

function drawUniverse() {
  // let dt = deltaTime / 1000;
  // if (keyIsDown(UP_ARROW)) galaxyOffset.y -= 50 * dt;
  // if (keyIsDown(DOWN_ARROW)) galaxyOffset.y += 50 * dt;
  // if (keyIsDown(LEFT_ARROW)) galaxyOffset.x -= 50 * dt;
  // if (keyIsDown(RIGHT_ARROW)) galaxyOffset.x += 50 * dt;

  background(0);
  universe.draw();
  
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