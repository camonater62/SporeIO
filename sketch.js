let states = [ 'Spore', 'Universe' ];
let state = 0;

function setup() {
    createCanvas(windowWidth, windowHeight); 

    setupSpore();
    setupUniverse();
}

function draw() {
    switch (states[state]) {
        case 'Spore': drawSpore(); break;
        case 'Universe': drawUniverse(); break;
    }
}

function keyPressed() {
    if (key == ' ') {
        state = (state + 1) % states.length;
    }
}

function mouseClicked() {
    switch (states[state]) {
        case 'Spore': mouseClickedSpore(); break;
    }
}