class Hawk {
    x;              // current location X
    y;              // current location Y
    angle;          // current angle
    targetAngle;    // target angle

    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.angle = (Math.random() * Math.PI * 2) - Math.PI;
        this.targetAngle = this.angle;
    }

    // This function returns the angle (in radians)
    // from our location to the specified X,Y position.
    angleTo(x, y) {
        return Math.atan2(y - this.y, x - this.x) + (Math.PI / 2);
    }

    // This function tries to turn into the center of the "flock"
    hunt(flockCenterX, flockCenterY, strength) {
        // From where we are, where is the flock?
        const angleToFlock = this.angleTo(flockCenterX, flockCenterY);

        // Average our "ideal" angle, and the existing angle
        this.targetAngle = lerp(this.targetAngle, angleToFlock, strength);
    }

    update(turnSpeedMultiplier, movementSpeed) {
        // How far off are we?
        let angleDiff = angleDifference(this.angle, this.targetAngle);

        // Slowly rotate toward the target angle
        this.angle += angleDiff * turnSpeedMultiplier;
        this.angle = toSafeAngle(this.angle);

        this.targetAngle = this.angle;

        // Move according to angle
        this.x += Math.sin(this.angle) * movementSpeed;
        this.y -= Math.cos(this.angle) * movementSpeed;

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

    // A function whose ONLY job is to draw the hawk
    // given it's current state (position and angle)
    draw(context) {
        // Set color
        context.fillStyle = "red";

        // Draw/Fill the polygon
        context.save();             // Take note of the current rendering state (where the viewport is)

        context.translate(this.x, this.y);    // Move the rendering context to where we are located (allowing us to draw our shape in local space)
        context.rotate(this.angle);         // Rotate the canvas to match our angle

        context.beginPath();        // Tell the context that we are starting a "path" (polygon)

        context.moveTo(0, -8);       // Move an imaginary pen to the location specified
        context.lineTo(8, 8);     // Draw a line from wherever we were (as set by moveTo) to the location specified
        context.lineTo(-8, 8);    // Continue the line to the specified location
        context.lineTo(0, -8);       // Continue the line to the specified location

        context.fill();             // Tell the context that we're done with our "path" and that we want to "fill" the shape

        context.restore();          // Restore the state to how it was when we "save()"d it
    }
}