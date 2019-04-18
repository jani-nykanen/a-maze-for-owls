// A disc
// (c) 2019 Jani Nykänen


// Constructor
let Disc = function(x, y, id) {

    this.pos = new Vec2(x, y);
    this.spr = new AnimatedSprite(16, 16);
    this.exist = true;
    this.id = id;

    this.inCamera = false;
}


// Update
Disc.prototype.update = function(tm, cam) {

    const ANIM_SPEED = 4;

    if(!this.exist) return;

    // Is in camera
    this.inCamera = 
        cam.moving || (
        this.pos.x+16 >= cam.pos.x  && 
        this.pos.x <= cam.pos.x+192 &&
        this.pos.y+16 >= cam.pos.y  && 
        this.pos.y <= cam.pos.y+144);

    if(!this.inCamera)
        return;

    // Animate
    this.spr.animate(0, 0, 5, ANIM_SPEED, tm);
}


// Player collision
Disc.prototype.playerCollision = function(pl, msg) {

    if(!this.exist || pl.dying || !this.inCamera) return;
    
    let x = this.pos.x;
    let y = this.pos.y;
    let w = 16;
    let h = 16;

    if(pl.pos.x+pl.width/2 >= x && pl.pos.x-pl.width/2 <= x+w &&
        pl.pos.y >= y && pl.pos.y-pl.height <= y+h ) {

        // Create message
        msg.createSelf("LEARNED SKILL\n" + String(this.id) + "!\nHOORAY.");

        // Deposit self
        this.exist = false;

        // Make player learn a skill
        pl.skills[this.id] = true;
    }
}


// Draw
Disc.prototype.draw = function(g, stage, cam) {

    if(!this.exist || !this.inCamera) return;

    // Draw sprite
    this.spr.draw(g, g.bitmaps.disc, this.pos.x, this.pos.y);

    if(cam.moving) {

        this.spr.draw(g, g.bitmaps.disc, 
            this.pos.x + stage.width, 
            this.pos.y);
    }
}
