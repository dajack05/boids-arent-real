// Some constants for configuring
const NUMBER_OF_BOIDS = 10;
const VISION_DISTANCE = 100;
const IDEAL_SEPERATION = 25;
const TURN_SPEED = 0.05;

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

// The X component of the LAST FRAME average flock position
let flockCenterX;
// The Y component of the LAST FRAME average flock position
let flockCenterY;

// This function will be called once to get everything ready.
function setup() {
    // For debug purposes
    console.log("Running setup()");

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

    // This allows us to fire the loop function by
    // pressing the "a" key. This allows for single
    // step loops.
    document.addEventListener('keydown', (evt) => {
        if (evt.key == "a") {
            loop();
        }
    })
}

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

        boid.align(boids, VISION_DISTANCE, 1.0);
        // boid.flock(flockCenterX, flockCenterY, 1.0);
        // boid.seperate(boids, IDEAL_SEPERATION, 1.0);

        boid.update(TURN_SPEED);

        boid.draw(context);

        // Update averages
        workingAverageFlockX = (workingAverageFlockX + boid.x) / 2;
        workingAverageFlockY = (workingAverageFlockY + boid.y) / 2;
    }

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