// A placeholder variable where we will store our canvas HTML element.
let canvas;

// A placeholder variable where we will store the 
// rendering context that lives inside the canvas element.
// This is what we'll actaully tell to draw shapes.
let context;

// A variable to track how many frames have passed.
let counter = 0;

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

    // Test by drawing a red background
    context.fillStyle = "red";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// This function will run over and over until the simulation
// is stopped.
function loop() {
    // For debug purposes
    console.log("Running loop()");

    // Draw background which changes hue along with the frame counter
    context.fillStyle = `hsl(${counter}, 100%, 50%)`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Increment counter by one
    counter = counter + 1;

    // Request the next frame to call loop() starting a never-ending
    // loop.
    window.requestAnimationFrame(loop.bind(this));
}

// Run the setup function
setup();

// Run the loop() function for the first time
// it will run itself from this point on.
loop();