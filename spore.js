//Boids implementation from Daniel Shiffman
//https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN

let collided = false;
let alignNum, cohesionNum, separationNum;

class Circle {
  constructor(pos, r, vel, c) {
    this.pos = pos;
    this.r = r;
    this.vel = vel;
    this.c = c;
    this.maxSpeed = 5;
    this.vel.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;

    this.delete = false;
  }

  draw() {
    noStroke();
    fill(this.c);
    circle(this.pos.x, this.pos.y, 2 * this.r);
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

  detectCollision() {
    for (let i = 0; i < circles.length; i++) {
      let circle2 = circles[i];
      if (circle2 != null && circle2 != this
        && circle2.r < this.r && !colorEq(this.c, circle2.c)
        && this.r < 150 && !this.delete && !circle2.delete) {
        let d = this.pos.dist(circle2.pos);
        // let radii = this.r + circle2.r;
        //merge the circles here
        if (d <= this.r) {

          circles.push(
            new Circle(
              this.pos,
              this.r + Math.sqrt(circle2.r),
              this.vel,
              lerpColor(this.c, circle2.c, circle2.r / this.r)
            )
          );
          this.delete = true;
          circle2.delete = true;
          return;
        }
      }
    }
  }

  explode() {
    for (let i = 0; i < 5; i++) {
      circles.push(
        new Circle(
          createVector(
            this.pos.x + random(-this.r / 10 * 2, this.r / 10 * 2), 
            this.pos.y + random(-this.r / 10 * 2, this.r / 10 * 2)
          ), 
          this.r / 10 + random(-5, 5), 
          createVector(
            random(width * 0.01), 
            random(height * 0.01)
          ), 
          this.c
        )
      );
    }
    this.delete = true;
  }

  align() {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for(let circle2 of circles) {
      let d = this.pos.dist(circle2.pos);
      if(circle2 != this && d < perceptionRadius && d != 0) {
          steering.add(circle2.velocity);
          total++;
        }
      }
      if(total > 0) {
        steering = this.updateSteering(steering, total);
      }
      return steering;
    }

    separation() {
      let perceptionRadius = 24;
      let steering = createVector();
      let total = 0;
      for(let circle2 of circles) {
        let d = this.pos.dist(circle2.pos);
        if (circle2 != this && d < perceptionRadius && d != 0) {
          let diff = p5.Vector.sub(this.pos, circle2.pos);
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
      }
      if(total > 0) {
        steering = this.updateSteering(steering, total);
      }
      return steering;
    }

    cohesion() {
      let perceptionRadius = 50;
      let steering = createVector();
      let total = 0;
      for(let circle2 of circles) {
        let d = this.pos.dist(circle2.pos);
        if (circle2 != this && d < perceptionRadius && d != 0) {
          steering.add(circle2.pos);
          total++;
        }
      }
      if(total > 0) {
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
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
      return steering;
    }
  }

let circles = [];

function setupSpore() {
  circles.push(
    new Circle(
      createVector(random(width), random(height)),
      20,
      createVector(random(-2, 2), random(-2, 2)),
      color(0)
    )
  );
  alignNum = random(2);
  cohesionNum = random(2);
  separationNum = random(2);
}

function drawSpore() {
  if(frameCount % 6000 == 0 ) {
    alignNum = random(2);
    cohesionNum = random(2);
    separationNum = random(2);
  }
  background(220);
  circles.forEach((c) => {
    if (c != null && !c.delete) {
      c.move();
      c.detectCollision();
      c.draw();
      c.flock();
      if (c.r >= 100) {
        c.explode();
      }
    }
  });
  circles = circles.filter((c) => { return !c.delete; });
}

function mouseClickedSpore() {
  circles.push(
    new Circle(
      createVector(mouseX, mouseY),
      random(10, 20),
      createVector(random(-width * 0.01, width * 0.01), random(-height * 0.01, height * 0.01)),
      color(
        map(mouseX, 0, width, 0, 255),
        map(mouseY, 0, height, 0, 255),
        random(255)
      )
    )
  );
}

function mouseDragged() {
  if (random() < 0.2) {
    mouseClickedSpore();
  }
}

function colorEq(c1, c2) {
  for (let i = 0; i < 3; i++) {
    if (c1.levels[i] != c2.levels[i]) {
      return false;
    }
  }
  return true;
}