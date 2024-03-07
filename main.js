// Some constants for configuring
const NUMBER_OF_BOIDS = 100;
const VISION_DISTANCE = 75;
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

        // "push" the new boid into the array of boids
        boids.push(boid);
    }

    // This allows us to fire the loop function by
    // pressing the "a" key. This allows for single
    // step loops.
    document.addEventListener('keydown', (evt)=>{
        if(evt.key == "a"){
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

    // Draw our boids
    for (const boid of boids) {
        // Code in here will run for EACH boid

        for (const otherBoid of boids) {
            if (boid === otherBoid) {
                // If both loop boids are the same object
                // skip it and continue.
                continue;
            }

            // boid.align(otherBoid, VISION_DISTANCE);
            // boid.seperate(otherBoid, IDEAL_SEPERATION);
            boid.
        }

        boid.update(TURN_SPEED);

        boid.draw(context);
    }

    // Request the next frame to call loop() starting a never-ending
    // loop.
    window.requestAnimationFrame(loop.bind(this));
}

// Run the setup function
setup();

// Run the loop() function for the first time
// it will run itself from this point on.
loop();