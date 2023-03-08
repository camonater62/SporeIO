// hello there
// kaelen cook incorpoclated

class Entity {
    constructor(x, y, clr, rad, shape, speed) {
        this.pos = {x: x, y: y}             // where dudey is
        this.rad = rad;                     // dudey's size
        this.clr = clr;                     // dudey's color
        this.shape = shape;                 // dudey's body positivity

        // movement
        this.speed = speed;                 // lerp to speed, fade out stop.
        this.dir = 0;                       // dudey's direction
        this.dest = {x: x, y: y}            // where dudey wants to go
    }
    draw() {
        noStroke();                         // we ain't acceptin' no lines in this here town
        fill(this.c);                       // we are acceptin' filler folk
        if (this.shape = 'circle') {                                                // if it's a circle, circle-make
            ellipse(this.pos.x, this.pos.y, this.rad);                              // defines circle with radius, you guessed it, radius
        }
        else if (this.shape = 'square') {
            rect(this.pox.x, this.pos.y, this.rad, this.rad, this.rad/10);          // defines square with rounded edges
        }
    }
}

class Building extends Entity {
    constructor(type, tier, owner) {
        super();
        this.tier = tier;                               // what level building is it? 1-3
        this.type = type;                               // what function does the building serve
        // types may include: home, factory, mine, construction
        this.owner = owner;                             // yeah this is a capitalism simulator, what of it?
        this.rad += (tier-1) * this.rad/3;              // basically, add a third of its size with every tier.
    }
    draw() {
        noStroke();                                     // if only I could've done this for grandpa
        fill(this.c);                                   // this would've been a bit weird for grandpa
        circle(this.pos.x, this.pos.y, 2 * this.r);     // oh yeah now grandpa would've loved circles
      }
}

class Home extends Building {
    constructor(pops, beds) {
        super();
        this.residents = [];                    // how many people are in this house
        pops.forEach((p) => {
            this.residents.push(p);
        })
        this.maxbeds = beds;                    // how many people can this house hold
        this.full = false;                      // bool if at enough people
    }

    addDude() {
        this.residents += Dude;
    }
}

class Dude extends Entity {    // Dude, The
    constructor(home, job) {
        super();
        this.home = home;           // what building was dude born in
        this.job = job;             // where does dude spend his life

        // families? lineages? clans?

        this.inventory = {minerals: 0, wood: 0, love: 0};      // what can dude carry (you even lift brah)
    }

    moveHome() {                    // function for changing homes
        newHome = Home;         // pseudocode; set home to new home
        this.home = newHome;
    }

    moveJob() {
        newJob = Building;
    }

    commute() {
        // find path to destination
        // ...
        this.direction = this.job.x
        // go to destination

    }

    work() {
        // gather resources
    }

    goHome() {
        // go home, deposit resources, do again
    }
    draw() {
        // display dude at position
    }
}

class Resource {
    constructor(x, y, type, amt) {
        // 
    }
    draw() {
        // display resource
    }
    destroy() {
        // remove from entities, play explosion, drop chunks? (scope)
    }
}

entities = [];

function setupCity() {
    // place primary base, generate resources/foliage, 
}

function drawCity() {
    background(540);
    entities.forEach((e) => {
        e.draw();
    })
    console.log("city");
}

function mouseClickedCity() {
    // transition to new city for now
}