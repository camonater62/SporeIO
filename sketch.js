let states = [ 'Spore', 'City', 'Universe'];
let state = 0;

function setup() {
    createCanvas(windowWidth, windowHeight); 

    setupSpore();
    setupCity();
    setupUniverse();
}

function draw() {
    switch (states[state]) {
        case 'Spore': drawSpore(); break;
        case 'City': drawCity(); break;
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
        case 'City': mouseClickedCity(); break;
    }
}

let mousePos = 0;
function mouseWheel(event) {
    mousePos += event.delta;
}