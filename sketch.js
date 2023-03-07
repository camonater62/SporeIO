let states = [ 'Spore', 'Universe' ];
let state = states[1];

function setup() {
    setupSpore();
    setupUniverse();
}

function draw() {
    createCanvas(512, 480);  
    
    switch (state) {
        case 'Spore': drawSpore(); break;
        case 'Universe': drawUniverse(); break;
    }
}