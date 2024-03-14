// Some constants for configuring
const NUMBER_OF_BOIDS = 1000;
const VISION_DISTANCE = 150;
const IDEAL_SEPERATION = 15;
const TURN_SPEED = 0.05;
const MOVE_SPEED = 2.0;

const HAWK_TURN_SPEED = 0.02;
const HAWK_MOVE_SPEED = 2.5;

// A placeholder variable where we will store our canvas HTML element.
let canvas;

// A placeholder variable where we will store the 
// rendering context that lives inside the canvas element.
// This is what we'll actaully tell to draw shapes.
let context;

// A variable to track how many frames have passed.
let counter = 0;

// An array to hold all of our boids
let boids = [];

// our hawk
let hawk = new Hawk();

// The X component of the LAST FRAME average flock position
let flockCenterX;
// The Y component of the LAST FRAME average flock position
let flockCenterY;

// The X component of the last known mouse position
let mouseX;
// The Y component of the last known mouse position
let mouseY;

// This function will be called once to get everything ready.
function setup() {
    // Create a new <canvas> element and store it in the canvas variable
    canvas = document.createElement("canvas");

    // Set the canvas size to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Add that element to the body tag
    document.body.appendChild(canvas);

    // Get the rendering context from the canvas element
    context = canvas.getContext("2d");

    for (let i = 0; i < NUMBER_OF_BOIDS; i++) {
        // This loop runs NUMBER_OF_BOIDS times.
        // i will go from 0 - (NUMBER_OF_BOIDS - 1).

        // Create a new boid (and call it's constructor under the hood)
        // see "boid.js" to see the definition of this class.
        const boid = new Boid();

        // Update the flock center as we create the boids
        // If flockCenterX is not set yet
        if (flockCenterX == null) {
            // Set it to this boid's position
            flockCenterX = boid.x;
        } else {
            // If it IS set
            // Average it's prior value with this boid's position
            flockCenterX = (flockCenterX + boid.x) / 2;
        }

        // If flockCenterY is not set yet
        if (flockCenterY == null) {
            // Set it to this boid's position
            flockCenterY = boid.y;
        } else {
            // If it IS set
            // Average it's prior value with this boid's position
            flockCenterY = (flockCenterY + boid.y) / 2;
        }

        // "push" the new boid into the array of boids
        boids.push(boid);
    }

    mouseX = 0;
    mouseY = 0;

    // This links the document's keydown event to our onKeyDown function
    document.addEventListener('keydown', onKeyDown);

    // This links the document's mousemove event to our onMouseMove function
    document.addEventListener('mousemove', onMouseMove);
}

// This function will run every time a keyboard
// button is pressed.
function onKeyDown(event) {
    // If "a" is pressed
    if (event.key == "a") {
        // Run the loop
        loop();
    }
}

// This function will run every time the mouse moves
function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

let average_time = null;

// This function will run over and over until the simulation
// is stopped.
function loop() {

    // Set background color
    context.fillStyle = `#222222`;

    // Clear screen by filling the screen
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Increment counter by one
    counter = counter + 1;

    // A variable to store the average location of our
    //  flock X position. Initialized with the first
    //  boid's location to not bias the result.
    let workingAverageFlockX = boids[0].x;

    // A variable to store the average location of our
    //  flock Y position. Initialized with the first
    //  boid's location to not bias the result.
    let workingAverageFlockY = boids[0].y;

    // Draw our boids
    for (const boid of boids) {
        // Code in here will run for EACH boid

        timer.start();
        boid.align(boids, VISION_DISTANCE, 0.40);
        alignTotal += timer.lap();
        boid.flock(flockCenterX, flockCenterY, 0.70);
        flockTotal += timer.lap();
        boid.seperate(boids, IDEAL_SEPERATION, 0.80);
        seperateTotal += timer.lap();
        boid.avoid(hawk.x, hawk.y, VISION_DISTANCE, 0.90);
        avoidTotal += timer.lap();

        boid.update(TURN_SPEED, MOVE_SPEED);

        boid.draw(context);

        // Update averages
        workingAverageFlockX = (workingAverageFlockX + boid.x) / 2;
        workingAverageFlockY = (workingAverageFlockY + boid.y) / 2;
    }

    // Update the hawk
    // hawk.hunt(flockCenterX, flockCenterY, 1.0);
    hawk.hunt(mouseX, mouseY, 1.0);
    hawk.update(HAWK_TURN_SPEED, HAWK_MOVE_SPEED);

    // draw the hawk
    hawk.draw(context);

    // Draw the center of the flock
    // context.fillStyle = "blue";
    // context.fillRect(flockCenterX - 4, flockCenterY - 4, 8, 8);

    // If we were to update the flock average position in
    //  a rolling manor (updating the average with each boid)
    //  each boid would have a different answer.
    // The last few boids would be close to the right answer,
    //  but the first one would consider itself to be the
    //  center of the flock.
    // Instead, we average the answer throughout the frame
    //  and update a global variable (flockCenter) and use
    //  that value for ALL boids.
    // This does mean our flock center is always 1 frame
    //  off. But it also means that all boids have an equally
    //  correct value being sent to them.
    flockCenterX = workingAverageFlockX;
    flockCenterY = workingAverageFlockY;

    // Request the next frame to call loop() starting a never-ending
    // loop.
    window.requestAnimationFrame(loop.bind(this));
}

// Run the setup function
setup();

// Run the loop() function for the first time
// it will run itself from this point on.
loop();