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

    for (let i = 0; i < 50; i++) {
        // This loop runs 50 times.
        // i will go from 0 - 49.

        const boid = new Boid();    // Create a new boid (and call it's constructor under the hood)
        boids.push(boid);           // "push" the new boid into the array of boids
    }
}

// This function will run over and over until the simulation
// is stopped.
function loop() {
    // For debug purposes
    console.log("Running loop()");

    // Set background color
    context.fillStyle = `#222222`;

    // Clear screen by filling the screen
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Increment counter by one
    counter = counter + 1;

    // Draw our boids
    for (const boid of boids) {
        // Code in here will run for EACH boid

        boid.update();

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