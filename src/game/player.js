// Player object
// (c) 2019 Jani Nykänen


// Constructor
let Player = function(x, y) {

    // Position & speed
    this.pos = new Vec2(x, y);
    this.speed = new Vec2(0, 0);
    this.target = this.speed.copy();
    this.moveDir = {x: 0, y: 0};

    // Jump params
    this.canJump = false;
    this.doubleJump = false;

    // Is swimming
    this.swimming = false;
    this.oldSwimState = false;

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
    const GRAVITY_TARGET = 1.25;
    const WATER_GRAVITY = 0.5;
    const JUMP_HEIGHT = -2.0;
    const DOUBLE_JUMP_HEIGHT = -1.75;
    const SWIM_SPEED = -1.25;

    let stick = evMan.vpad.stick;

    // Set horizontal target
    this.target.x = stick.x * MOVE_TARGET;
    // Set gravity target
    this.target.y = this.swimming ? WATER_GRAVITY :  GRAVITY_TARGET;

    // "Jump"
    let s = evMan.vpad.buttons.fire1.state;
    if(this.swimming) {

        if(s == State.Down) {

            this.target.y = SWIM_SPEED;
        }
    }
    // "Swim jump"
    else if(this.oldSwimState && !this.swimming) {
        
        this.speed.y =  JUMP_HEIGHT;
        this.doubleJump = true;
    }
    // Land jumps
    else {

        if( (this.doubleJump || this.canJump) && s == State.Pressed) {

            this.speed.y = this.canJump ? JUMP_HEIGHT : DOUBLE_JUMP_HEIGHT;
            if(!this.canJump)
                this.doubleJump = false;
        }
        else if(s == State.Released && this.speed.y < 0.0) {

            this.speed.y /= 2.0;
        }
    }
}


// Move
Player.prototype.move = function(evMan, tm) {

    const ACC_X = 0.05;
    const ACC_Y = 0.05;
    const SWIM_ACC_Y = 0.033;

    // Update speeds
    this.speed.x = this.updateSpeed(this.speed.x, this.target.x, ACC_X, tm);
    this.speed.y = this.updateSpeed(this.speed.y, this.target.y, 
        this.swimming ? SWIM_ACC_Y : ACC_Y, tm);

    // Move
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;
}


// Update camera
Player.prototype.updateCamera = function(cam, stage) {
    
    let EPS = 0.01;

    this.moveDir.x = 0;
    this.moveDir.y = 0;

    // Move left
    if(this.speed.x < -EPS && 
        this.pos.x-this.width/2 < cam.pos.x) {

        cam.move(-1, 0);
        this.moveDir.x = -1;

        // this.pos.x -= this.width;
        if(this.pos.x < 0) {

            this.pos.x += stage.tmap.width*16;
        }
    }
    // Move right
    else if(this.speed.x > EPS &&
        this.pos.x+this.width/2 > cam.pos.x+192) {

        cam.move(1, 0);
        this.moveDir.x = 1;

       // this.pos.x += this.width;
        if(this.pos.x > stage.tmap.width*16) {

            this.pos.x -= stage.tmap.width*16;
        }
    }

    // Move up
    if(this.speed.y < -EPS && 
        this.pos.y-this.height < cam.pos.y) {

        cam.move(0, -1);
        this.moveDir.y = -1;

        //this.pos.y -= this.height;
        if(this.pos.y < 0) {

            this.pos.y += stage.tmap.height*16;
        }
    }
    // Move down
    if(this.speed.y > EPS && 
        this.pos.y > cam.pos.y+144) {

        cam.move(0, 1);
        this.moveDir.y = 1;

        //this.pos.y += this.height;
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
    const FLAP_SPEED = 2;
    const EPS = 0.01;

    // Jumping
    if(!this.canJump) {

        if( (this.swimming || !this.doubleJump) && this.speed.y < 0.0) {

            this.spr.animate(2, 0, 2, FLAP_SPEED, tm);
        }
        else {

            if(Math.abs(this.speed.y) < JUMP_MOD) {

                this.spr.frame = 1;
            }
            else {

                this.spr.frame = this.speed.y < 0 ? 0 : 2;
            }
            this.spr.row = 1;
        }
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


// Move while camera is moving
Player.prototype.moveCameraActive = function(stage, tm) {

    const MOVE_DELTA = 8;

    let delta = MOVE_DELTA/INITIAL_MOVE_TIME;

    this.pos.x += this.moveDir.x * delta * tm;
    this.pos.y += this.moveDir.y * delta * tm;

    // Restrict position to the map area
    this.pos.x = negMod(this.pos.x, stage.tmap.width*16);
    this.pos.y = negMod(this.pos.y, stage.tmap.height*16);
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
    this.oldSwimState = this.swimming;
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
         this.doubleJump = true;
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

    const COL_OFF_NEAR = 0.5;
    const COL_OFF_FAR = 1.0;

    if(this.speed.x*dir < 0.0)
        return;

    // Check if inside the collision area vertically
    if(this.pos.y <= y || this.pos.y-this.height >= y+h) {
        return;
    }

    // Horizontal collision
    if((dir == 1 && 
        this.pos.x+this.width/2 >= x - COL_OFF_NEAR*tm && 
        this.pos.x+this.width/2  <= x+(COL_OFF_FAR+this.speed.x)*tm) ||
       (dir == -1 && 
        this.pos.x-this.width/2  <= x + COL_OFF_NEAR*tm && 
        this.pos.x-this.width/2  >= x-(COL_OFF_FAR-this.speed.x)*tm)) {
        
        this.speed.x = 0;
        this.pos.x = x - this.width/2 * dir;
    }
}


// Stage collision
Player.prototype.stageCollision = function(stage, cam, tm) {

    // Check camera
    this.updateCamera(cam, stage);

    // Stage collisions
    stage.playerCollision(this, tm);

    // Swimming?
    this.swimming = this.pos.y-this.height >= stage.surfY;
}



// Draw
Player.prototype.draw = function(g, stage, cam) {

    // Draw sprite
    this.spr.draw(g, g.bitmaps.owl, 
        this.pos.x-12, this.pos.y-20 +1);

    // If looping, this one is needed
    if(cam.moving) {

        this.spr.draw(g, g.bitmaps.owl, 
            this.pos.x-12 + stage.width, 
            this.pos.y-20 +1);
    }
}
