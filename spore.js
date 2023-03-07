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
    circle(this.pos.x, this.pos.y, this.r);
  }

  move() {
    this.pos.add(this.vel);
    this.vel.rotate(
      noise((this.pos.x / 100 ), (this.pos.y / 100) - 0.5));
    if (this.pos.x < -20) this.pos.x = width + 20;
    if (this.pos.x > width + 20) this.pos.x = -20;
    if (this.pos.y < -20) this.pos.y = height + 20;
    if (this.pos.y > height + 20) this.pos.y = -20;
  }

  detectCollision() {
    for (let i = 0; i < circles.length; i++) {
      let circle2 = circles[i];
      if (circle2 != null) {
        let d = dist(this.pos.x, this.pos.y, circle2.pos.x, circle2.pos.y);
        let radii = this.r + circle2.r;
        //merge the circles here
        if (abs(d * d) < radii * radii && d !== 0) {
          delete circles[i];
          delete circles[circles.indexOf(this)];
          circles.push(
            new Circle(
              this.pos,
              radii,
              this.vel,
              color(
                red(this.c) + red(circle2.c) / 2,
                green(this.c) + green(circle2.c) / 2,
                blue(this.c) + blue(circle2.c) / 2
              )
            )
          );
          return;
        }
      }
    }
  }
}

let circles = [];

function setupSpore() {
  createCanvas(400, 400);
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
  circles.forEach((c) => {
    c.draw();
    c.move();
    c.detectCollision();
  });
}

function mouseClicked() {
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
