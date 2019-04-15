// Player object
// (c) 2019 Jani Nykänen


// Constructor
let Player = function(x, y) {

    this.pos = new Vec2(x, y);
}


// Update
Player.prototype.update = function(cam, evMan, tm) {

    const EPS = 0.1;

    // TEMPORARY
    // Move camera
    let stick = evMan.vpad.stick;

    let dx = 0;
    let dy = 0;
    if(Math.abs(stick.x) > EPS) {

        dx = stick.x > 0 ? 1 : -1;
    }
    else if(Math.abs(stick.y) > EPS) {

        dy = stick.y > 0 ? 1 : -1;
    }
    if(dx != 0 || dy != 0) {

        cam.move(dx, dy);
    }
}


// Draw
Player.prototype.draw = function(g) {

    // ...
}
