class Boid {
    x = 0;          // Where we are on the X axis
    y = 0;          // Where we are on the Y axis
    angle = 0;      // Our current angle

    // This function will run every time a new Boid object
    // is created. This is handled by JS, so we don't need
    // to call this function.
    constructor() {
        this.angle = Math.random() * Math.PI * 2;       // Random starting angle (in radians)
        this.x = Math.random() * window.innerWidth;     // Random starting position X
        this.y = Math.random() * window.innerHeight;    // Random starting position Y
    }

    // This function returns the distance from our
    // location, to the specified X,Y position.
    distanceTo(x, y) {
        return Math.hypot(this.x - x, this.y - y);
    }

    // This function aligns THIS boid with the
    // boid passed in via the "boid" parameter
    // proportinally to the distance between them.
    flock(boid) {
        const distance = this.distanceTo(boid.x, boid.y);
        const maxDistance = 300;

        // If we're too far away, just ignore it
        if (distance > maxDistance) {
            return;
        }

        // 0.0 - 1.0. How close is it?
        const influence = 1.0 - distance / maxDistance;

        // How far away are we from the desired angle?
        const angularDifference = boid.angle - this.angle;

        // How much do we want to change the angle
        // bearing in mind the distance?
        const angularChange = angularDifference * influence;

        // Make it so number 1
        this.angle += angularChange;
    }

    // A function whose ONLY job is to update the
    // state of THIS boid.
    update() {
        // Move according to angle
        this.x += Math.sin(this.angle);
        this.y -= Math.cos(this.angle);

        // If we go 'out of bounds', warp us to the oposing side
        if (this.x < 0) { // If beyond left side
            this.x = window.innerWidth;
        } else if (this.x > window.innerWidth) { // If beyond right side
            this.x = 0;
        }

        // If we go 'out of bounds', warp us to the oposing side
        if (this.y < 0) { // If beyond top side
            this.y = window.innerHeight;
        } else if (this.y > window.innerHeight) { // If beyond bottom side
            this.y = 0;
        }
    }

    // A function whose ONLY job is to draw the boid
    // given it's current state (position and angle)
    draw(context) {
        // Set color
        context.fillStyle = "red";

        // Draw/Fill the polygon
        context.save();             // Take note of the current rendering state (where the viewport is)

        context.translate(this.x, this.y);    // Move the rendering context to where we are located (allowing us to draw our shape in local space)
        context.rotate(this.angle);         // Rotate the canvas to match our angle

        context.beginPath();        // Tell the context that we are starting a "path" (polygon)

        context.moveTo(0, -10);       // Move an imaginary pen to the location specified
        context.lineTo(10, 10);     // Draw a line from wherever we were (as set by moveTo) to the location specified
        context.lineTo(-10, 10);    // Continue the line to the specified location
        context.lineTo(0, -10);       // Continue the line to the specified location

        context.fill();             // Tell the context that we're done with our "path" and that we want to "fill" the shape

        context.restore();          // Restore the state to how it was when we "save()"d it
    }
}