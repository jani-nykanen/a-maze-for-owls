// Player object
// (c) 2019 Jani Nykänen


// Constants
const PL_MOVE_DELTA = 8;
const PL_THWOMP_WAIT = 30;


// Constructor
let Player = function(x, y) {

    // Position & speed
    this.pos = new Vec2(x, y);
    this.startPos = this.pos.copy();
    this.startPosSet = false;
    this.speed = new Vec2(0, 0);
    this.target = this.speed.copy();
    this.moveDir = {x: 0, y: 0};

    // Jump params
    this.canJump = false;
    this.doubleJump = false;
    this.floating = false;

    // Is swimming
    this.swimming = false;
    this.oldSwimState = false;

    // Thwomp
    this.thwomping = true;
    this.thwompTimer = PL_THWOMP_WAIT;
    this.stopped = false;

    // Is dying
    this.dying = false;
    // Is respawning
    this.respawning = false;

    // Sprite
    this.spr = new AnimatedSprite(24, 24);

    // Hitbox
    this.width = 6;
    this.height = 12;

    // Skills
    this.skills = [
        false, // Walk
        false, // Jump,
        false, // Double jump
        false, // Float
        false, // Swim
        false, // Thwomp
        false, // Dig
    ];

    // Recovery timer
    this.recoveryTimer = 0;

    // Feathers
    this.feathers = 0;
    this.oldFeathers = 0;

    // Sound effect states
    this.hurtPlayed = true;
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
    const THWOMP_GRAVITY = 4.0;
    const JUMP_HEIGHT = -2.25;
    const DOUBLE_JUMP_HEIGHT = -1.75;
    const SWIM_SPEED = -1.25;
    const THWOMP_JUMP = -1.5;
    const THWOMP_DELTA = 0.1;
    const FLOAT_GRAVITY = 0.5;

    let stick = evMan.vpad.stick;

    // Set gravity target
    if(this.thwomping)
        this.target.y = THWOMP_GRAVITY;
    else if(this.swimming)
        this.target.y = WATER_GRAVITY;
    else
        this.target.y = GRAVITY_TARGET;

    // Stop here if thwomping
    if(this.thwomping) return;

    // Set horizontal target
    this.target.x = this.skills[0] ? stick.x * MOVE_TARGET : 0;

    // Jumps
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
    else if(this.skills[1]) {

        if(s == State.Pressed) {

            // Thwomp
            if(this.skills[5] && !this.canJump && stick.y > THWOMP_DELTA) {

                this.thwomping = true;
                this.thwompTimer = PL_THWOMP_WAIT;
                this.speed.y = THWOMP_JUMP;
            }
            // Normal & double jump
            else if( ( (this.doubleJump && this.skills[2]) || 
                this.canJump) && s == State.Pressed) {

                this.speed.y = this.canJump ? JUMP_HEIGHT : DOUBLE_JUMP_HEIGHT;
                if(!this.canJump)
                    this.doubleJump = false;

                // Play jump
                evMan.audio.playSample(evMan.sounds.jump, 0.5);
            }
        
        }
        // Release jump   
        else if(s == State.Released && this.speed.y < 0.0) {

            this.speed.y /= 2.0;
        }
    }

    // Floating
    this.floating = 
        this.skills[3] &&
        !this.canJump && 
        !this.swimming && 
        !this.thwomping &&
        this.speed.y > 0 && 
        s == State.Down;
    if(this.floating) {

        this.target.y = FLOAT_GRAVITY;
    }
}


// Move
Player.prototype.move = function(evMan, tm) {

    const ACC_X = 0.05;
    const ACC_Y = 0.05;
    const SWIM_ACC_Y = 0.033;
    const THWOMP_ACC_Y = 0.2;

    let grav = ACC_Y;
    if(this.thwomping)
        grav = THWOMP_ACC_Y;
    else if(this.swimming)
        grav = SWIM_ACC_Y;

    // Update speeds
    this.speed.x = this.updateSpeed(this.speed.x, this.target.x, ACC_X, tm);
    this.speed.y = this.updateSpeed(this.speed.y, this.target.y, grav, tm);

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

        if(this.pos.x < 0) {

            this.pos.x += stage.tmap.width*16;
        }
    }
    // Move right
    else if(this.speed.x > EPS &&
        this.pos.x+this.width/2 > cam.pos.x+192) {

        cam.move(1, 0);
        this.moveDir.x = 1;

        if(this.pos.x > stage.tmap.width*16) {

            this.pos.x -= stage.tmap.width*16;
        }
    }

    // Move up
    if(this.speed.y < -EPS && 
        this.pos.y-this.height > EPS &&
        this.pos.y-this.height < cam.pos.y) {

        cam.move(0, -1);
        this.moveDir.y = -1;

        if(this.pos.y < 0) {

            this.pos.y += stage.tmap.height*16;
        }
    }
    // Move down
    if(this.speed.y > EPS && 
        this.pos.y > cam.pos.y+144) {

        cam.move(0, 1);
        this.moveDir.y = 1;

        if(this.pos.y > stage.tmap.height*16) {

            this.pos.y -= stage.tmap.height*16;
        }
    }

    // Set certain flags
    if(cam.moving) {

        this.startPosSet = false;
    }
}


// Animate
Player.prototype.animate = function(tm) {

    const WALK_BASE = 12;
    const WALK_MOD = 6;
    const JUMP_MOD = 0.25;
    const FLAP_SPEED = 2;
    const EPS = 0.01;

    // "Thwomp"
    if(this.thwomping) {

        this.spr.frame = 3;
        this.spr.row = 1;
    }
    // Floating
    else if(this.floating) {

        this.spr.animate(2, 3, 5, FLAP_SPEED, tm);
    }
    // Jumping
    else if(!this.canJump) {

        // Double jump or swimming
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

    let delta = PL_MOVE_DELTA/INITIAL_MOVE_TIME;

    this.pos.x += this.moveDir.x * delta * tm;
    this.pos.y += this.moveDir.y * delta * tm;

    // Restrict position to the map area
    this.pos.x = negMod(this.pos.x, stage.tmap.width*16);
    this.pos.y = negMod(this.pos.y, stage.tmap.height*16);
    
    // Set start position
    this.startPos.x = this.pos.x;
    this.startPos.y = this.pos.y;

}


// Die
Player.prototype.die = function() {

    const RECOVERY_TIME = 60;

    this.spr.frame = 0;
    this.spr.row = 3;
    this.spr.count = 0;

    this.dying = true;

    this.speed.x = 0;
    this.speed.y = 0;

    this.recoveryTimer = RECOVERY_TIME;
}


// Update death
Player.prototype.updateDeath = function(tm) {

    const DEATH_SPEED = 4;

    // Animate dying
    this.spr.animate(3, 0, 5, DEATH_SPEED, tm);
    if(this.spr.frame == 5) {

        // Reset params
        this.pos = this.startPos.copy();
        this.thwomping = false;
        this.thwompTimer = 0;
        this.swimming = false;
        this.floating = false;
        this.stopped = false;
        this.speed.x = 0;
        this.speed.y = 0;

        this.dying = false;
        this.respawning = true;
        this.spr.frame = 4;
    }
}


// Respawn
Player.prototype.respawn = function(tm) {

    const RESPAWN_SPEED = 4;   

    this.spr.animate(3, 4, -1, RESPAWN_SPEED, tm);
    if(this.spr.frame == -1) {

        this.spr.frame = 0;
        this.spr.row = 0;

        this.respawning = false;
    }
}


// Update
Player.prototype.update = function(cam, evMan, tm) {

    const THWOMP_SHAKE = 4;

    // Play hurt sound
    if(!this.hurtPlayed) {

        evMan.audio.playSample(evMan.sounds.hurt, 0.5);
        this.hurtPlayed = true;
    }

    // Die, if dead
    if(this.dying) {

        this.updateDeath(tm);
        return;
    }
    // Respawn, if used to be dead
    if(this.respawning) {

        this.respawn(tm);
        return;
    }

    // Update recovery time
    if(this.recoveryTimer > 0)
        this.recoveryTimer -= 1.0 * tm;

    // Update thwomp
    cam.shake = 0;
    if(this.canJump && this.thwomping) {

        // No movement horizontally allowed
        this.speed.x = 0;
        this.target.x = 0;

        this.thwompTimer -= 1.0 * tm;
        cam.shake = THWOMP_SHAKE;

        if(this.thwompTimer <= 0.0) {

            this.thwomping = false;
            this.stopped = false;
        }
    }
    if(this.stopped)
        return;

    // Control
    this.control(evMan, tm);
    // Move
    this.move(evMan, tm);
    // Animate
    this.animate(tm);

    // Play feather sound
    if(this.oldFeathers != this.feathers) {

        evMan.audio.playSample(evMan.sounds.feather, 0.5);
    }

    this.canJump = false;
    this.oldSwimState = this.swimming;
    this.oldFeathers = this.feathers;
}


// Get a floor collision
Player.prototype.floorCollision = function(x, y, w, tm) {

    const COL_OFF_TOP = -0.5;
    const COL_OFF_BOTTOM = 1.0;

    if(this.dying || this.speed.y < 0.0)
        return false;

    // Check if inside the horizontal area
    if(!(this.pos.x+this.width/2 >= x && 
        this.pos.x-this.width/2 <= x+w))
        return false;

    // Vertical collision
    if(this.pos.y >= y+COL_OFF_TOP*tm && 
       this.pos.y <= y+(COL_OFF_BOTTOM+this.speed.y)*tm) {

         this.pos.y = y;
         this.speed.y = 0.0;
         this.canJump = true;
         this.doubleJump = true;

         if(this.thwomping)
            this.stopped = true;

         // Set starting position
         if(!this.startPosSet) {

            this.startPos = this.pos.copy();
            this.startPosSet = true;
         }

         return true;
    }

    return false;
}


// Get a ceiling collision
Player.prototype.ceilingCollision = function(x, y, w, tm) {

    const COL_OFF_TOP = -1.0;
    const COL_OFF_BOTTOM = 0.5;

    if(this.dying || this.speed.y > 0.0)
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

    const EPS = 0.01;

    const COL_OFF_NEAR = 0.5;
    const COL_OFF_FAR = 1.0;

    if(this.dying || this.speed.x*dir < EPS)
        return false;

    // Check if inside the collision area vertically
    if(this.pos.y <= y || this.pos.y-this.height >= y+h) {
        return false;
    }

    // Horizontal collision
    if((dir == 1 && 
        this.pos.x+this.width/2 >= x - COL_OFF_NEAR*tm && 
        this.pos.x+this.width/2 <= x + (COL_OFF_FAR+this.speed.x)*tm) ||
       (dir == -1 && 
        this.pos.x-this.width/2  <= x + COL_OFF_NEAR*tm && 
        this.pos.x-this.width/2  >= x-(COL_OFF_FAR-this.speed.x)*tm)) {
        
        this.speed.x = 0;
        this.pos.x = x - this.width/2 * dir;

        return true;
    }
    return false;
}


// Hurt collision
Player.prototype.hurtCollision = function(x, y, w, h) {

    if(this.dying || this.recoveryTimer > 0) return;

    if(this.pos.x+this.width/2 >= x && this.pos.x-this.width/2 <= x+w &&
       this.pos.y >= y && this.pos.y-this.height <= y+h ) {

        // Die
        this.die();
        this.hurtPlayed = false;
    }
}


// Stage collision
Player.prototype.stageCollision = function(stage, cam, tm) {

    if(this.dying) return;

    // Check camera
    this.updateCamera(cam, stage);

    // Stage collisions
    stage.playerCollision(this, tm);

    // Swimming?
    if(this.skills[4])
        this.swimming = this.pos.y-this.height >= stage.surfY;

    else {

        this.swimming = false;
        this.hurtCollision(0, stage.surfY, stage.width, stage.height-stage.surfY);
    }
}



// Draw
Player.prototype.draw = function(g, stage, cam) {

    // Check recovery time
    if(this.recoveryTimer > 0 && 
        (Math.floor(this.recoveryTimer/4)|0) % 2 == 0)
        return;

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
