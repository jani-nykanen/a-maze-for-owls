// It's a-me, donut!
// (c) 2019 Jani Nykänen


const DONUT_JUMP_WAIT = 60;



// Constructor
let Donut = function(x, y) {

    const DONUT_SPEED = 1.0;

    // Set initial values &
    // create components
    this.pos = new Vec2(x, y);
    this.speed = new Vec2(0, 0);
    this.spr = new AnimatedSprite(48, 48);
    this.inCamera = false;
    this.flip = Flip.None;
    this.canJump = false;
    this.jumpTimer = DONUT_JUMP_WAIT;
    this.jumpMode = 0;

    // Hitbox
    this.width = 24;
    this.height = 28;

    // Area limits
    let dx = ((this.pos.x/192) | 0)*192;
    let dy = ((this.pos.y/144) | 0)*144;
    this.left = dx + 16;
    this.right = dx + 192 -16;
    this.bottom = y;
    this.top = dy+16;

    // Set initial speed
    this.speed.x = DONUT_SPEED;
}


// Update
Donut.prototype.update = function(cam, evMan, tm) {

    const ANIM_SPEED = 5;
    const GRAVITY = 0.05;
    const JUMP_HEIGHT = [-2.5, -1.75];
    const JUMP_MOD = 0.5;

    // Is in the camera
    this.inCamera = 
        cam.moving || (
        this.pos.x+24 > cam.pos.x  && 
        this.pos.x-24 < cam.pos.x+192 &&
        this.pos.y+8 > cam.pos.y  && 
        this.pos.y-40 < cam.pos.y+144);
    if(!this.inCamera || cam.moving)
        return;

    // Animate
    this.flip = this.speed.x < 0 ? Flip.Horizontal : Flip.None;
    if(this.canJump) {

        this.spr.animate(0, 0, 5, ANIM_SPEED, tm);
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

    // Collisions, horizontal
    if(this.speed.x < 0 && this.pos.x-this.width/2 < this.left) {

        this.pos.x = this.left+this.width/2;
        this.speed.x *= -1;
    }
    else if(this.speed.x > 0 && this.pos.x+this.width/2 > this.right) {

        this.pos.x = this.right-this.width/2;
        this.speed.x *= -1;
    }
    // Collisions, vertical
    this.canJump = false;
    if(this.speed.y > 0 && this.pos.y > this.bottom) {

        this.pos.y = this.bottom;
        this.speed.y = 0;
        this.canJump = true;
    }

    // Update jump timer
    if(this.canJump) {
        this.jumpTimer -= 1.0 * tm;
        if(this.jumpTimer <= 0.0) {

            this.jumpTimer += DONUT_JUMP_WAIT;
            this.speed.y = JUMP_HEIGHT[this.jumpMode];
            ++ this.jumpMode;
            this.jumpMode %= 2; 

            // Play jump
            evMan.audio.playSample(evMan.sounds.jump2, 0.4);
        }
    }

    // Update gravity
    this.speed.y += GRAVITY * tm;

    // Move
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;

}


// Player collision
Donut.prototype.playerCollision = function(pl) {

    if(!this.inCamera) return;

    pl.hurtCollision(this.pos.x-this.width/2, 
        this.pos.y-this.height,
         this.width, this.height);
}


// Draw
Donut.prototype.draw = function(g) {

    if(!this.inCamera) return;

    this.spr.draw(g, g.bitmaps.donut, 
        this.pos.x-24, this.pos.y-40, 
        this.flip);
}
