// Utility function to limit radians between -PI and +PI
function toSafeAngle(input) {
    let a = input;
    while (a > Math.PI) {
        a -= Math.PI * 2;
    }
    while (a < -Math.PI) {
        a += Math.PI * 2;
    }
    return a;
}

// Utility function to find the smallest angular
// difference between two angles. (in radians)
function angleDifference(from, to) {
    return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

// Utility linear interpolation function
function lerp(start, end, percent) {
    return start + percent * (end - start);
}

class Boid {
    x = 0;              // Where we are on the X axis
    y = 0;              // Where we are on the Y axis
    angle = 0;          // Our current angle
    targetAngle = 0;    // The calculated ideal angle

    // This function will run every time a new Boid object
    // is created. This is handled by JS, so we don't need
    // to call this function.
    constructor() {
        this.angle = toSafeAngle(Math.random() * Math.PI * 2);       // Random starting angle (in radians)
        this.targetAngle = this.angle;                  // Make sure they agree at the beginning lol
        this.x = Math.random() * window.innerWidth;     // Random starting position X
        this.y = Math.random() * window.innerHeight;    // Random starting position Y
    }

    // This function returns the angle (in radians)
    // from our location to the specified X,Y position.
    angleTo(x, y) {
        return Math.atan2(y - this.y, x - this.x) + (Math.PI / 2);
    }

    // This function returns the distance from our
    // location, to the specified X,Y position.
    distanceTo(x, y) {
        return Math.hypot(this.x - x, this.y - y);
    }

    // This function aligns THIS boid with the
    // boids passed in via the "boids" parameter
    // proportinally to the distance between them.
    // maxDistance is how far the boid can "see".
    align(boids, maxDistance, strength) {
        let averageAlignedAngle = this.targetAngle;

        for (const boid of boids) {
            // Ignore the boid if it is us.
            if (boid == this) {
                continue;
            }

            const distance = this.distanceTo(boid.x, boid.y);

            // If we're too far away, just ignore it
            if (distance > maxDistance) {
                continue;
            }

            // 0.0 - 1.0. How close is it?
            const influence = 1.0 - distance / maxDistance;

            // How far (and in what direction) are we from the "perfect" angle?
            const angleDelta = angleDifference(averageAlignedAngle, boid.angle);

            // What is the angle given it's distance?
            const distanceFactoredAngle = angleDelta * influence;

            // add our angle to the average
            averageAlignedAngle += distanceFactoredAngle;
        }

        // Average our "ideal" angle, and the existing angle
        this.targetAngle = lerp(this.targetAngle, averageAlignedAngle, strength);
    }

    // This function tries to keep a set distance
    // between THIS boid and the incoming parameter
    // boid.
    seperate(boids, goalDistance, strength) {
        let averageSeperationAngle = this.targetAngle;

        for (const boid of boids) {
            const distance = this.distanceTo(boid.x, boid.y);

            // Influence will be over 1.0 if we're not
            // too close. So ignore those cases.
            if (distance > goalDistance) {
                continue;
            }

            const influence = distance / goalDistance;
            const angleToBoid = this.angleTo(boid.x, boid.y);
            const angleFromBoid = toSafeAngle(angleToBoid - Math.PI);
            const angleDiff = angleDifference(averageSeperationAngle, angleFromBoid);
            const influenceAdjustedAngleDiff = angleDiff * influence;

            averageSeperationAngle += influenceAdjustedAngleDiff;
        }

        // Average our "ideal" angle, and the existing angle
        this.targetAngle = lerp(this.targetAngle, averageSeperationAngle, strength);
    }

    // This function tries to turn into the center of the "flock"
    flock(averageCenterX, averageCenterY, strength) {
        // From where we are, where is the flock?
        const angleToFlock = this.angleTo(averageCenterX, averageCenterY);

        // Average our "ideal" angle, and the existing angle
        this.targetAngle = lerp(this.targetAngle, angleToFlock, strength);
    }

    avoid(dangerX, dangerY, maxDistance, strength){
        const distanceToDanger = this.distanceTo(dangerX, dangerY);

        // If it's too far to "see" move on.
        if(distanceToDanger > maxDistance){
            return;
        }

        // From where we are, where is the danger?
        const angleToDanger = this.angleTo(dangerX, dangerY);

        // What is the opposite of that?
        const angleFromDanger = toSafeAngle(angleToDanger + Math.PI);

        // Average our "ideal" angle, and the existing angle
        this.targetAngle = lerp(this.targetAngle, angleFromDanger, strength);
    }

    // A function whose ONLY job is to update the
    // state of THIS boid.
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

    // A function whose ONLY job is to draw the boid
    // given it's current state (position and angle)
    draw(context) {
        // Set color
        context.fillStyle = "#CCCCCC";

        // Draw/Fill the polygon
        context.save();             // Take note of the current rendering state (where the viewport is)

        context.translate(this.x, this.y);    // Move the rendering context to where we are located (allowing us to draw our shape in local space)
        context.rotate(this.angle);         // Rotate the canvas to match our angle

        context.beginPath();        // Tell the context that we are starting a "path" (polygon)

        context.moveTo(0, -5);       // Move an imaginary pen to the location specified
        context.lineTo(5, 5);     // Draw a line from wherever we were (as set by moveTo) to the location specified
        context.lineTo(-5, 5);    // Continue the line to the specified location
        context.lineTo(0, -5);       // Continue the line to the specified location

        context.fill();             // Tell the context that we're done with our "path" and that we want to "fill" the shape

        context.restore();          // Restore the state to how it was when we "save()"d it
    }
}