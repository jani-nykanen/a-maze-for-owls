// A disc
// (c) 2019 Jani Nykänen


// Messages
const MESSAGES = [

    "YOU LEARN: WALK.\n"+
    "USE \1 AND \2 TO\n"+
    "WALK.",
    
    "YOU LEARN: JUMP.\n"+
    "PRESS Z TO JUMP.",
    
    "YOU LEARN: DOUBLE JUMP.\n"+
    "PRESS Z ON AIR TO\n"+
    "PERFORM THE\n"+
    "DOUBLE JUMP.",
    
    "YOU LEARN: FLAP.\n"+
    "HOLD Z TO REDUCE YOUR\n"+
    "LANDING SPEED.",
    
    "YOU LEARN: SWIM.\n"+
    "THE WATER KILLS YOU\n"+
    "NO LONGER.",
    
    "YOU LEARN: HEAD THUMP.\n"+
    "PRESS Z AND \3 WHILE\n"+
    "ON AIR TO PERFORM\n"+
    "THE HEAD THUMP."
    ,
    
    "YOU LEARN: DIG.\n"+
    "YOU CAN NOW BREAK\n"+
    "BRICKS HORIZONTALLY\n"+
    "BY TOUCHING THEM."
    
    ];
    


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

        // Create a message
        msg.createSelf(MESSAGES[this.id]);

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
