// hello there
// kaelen cook incorpoclated

buildings = [];
dudes = [];
resources = [];
mouseHovering = false;

city = {
    wood: 0,
    minerals: 0,
}
class Entity {
    constructor(x = random(width), y = random(height), clr = color(0, 0, 0), rad = 50, shape = 'square', speed = 0) {
        this.pos = createVector(x, y);             // where dudey is
        this.rad = rad;                     // dudey's size
        this.height = rad;                  // if height, height
        this.clr = clr;                     // dudey's color
        this.shape = shape;                 // dudey's body positivity
        this.area;                          // dudey's area shame

        // movement
        this.maxspeed = speed;              // lerp to speed, fade out stop.
        this.wantspeed = this.maxspeed;                 // speed we want to be at
        this.speed = 0;                     // current speed lerp status
        this.dir = random(2 * PI);                       // dudey's direction
        this.dest = createVector(x, y);     // destination
    }
    draw() {
        noStroke();                         // we ain't acceptin' no lines in this here town
        fill(this.clr);                       // we are acceptin' filler folk
        if (this.shape == 'circle') {                                                // if it's a circle, circle-make
            ellipse(this.pos.x, this.pos.y, this.rad, this.height);                 // defines circle with radius, you guessed it, radius
        }
        else if (this.shape == 'square') {
            rect(this.pos.x, this.pos.y, this.rad, this.height, this.rad / 10);          // defines square with rounded edges
        }
    }
    update() {
        // ...
    }
}

class Building extends Entity {
    constructor(type, tier, owner) {
        super();
        this.tier = tier;                               // what level building is it? 1-3
        this.type = type;                               // what function does the building serve
        // types may include: home, factory, mine, construction
        this.owner = owner;                             // yeah this is a capitalism simulator, what of it?

        this.resources = {                              // how many resources are stored in the building
            wood: 0,
            minerals: 0,
            max: 1500,      // max amount of resources

            toComplete: {
                wood: 150,
                minerals: 150,
            }
        }

        this.baseclr = this.clr;
        this.completion = 0;      // when at 100, fill.
        this.complete = false;      // determines if a building or being constructed

        // worker/people data (some may be irrelevant):
        this.capacity = 5;                       // number, how many people can be in building at once.
        this.workers = [];                              // list of all workers of building.
        buildings.push(this);

        this.timer = 0;
        this.countdown = random(2800, 5600);    // time to add a new dude
    }

    contains(pointX, pointY) {
        // Check if the given point is inside the circle
        let distanceSq = (pointX - this.x) ** 2 + (pointY - this.y) ** 2;
        let radiusSq = this.radius ** 2;
        return distanceSq <= radiusSq;
    }

    upgrade() {
        this.tier += 1;
        this.rad += (tier - 1) * this.rad / 3;              // basically, add a third of its size with every tier.
        // note: this increases quadratically; 1st time add 20, 2nd time add 40, 3rd time add 60, and so on so forth.
    }

    draw() {
        if (!this.complete) {
            stroke(50, 50, 125);
            strokeWeight(1.5);
            fill(0, 0, 0, 0);    
        }
        else if (this.complete) {
            stroke(50, 50, 125);
            fill(75, 75, 150);    
        }
        circle(this.pos.x, this.pos.y, this.rad);           // oh yeah now grandpa would've loved circles
    }

    update() {
        if (this.contains(mouseX, mouseY)) {
            console.log("w9ewroworower");
            this.clr = color(25, 250, 75, 150);
        }
        else {
            this.clr = this.baseclr;
        }
        if (this.completion >= 100) {
            this.complete = true;
        }
        else {
            this.complete = false;
        }
        this.timer += deltaTime;
        if (this.timer > this.countdown) {
            if (!this.complete && this.workers.length < this.capacity) {
                console.log("hey you there");
                conscriptDudes(this.capacity - this.workers.length, this);
                this.timer = 0;
            }
        }

    }
}

class Home extends Building {
    constructor(pops, beds) {
        super();
        this.residents = [];                    // how many people are in this house
        // pops.forEach((p) => {
        //     this.residents.push(p);
        // })
        this.maxbeds = beds;                    // how many people can this house hold
        this.full = false;                      // bool if at enough people
    }

    isFilled() {
        if (this.residents.length >= this.maxbeds) {
            return true;
        }
        return false;
    }

    addDude() {
        let dude = new Dude(this, null);
        dude.clr = color(random(25, 255), random(25, 255), random(25, 255));
        this.residents.push(dude);
        dudes.push(dude);
    }

    update() {
        super.update();
        console.log("suup");
        this.timer += deltaTime;
        if (this.timer > this.countdown) {
            if (!this.isFilled() && this.complete) {
                this.addDude();
            }
        }
    }
}

class Dude extends Entity {    // Dude, The
    constructor(home, job) {            // home and job are classes to be taken; class Home and class Resource/Building
        super(home.pos.x, home.pos.y, color(0, 0, 200), 20, 'circle', 100);
        this.home = home;           // what building was dude born in
        this.job = job;             // where does dude spend his life
        this.jobs = [];
        this.resource = false;
        this.speed = 900;

        this.load = {
            wood: 0,
            minerals: 0,
            max: 100,
            gatherAmt: 15,
            type: ('wood', 'minerals'),
        }

        this.restTime = random(500, 1500);              // amount of time to rest at home, between 0.5 and 1.5 seconds
        this.workTime = random(1000, 1750);             // amount of working time
        this.timecounter = 0;               // counter to measure how long have been doing rest/work

        this.harvestTime = random(750, 1250);

        // families? lineages? clans?
        this.states = {
            atHome: true,
            working: false,
            resting: false,
            goingToJob: false,
            timeForWork: false,
            timeForRest: true,

            hasJob: false,
            hasHome: false,
        };

        // this.inventory = {minerals: 0, wood: 0, love: 0};      // what can dude carry (you even lift brah)
    }

    getAllHomes() {
        let homes = [];
        for (let building of buildings) {
          if (building instanceof Home) {
            homes.push(building);
          }
        }
        return homes;
      }

    getHome() {                    // function for changing homes
        if (this.home == null) {
            let homes = this.getAllHomes();
            let aHome = floor(random(0, homes.length));
            if (aHome.filled()) {
                this.getHome();     // make new home?
            }
            if (this.home == null) {
                this.states.hasHome = false;
                return null;
            }
        }
        this.states.hasHome = true;
        console.log("working at: ", this.job);
        return this.home;
    }

    checkTime() {
        if (this.timecounter >= this.restTime && this.states.resting) {
            this.states.timeForWork = true;
            this.states.timeForRest = false;
        }
        else if (this.timecounter >= this.workTime && this.states.working) {
            this.states.timeForWork = false;
            this.states.timeForRest = true;
        }
    }

    getJob() {
        console.log("pew");
        if (this.jobs.length == 0) {
            if (this.job == null) {
                console.log("no jobs?");
                this.setJob(this.newJob());
            }
        }
        else if (this.jobs.length > 0) {
            if (this.job != this.jobs[this.jobs.length - 1]) {
                this.job = this.jobs[this.jobs.length - 1];
                console.log(this.jobs[this.jobs.length - 1]);
                this.commute();
            }
            else {
                return;
            }
        }
        this.states.hasJob = true;
        console.log("working at: ", this.job);
        return this.job;
    }
    
    addJob(Job) {
        this.jobs.push(Job);
        this.states.hasJob = true;
        return;
    }

    setJob(Job) {
        this.jobs.push(Job);
        this.job = Job;
        this.states.hasJob = true;
        return;
    }
    // function to find a list of resources, pick a random one (depending on minerals or wood), and assign it as a new job.
    newJob(type) {
        let jobs = [];                  // set up list of new jobs
        if (type == 'minerals') {       // search for minerals
            let minerals = resources.filter(resource => resource.type === "minerals");          // filter all resources for minerals
            jobs = minerals;            // set list of jobs to minerals
        }
        else if (type == 'wood') {
            let wood = resources.filter(resource => resource.type === "wood");              // filter all resources for wood
            jobs = wood;                // set list of jobs to wood
        }
        else if (type == null) {
            jobs = resources;           // if no specific criterion, set jobs to all resources
        }
        console.log('hello');
        let job = resources[floor(random(0, jobs.length))];          // pick a random job in list of available jobs
        if (job == null) {         // if there are no available jobs;
            console.log("no available jobs!?");
            this.states.hasJob = false;     // give up.
            return null;
        }
        console.log("returning job");
        return job;             // otherwise, return your new job.
    }

    commute() {
        // find path to destination & go
        // set direction and destination vector
        this.dir = this.pos.angleBetween(this.job.pos);
        this.dest = this.job.pos;
        // state machine
        this.states.atHome = false;
        this.states.working = true;
        this.states.resting = false;
        this.states.goingToJob = true;
        this.timecounter = 0;           // reset time counter
    }

    work() {
        if (this.job instanceof Resource) {
            this.harvest();
        }
        else if (this.job instanceof Building) {
            if (!this.job.complete) {
                this.build();
            }
            // else {
            //     if (this.load.wood > 0) {
            //         this.deposit('wood', this.load.gatherAmt * deltaTime / 1000);
            //     }
            //     else if (this.load.minerals > 0) {
            //         this.deposit('minerals', this.load.gatherAmt * deltaTime / 1000);
            //     }
            //     else {
            //         this.jobs.pop();
            //         this.getJob();
            //     }
            // }
        }
        this.states.working = true;
    }

    harvest() {
        // gather resources
        let harvest = this.job.harvest(this.load.gatherAmt * deltaTime / 1000)
        if (harvest <= 0) {
            this.jobs.pop();
            if (this.jobs.length < 2) {
                this.goHome();
            }
            else {
                this.commute();
            }
        }
        if (this.job.type == 'wood') {
            this.load.wood += harvest;
        }
        else if (this.job.type == 'minerals') {
            this.load.minerals += harvest;
        }
        if (this.load.wood >= this.load.max || this.load.minerals >= this.load.max) {
            if (this.load.wood >= this.load.max) {
                this.load.wood = this.load.max;
                this.jobs.pop();
                this.goHome();
            }
            if (this.load.minerals >= this.load.max) {
                this.load.minerals = this.load.max;
                this.jobs.pop();
                this.goHome();
            }
        }
    }

    build() {
        // build a building
        console.log("BUILDINGNGNGGGG");

        // if enough resources...
        if (this.load.wood > 0) {
            this.depositJob('wood', this.load.gatherAmt * deltaTime / 1000);
        }
        if (this.load.minerals > 0) {
            this.depositJob('minerals', this.load.gatherAmt * deltaTime / 1000);
        }

        console.log("wood: ", this.job.resources.wood);
        console.log("mins: ", this.job.resources.minerals);


        if (this.states.working && this.load.wood <= 0 && this.load.minerals <= 0 && !this.job.complete) {
            let woodToComplete = this.job.resources.wood - this.job.resources.toComplete.wood;                  // how much wood is left until build time
            let mineralsToComplete = this.job.resources.minerals - this.job.resources.toComplete.minerals;      // how much minerals if left until build time
            if (mineralsToComplete < 0) {
                console.log("WIEJROWKEF");
                this.setJob(this.newJob('minerals'));
            }
            else if (woodToComplete < 0) {
                console.log("AKSJFLAWDFJS");
                this.setJob(this.newJob('wood'));
            }

            if (woodToComplete >= 0 && mineralsToComplete >= 0) {
                this.job.completion += deltaTime / 1000;
                if (this.job.complete) {
                    this.job.pop();
                    this.getJob();
                }
            }
            else {
                this.getJob();
                console.log("why are you stucK: ", this.job);
                this.commute();    
            }
        }
        // add build amount and consume resources.
    }

    returnHome() {
        // simply make the dude go to his house
        this.dir = this.pos - this.home;        // direction to direction of home
        this.dest = this.home.pos;              // vector destination set to home
    }

    enterHome() {
        // what to do when person enters home
        this.getJob();
        if (this.jobs.includes(Building)) {
            console.log("current job: ", this.job);
            console.log("jobs: ", this.jobs);
        }
        if (this.load.wood > 0) {
            this.deposit('wood', this.load.gatherAmt * deltaTime / 1000);
        }
        else if (this.load.minerals > 0) {
            this.deposit('minerals', this.load.gatherAmt * deltaTime / 1000);
        }
        // this.home.resources.wood += this.load.gatherAmt * deltaTime / 1000;
        // this.home.resources.minerals += this.load.gatherAmt * deltaTime / 1000;
        console.log("wood: ", this.home.resources.wood);
        console.log("mins: ", this.home.resources.minerals);
        this.states.resting = true;

        if (this.states.working && (this.load.wood <= 0 && this.load.minerals <= 0)) {
            this.getJob();
            this.commute();
        }
    }

    deposit(type, amt) {
        if (type == 'wood') {
            if (this.load.wood < 0) {
                // stop
                this.home.resources.wood += this.load.wood;
                return;
            }
            else {
                this.home.resources.wood += amt;
                this.load.wood -= amt;
                return;
            }    
        }
        else if (type == 'minerals') {
            if (this.load.minerals < 0) {
                // stop
                this.home.resources.minerals == this.load.minerals;
                return;
            }
            else {
                this.home.resources.minerals += amt;
                this.load.minerals -= amt;
                return;
            }
        }
        return;
    }
    // yes, I know how disgusting copying and pasting a whole function to alter this.home to this.job is. It's 1 am. we'll fix it in post
    depositJob(type, amt) {
        if (type == 'wood') {
            if (this.load.wood < 0) {
                // stop
                this.job.resources.wood += this.load.wood;
                return;
            }
            else {
                this.job.resources.wood += amt;
                this.load.wood -= amt;
                return;
            }    
        }
        else if (type == 'minerals') {
            if (this.load.minerals < 0) {
                // stop
                this.job.resources.minerals == this.load.minerals;
                return;
            }
            else {
                this.job.resources.minerals += amt;
                this.load.minerals -= amt;
                return;
            }
        }
        return;
    }

    goHome() {
        // end day, go home.
        this.states.working = false;
        this.states.timeForWork = false;
        this.returnHome();
    }

    // detectEdgeCollision() {
    //     if (
    //         this.position.x > width ||
    //         this.position.y > height ||
    //         this.position.x < 0 ||
    //         this.position.y < 0
    //     ) {
    //         // //bounce the path off the edge and keep going 
    //         // this.angle += (2 * PI) / 3;
    //     }
    // }

    detectResourceCollision() {
        for (let i = 0; i < resources.length; i++) {
            let resource = resources[i];
            if (resource != null) {
                let d = this.pos.dist(resource.pos);
                // let radii = this.rad + resource.rad;
                if (d <= this.rad) {
                    this.resource = true;
                    this.speed = 0;
                }
            }
        }
    }

    update() {
        // this feels janky. its 1:24 am and I am satisfied with the jank. later me and cameron/nic (HI CAMERON/NIC! hows it going guys wow so great to meet you digitally through code for once) may not

        this.states;

        if (!this.states.hasHome) {
            this.getHome();
        }
        if (!this.states.hasJob) {
            this.getJob();
        }
        if (this.states.atHome && this.timecounter > this.restTime) {
            this.commute();
            console.log("at home");
        }
        if (p5.Vector.sub(this.job.pos, this.pos).mag() < 5 && this.states.working) {
            // console.log(this.job);
            this.work();
            this.goingToJob = false;
            this.atJob = true;
        }
        if(p5.Vector.sub(this.pos, this.home.pos).mag() < 5 && this.states.working) {
            this.enterHome();
        }
        // uhh... all of this is to update the speed to simulate velocity
        if(this.dest != null && p5.Vector.sub(this.dest, this.pos).mag() > 5) {
            let vel = p5.Vector.sub(this.dest, this.pos);
            vel.normalize();
            vel.mult(deltaTime / 1000 * this.speed);
            this.pos.add(vel);
        }
        // if (this.speed < this.wantspeed) {                       // lerp speed
        //     if (this.wantspeed - this.speed <= 0.5) {            // if speed is almost where we want it,
        //         this.speed = this.wantspeed;                 // set it to proper speed
        //     }
        //     else {
        //         this.speed = lerp(this.speed, this.wantspeed, deltaTime / 1000);             // otherwise, increment speed
        //     }
        // }
        // else if (this.speed > this.wantspeed) {
        //     if (this.speed - this.wantspeed <= 0.5) {
        //         this.speed = this.wantspeed;
        //     }
        //     else {
        //         this.speed = lerp(this.speed, this.wantspeed, deltaTime / 1000);
        //     }
        // }

        // let vel = createVector(cos(this.dir), sin(this.dir))
        //     .mult(this.speed)
        //     .mult(deltaTime / 1000);
        // if (this.resource) {
        //     this.pos.x -= vel.x;
        //     this.pos.y -= vel.y;
        // }
        // else if (this.home) {
        //     this.pos.x -= vel.x;
        //     this.pos.y -= vel.y;
        // } else {
        //     this.pos.x += vel.x;
        //     this.pos.y += vel.y;
        // }
        // this.detectResourceCollision();
        this.timecounter += deltaTime;
    }
}

class Resource extends Entity {
    constructor(type, tier) {
        super(random(width), random(height), color(200, 200, 100), 40, 'square', 0);
        this.type = type;                   // what resource; wood, minerals, etc.
        this.tier = tier;                   // what size deposit; tiny, small, medium, large, gargantuan

        this.amount = random(500, 1500);
        // if tier is higher, display more minerals.
        this.rad = this.rad * (this.tier * .75);

        if (type == 'minerals') {
            this.clr = color(25, 75, 255);
        }
        else if (type == 'wood') {
            this.clr = color(215, 35, 75);
        }
    }
    tierDisplay() {
        // show more minerals/resources for higher tiers
    }
    harvest(amt) {
        console.log(this.amount);
        if (this.amount <= 0) {
            this.destroy();
            return this.amount;
        }
        else {
            this.amount -= amt;
            return amt; 
        }

    }
    destroy() {
        // remove from entities, play explosion, drop chunks? (scope)
        let i = resources.indexOf(this);
        resources.splice(i, 1);
    }
}

function addResources(amt, x, width, y, height, type, tier) {
    for (let i = 0; i < amt; i++) {
        let randomx = Math.floor(Math.random() * (width - x) + x);
        let randomy = Math.floor(Math.random() * (height - y) + y);
        let randtier = Math.floor(Math.random() * (tier - 1) + 1);
        let randsize = Math.floor(Math.random() * (25 - 20) + 20);
        let deposit = new Resource(type, randtier);
        resources.push(deposit);
    }
    console.log("resources: ", resources);
}
function addDudes(amt, x, width, y, height, home) {
    for (let i = 0; i < amt; i++) {
        let randomx = Math.floor(Math.random() * (width - x) + x);
        let randomy = Math.floor(Math.random() * (height - y) + y);
        let randsize = Math.floor(Math.random() * (25 - 20) + 20);
        let clay = new Entity(randomx, randomy, 120, randsize, 'square', 0);
        let dude = new Dude(home, null);
        dude.clr = color(random(25, 255), random(25, 255), random(25, 255));
        dudes.push(dude);
    }
    console.log("dudes: ", dudes);
}
function conscriptDudes(amt, job) {
    for (let i = 0; i < amt; i++) {
        let dude = dudes[floor(random(0, dudes.length))];
        if (dude.jobs.length < 3 && !dude.jobs.includes(job)) {
            dude.addJob(job);
        }
    }
}

function setupCity() {
    // place primary base, generate resources/foliage,
    let homeBase = new Building('Home', 1, null);
    homeBase.complete = true;
    homeBase.completion = 100;
    homeBase.pos.x = width/2;
    homeBase.pos.y = height/2;
    homeBase.clr = color(255, 0, 0);
    homeBase.maxbeds = 5;
    buildings.push(homeBase);
    addResources(8, 0, width, 0, height, 'minerals', 3);
    addResources(35, 0, width, 0, height, 'wood', 2);
    addDudes(5, 0, 600, 0, 600, homeBase);

}

function drawCity() {
    background(540);

    stroke(50, 50, 125);
    strokeWeight(1.5);
    fill(0, 0, 0, 0);
    if (!mouseHovering) {
        ellipse(mouseX, mouseY, 50);
    }

    buildings.forEach((e) => {
        e.draw();
        e.update();
    });
    dudes.forEach((d) => {
        d.draw();
        d.update();
    });
    resources.forEach((r) => {
        r.draw();
        r.update();
    });
}

function mouseClickedCity() {
    // transition to new city for now
    let building = new Home(0, random(3, 5));
    building.completion = 0;
    building.complete = false;
    building.pos.x = mouseX;
    building.pos.y = mouseY;
    building.clr = color(255, 0, 0);
    buildings.push(building);

}