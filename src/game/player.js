// Player object
// (c) 2019 Jani Nykänen


// Constructor
let Player = function(x, y) {

    // Position & speed
    this.pos = new Vec2(x, y);
    this.speed = new Vec2(0, 0);
    this.target = this.speed.copy();
    this.canJump = false;

    // Sprite
    this.spr = new AnimatedSprite(24, 24);
    this.flip = Flip.None;

    // Hitbox
    this.width = 16;
    this.height = 16;
}


// Update speed
Player.prototype.updateSpeed = function(speed, target, acc, tm)  {
    
    if (speed < target) {

        speed += acc * tm;
        if (speed > target) {

            speed = target;
        }
    }
    else if (speed > target) {

        speed -= acc * tm;
        if (speed < target) {

            speed = target;
        }
    }

    return speed;
}



// Control
Player.prototype.control = function(evMan, tm) {

    const MOVE_TARGET = 0.75;
    const GRAVITY_TARGET = 1.0;
    const JUMP_HEIGHT = -2.0;

    let stick = evMan.vpad.stick;

    // Set horizontal target
    this.target.x = stick.x * MOVE_TARGET;
    // Set gravity target
    this.target.y =  GRAVITY_TARGET;

    // "Jump"
    let s = evMan.vpad.buttons.fire1.state;
    if(s == State.Pressed) {

        this.speed.y = JUMP_HEIGHT;
    }
    else if(s == State.Released && this.speed.y < 0.0) {

        this.speed.y /= 2.0;
    }
}


// Move
Player.prototype.move = function(evMan, tm) {

    const ACC_X = 0.05;
    const ACC_Y = 0.05;

    // Update speeds
    this.speed.x = this.updateSpeed(this.speed.x, this.target.x, ACC_X, tm);
    this.speed.y = this.updateSpeed(this.speed.y, this.target.y, ACC_Y, tm);

    // Move
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;
}


// Update camera
Player.prototype.updateCamera = function(cam, stage) {
    
    let EPS = 0.01;

    // Move left
    if(this.speed.x < -EPS && 
        this.pos.x-this.width/2 < cam.pos.x) {

        cam.move(-1, 0);
        this.pos.x -= this.width;
        if(this.pos.x < 0) {

            this.pos.x += stage.tmap.width*16;
        }
    }
    // Move right
    else if(this.speed.x > EPS &&
        this.pos.x+this.width/2 > cam.pos.x+192) {

        cam.move(1, 0);
        this.pos.x += this.width;
        if(this.pos.x > stage.tmap.width*16) {

            this.pos.x -= stage.tmap.width*16;
        }
    }

    // Move up
    if(this.speed.y < -EPS && 
        this.pos.y-this.height < cam.pos.y) {

        cam.move(0, -1);
        this.pos.y -= this.height;
        if(this.pos.y < 0) {

            this.pos.y += stage.tmap.height*16;
        }
    }
    // Move down
    if(this.speed.y > EPS && 
        this.pos.y > cam.pos.y+144) {

        cam.move(0, 1);
        this.pos.y += this.height;
        if(this.pos.y > stage.tmap.height*16) {

            this.pos.y -= stage.tmap.height*16;
        }
    }
}


// Update
Player.prototype.update = function(cam, evMan, tm) {

    const EPS = 0.1;

    // TEMPORARY
    // Move camera
    /*
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
    */

    // Control
    this.control(evMan, tm);
    // Move
    this.move(evMan, tm);
}


// Stage collision
Player.prototype.stageCollision = function(stage, cam, tm) {

    // Check camera
    this.updateCamera(cam, stage);
}



// Draw
Player.prototype.draw = function(g) {

    // Draw sprite
    this.spr.draw(g, g.bitmaps.owl, this.pos.x-12, this.pos.y-20, this.flip);
}
