let collided = false;

class Circle {
  constructor(pos, r, vel, c) {
    this.pos = pos;
    this.r = r;
    this.vel = vel;
    this.c = c;
  }

  draw() {
    noStroke();
    fill(this.c);
    circle(this.pos.x, this.pos.y, 2 * this.r);
  }

  move() {
    this.pos.add(this.vel);
    let n = noise(this.pos.x, this.pos.y, frameCount);
    n -= 0.5;
    n *= PI / 2;
    this.vel.rotate(n);
    if (this.pos.x < -20) this.pos.x = width + 20;
    if (this.pos.x > width + 20) this.pos.x = -20;
    if (this.pos.y < -20) this.pos.y = height + 20;
    if (this.pos.y > height + 20) this.pos.y = -20;
  }

  detectCollision() {
    for (let i = 0; i < circles.length; i++) {
      let circle2 = circles[i];
      if (circle2 != null && circle2 != this 
      && circle2.r < this.r && !colorEq(this.c, circle2.c)) {
        let d = this.pos.dist(circle2.pos);
        let radii = this.r + circle2.r;
        //merge the circles here
        if (d <= this.r) {
          
          circles.push(
            new Circle(
              this.pos,
              radii,
              this.vel,
              lerpColor(this.c, circle2.c, circle2.r / this.r)
            )
          );
          delete circles[i];
          delete circles[circles.indexOf(this)];
          return;
        }
      }
    }
  }
}

let circles = [];

function setupSpore() {
  circles.push(
    new Circle(
      createVector(random(width), random(height)),
      20,
      createVector(2, 2),
      color(0)
    )
  );
}

function drawSpore() {
  background(220);
  circles.forEach((c) => {
    c.move();
    c.detectCollision();
    c.draw();
  });
}

function mouseClickedSpore() {
  circles.push(
    new Circle(
      createVector(mouseX, mouseY),
      random(10, 20),
      createVector(random(width * 0.01), random(height * 0.01)),
      color(
        map(mouseX, 0, width, 0, 255),
        map(mouseY, 0, height, 0, 255),
        random(255)
      )
    )
  );
}

function colorEq(c1, c2) {
    for (let i = 0; i < 3; i++) {
        if (c1.levels[i] != c2.levels[i]) {
            return false;
        }
    }
    return true;
}