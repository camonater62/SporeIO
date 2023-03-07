// hello there
// kaelen cook incorpoclated

class Building {
    constructor(x, y, c, type, tier) {
        this.pos = {x: x, y: y};
        this.r = tier*25;
        this.c = c;
        // if (type = "house") {
        //     this.shape = rect;
        // }
    }
    draw() {
        noStroke();
        fill(this.c);
        circle(this.pos.x, this.pos.y, 2 * this.r);
      }
}

class Dude {
    constructor(x, y, r, home, job, speed, c) {
        this.pos = {x: x, y: y};
        this.r = r; 
        this.home = home;
        this.job = job;
        this.speed = speed;
        this.c = c;

        this.payload = 0;
        this.direction;
    }

    commute() {
        // find path to destination
        // ...
        this.direction = this.job.x
        // go to destination

    }

    doJob() {
        // gather resources
    }

    goHome() {
        // go home, deposit resources, do again
    }
}

class Resource {
    constructor(x, y, type, amt) {
        // 
    }
}