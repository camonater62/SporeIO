// hello there
// kaelen cook incorpoclated

class Entity {
    constructor(x, y, clr, rad, shape, speed) {
        this.pos = {x: x, y: y}             // where dudey is
        this.rad = rad;                     // dudey's size
        this.height = rad;                  // if height, height
        this.clr = clr;                     // dudey's color
        this.shape = shape;                 // dudey's body positivity

        // movement
        this.maxspeed = speed;              // lerp to speed, fade out stop.
        this.wantspeed = 0;                 // speed we want to be at
        this.speed = 0;                     // current speed lerp status
        this.dir = 0;                       // dudey's direction
        this.dest = {x: x, y: y}            // where dudey wants to go
    }
    draw() {
        noStroke();                         // we ain't acceptin' no lines in this here town
        fill(this.c);                       // we are acceptin' filler folk
        if (this.shape = 'circle') {                                                // if it's a circle, circle-make
            ellipse(this.pos.x, this.pos.y, this.rad, this.height);                 // defines circle with radius, you guessed it, radius
        }
        else if (this.shape = 'square') {
            rect(this.pox.x, this.pos.y, this.rad, this.height, this.rad/10);          // defines square with rounded edges
        }
    }
    update() {
        // ...
    }
}

class Building extends Entity {
    constructor(type, tier, owner, capacity) {
        super();
        this.tier = tier;                               // what level building is it? 1-3
        this.type = type;                               // what function does the building serve
        // types may include: home, factory, mine, construction
        this.owner = owner;                             // yeah this is a capitalism simulator, what of it?

        // worker/people data (some may be irrelevant):
        this.capacity = capacity;                       // number, how many people can be in building at once.
        this.workCap = capacity;                        // number, how many people can have jobs here.
        this.workers = [];                              // list of all workers of building.
        this.peeps = 0;                                 // amt of people currently in building.
        this.people = [];                               // list of people currently in building.
    }
    upgrade() {
        this.tier += 1;
        this.rad += (tier-1) * this.rad/3;              // basically, add a third of its size with every tier.
        // note: this increases quadratically; 1st time add 20, 2nd time add 40, 3rd time add 60, and so on so forth.
    }

    draw() {
        noStroke();                                             // if only I could've done this for grandpa
        fill(this.clr);                                         // this would've been a bit weird for grandpa
        circle(this.pos.x, this.pos.y, 2 * this.rad);           // oh yeah now grandpa would've loved circles
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
        newHome = Home;                 // pseudocode; set home to new home
        this.home = newHome;
    }

    moveJob() {                     // function for changing jobs
        newJob = Building;              // pseudocode; set job to new job
        this.job = newJob;
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

    update() {
        // this feels janky. its 1:24 am and I am satisfied with the jank. later me and cameron/nic (HI CAMERON/NIC! hows it going guys wow so great to meet you digitally through code for once) may not

        // uhh... all of this is to update the speed to simulate velocity
        if (this.speed < this.wantspeed) {                       // lerp speed
            if (this.wantspeed - this.speed <= 0.5) {            // if speed is almost where we want it,
                this.speed = this.wantspeed;                 // set it to proper speed
            }
            else {
                lerp(this.speed, this.wantspeed, 1);             // otherwise, increment speed
            }
        }
        else if (this.speed > this.wantspeed) {
            if (this.speed - this.wantspeed <= 0.5) {
                this.speed = this.wantspeed;
            }
            else {
                lerp(this.speed, this.wantspeed, 1);
            }
        }
    }
}

class Resource {
    constructor(type, tier) {
        super();
        this.type = type;                   // what resource; wood, minerals, etc.
        this.tier = tier;                   // what size deposit; tiny, small, medium, large, gargantuan
    }
    draw() {
        // display resource
        noStroke();
        fill(this.clr);
    }
    destroy() {
        // remove from entities, play explosion, drop chunks? (scope)
    }
}
function addResources(amt, x, width, y, height, tier) {

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