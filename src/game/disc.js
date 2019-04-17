// A disc
// (c) 2019 Jani Nykänen


// Constructor
let Disc = function(x, y, id) {

    this.pos = new Vec2(x, y);
    this.spr = new AnimatedSprite(16, 16);
    this.exist = true;
    this.id = id;
}


// Update
Disc.prototype.update = function(tm) {

    const ANIM_SPEED = 4;

    if(!this.exist) return;

    // Animate
    this.spr.animate(0, 0, 5, ANIM_SPEED, tm);
}


// Player collision
Disc.prototype.playerCollision = function(pl) {

    if(!this.exist || pl.dying) return;
    
    let x = this.pos.x;
    let y = this.pos.y;
    let w = 16;
    let h = 16;

    if(pl.pos.x+pl.width/2 >= x && pl.pos.x-pl.width/2 <= x+w &&
        pl.pos.y >= y && pl.pos.y-pl.height <= y+h ) {

        console.log("Learned skill " + String(this.id) + "!");

        // Deposit self
        this.exist = false;

        // Make player learn a skill
        pl.skills[this.id] = true;
    }
}


// Draw
Disc.prototype.draw = function(g) {

    if(!this.exist) return;

    // Draw sprite
    this.spr.draw(g, g.bitmaps.disc, this.pos.x, this.pos.y);
}
