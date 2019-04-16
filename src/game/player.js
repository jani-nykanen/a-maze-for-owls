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

    // Hitbox
    this.width = 4;
    this.height = 12;
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
    if(this.canJump && s == State.Pressed) {

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


// Animate
Player.prototype.animate = function(tm) {

    const WALK_BASE = 12;
    const WALK_MOD = 6;
    const JUMP_MOD = 0.25;
    const EPS = 0.01;

    // Jumping
    if(!this.canJump) {

        if(Math.abs(this.speed.y) < JUMP_MOD) {

            this.spr.frame = 1;
        }
        else {

            this.spr.frame = this.speed.y < 0 ? 0 : 2;
        }
        this.spr.row = 1;
    }
    else {

        // Standing
        if(Math.abs(this.speed.x) < EPS) {

            this.spr.frame = 0;
            this.spr.row = 0;
        }
        // Walking
        else {

            let begin = this.speed.x > 0 ? 1 : 3;
            let speed = (WALK_BASE - (Math.abs(this.speed.x))*WALK_MOD) | 0;
            this.spr.animate(0, begin, begin+1, speed, tm);
        }
    }
}


// Update
Player.prototype.update = function(cam, evMan, tm) {

    // Control
    this.control(evMan, tm);
    // Move
    this.move(evMan, tm);
    // Animate
    this.animate(tm);

    this.canJump = false;
}


// Get a floor collision
Player.prototype.floorCollision = function(x, y, w, tm) {

    const COL_OFF_TOP = -0.5;
    const COL_OFF_BOTTOM = 1.0;

    if(this.speed.y < 0.0)
        return;

    // Check if inside the horizontal area
    if(!(this.pos.x+this.width/2 >= x && 
        this.pos.x-this.width/2 < x+w))
        return;

    // Vertical collision
    if(this.pos.y >= y+COL_OFF_TOP*tm && 
       this.pos.y <= y+(COL_OFF_BOTTOM+this.speed.y)*tm) {

         this.pos.y = y;
         this.speed.y = 0.0;
         this.canJump = true;
    }
}


// Get a ceiling collision
Player.prototype.ceilingCollision = function(x, y, w, tm) {

    const COL_OFF_TOP = -1.0;
    const COL_OFF_BOTTOM = 0.5;

    if(this.speed.y > 0.0)
        return;

    // Check if inside the horizontal area
    if(!(this.pos.x+this.width/2 >= x && 
        this.pos.x-this.width/2 < x+w))
        return;

    // Vertical collision
    if(this.pos.y-this.height <= y+COL_OFF_BOTTOM*tm && 
       this.pos.y-this.height >= y+(COL_OFF_TOP+this.speed.y)*tm) {

         this.pos.y = y+this.height;
         this.speed.y = 0.0;
    }
}


// Get a wall collision
Player.prototype.wallCollision = function(dir, x, y, h, tm) {

    
}


// Stage collision
Player.prototype.stageCollision = function(stage, cam, tm) {

    // Check camera
    this.updateCamera(cam, stage);

    // Stage collisions
    stage.playerCollision(this, tm);
}



// Draw
Player.prototype.draw = function(g) {

    // Draw sprite
    this.spr.draw(g, g.bitmaps.owl, this.pos.x-12, this.pos.y-20);
}
