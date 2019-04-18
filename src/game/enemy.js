// An enemy
// (c) 2019 Jani Nykänen


// Constructor
let Enemy = function(x, y, id) {

    const BAT_SPEED = 0.4;
    const HHOG_SPEED = 0.5;

    this.id = id;

    this.pos = new Vec2(x, y);
    this.delta = new Vec2();
    this.spr = new AnimatedSprite(16, 16);
    this.flip = Flip.None;
    this.inCamera = false;

    this.speed = {x:0, y:0};
    this.spcTimer = 0;
    this.onGround = false;


    // Determine ID specific behavior
    switch(id) {

    // Horizontal bat & hedgehog
    case 2:
        this.onGround = true;
    case 0:
        this.speed.x = (id == 0 ? BAT_SPEED : HHOG_SPEED) * 
            (((this.pos.x/16)|0) % 2 == 0 ? 1 : -1);

        break;
    
    // Bat, vertical
    case 1: 
        this.speed.y = BAT_SPEED * (((this.pos.y/16)|0) % 2 == 0 ? 1 : -1);
        break;

    // Fish
    case 2:

        this.speed.x = ((this.pos.x/16)|0) % 2 == 0 ? 1.0 : -1.0;
        break;

    default:
        break;
    };

    // Hitbox
    this.width = 12;
    this.height = 12;
}


// Update
Enemy.prototype.update = function(tm, cam) {

    const ANIM_SPEED_BAT = 8;
    const ANIM_SPEED_HEDGEHOG = 5;
    const FISH_AMPLITUDE = 0.4;
    const FISH_Y_MOD = 2.0;
    const FISH_BASE_SPEED = 0.1;
    const FISH_WAVE_SPEED = 0.025;

    // Is in camera
    this.inCamera = 
        cam.moving || (
        this.pos.x+8 > cam.pos.x  && 
        this.pos.x-8 < cam.pos.x+192 &&
        this.pos.y > cam.pos.y  && 
        this.pos.y-16 < cam.pos.y+144);
    if(!this.inCamera)
        return;

    // Animate bat
    if(this.id == 0 || this.id == 1) {

        this.spr.animate(0, 0, 1, ANIM_SPEED_BAT, tm);
    }
    // Animate hedgehog
    else if(this.id == 2) {

        this.spr.animate(1, 0, 3, ANIM_SPEED_HEDGEHOG, tm);
        this.flip = this.speed.x > 0 ? Flip.Horizontal : Flip.None;
    }
    // Update fish
    else if(this.id == 3) {

        // Update special timer
        this.spcTimer += FISH_WAVE_SPEED * tm;
        this.spcTimer %= Math.PI;

        // Move
        let dir = this.speed.x < 0 ? -1 : 1;
        this.speed.x = (FISH_BASE_SPEED 
            + (Math.sin(this.spcTimer)) * FISH_AMPLITUDE) * dir;
        this.flip = this.speed.x > 0 ? Flip.Horizontal : Flip.None;

        // Determine frame
        this.spr.row = 2;
        this.spr.frame = this.spcTimer > Math.PI/2 ? 0 : 1;

        this.delta.y = Math.sin(this.spcTimer*3) * FISH_Y_MOD;
    }

    // Move
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;

}


// Player collision
Enemy.prototype.playerCollision = function(pl) {

    if(!this.inCamera) return;

    pl.hurtCollision(this.pos.x-this.width/2, 
        this.pos.y-this.height,
         this.width, this.height);
}


// Solid collision
Enemy.prototype.solidCollision = function(x, y, w, h) {

    const EPS = 0.01;

    if(!this.inCamera) return;

    // Not inside, ignore
    if(!(this.pos.x+this.width/2 >= x && this.pos.x-this.width/2 <= x+w &&
        this.pos.y >= y && this.pos.y-this.height <= y+h ))
        return;

    // Horizontal collisions
    if(Math.abs(this.speed.x) > EPS) {

        if( (this.speed.x < 0 && this.pos.x - this.speed.x > x+w/2) ||
           (this.speed.x > 0 && this.pos.x - this.speed.x < x+w/2  )) {

            this.speed.x *= -1;
            this.spcTimer = 0;
        }
    }
    // Vertical collisions
    else if(Math.abs(this.speed.y) > EPS) {

        if( (this.speed.y < 0 && this.pos.y - this.speed.y > y+h/2) ||
           (this.speed.y > 0 && this.pos.y - this.speed.y < y+h/2  )) {

            this.speed.y *= -1;
        }
    }
}


// Draw
Enemy.prototype.draw = function(g, stage, cam) {

    if(!this.inCamera) return;

    // Draw sprite
    this.spr.draw(g, g.bitmaps.enemies, 
        this.pos.x-8 + this.delta.x, 
        this.pos.y-16 + this.delta.y,
        this.flip);

    if(cam.moving) {

        this.spr.draw(g, g.bitmaps.enemies, 
            this.pos.x-8 + stage.width + this.delta.x, 
            this.pos.y-16 + this.delta.y,
            this.flip);
    }
}
