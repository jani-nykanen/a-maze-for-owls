// Camera
// (c) 2019 Jani Nykänen

// Initial move time
const INITIAL_MOVE_TIME = 30;


// Constructor
let Camera = function(x, y) {

    this.pos = new Vec2(x, y);
    this.startPos = this.pos.copy();
    this.target = this.pos.copy();

    // Move timer
    this.moveTimer = 0;
    // Is moving
    this.moving = false;
}


// Move
Camera.prototype.move = function(dx, dy) {

    if(this.moving)
        return;

    this.startPos = this.pos.copy();
    this.target.x = this.pos.x + dx * 192;
    this.target.y = this.pos.y + dy * 144;

    this.moveTimer = INITIAL_MOVE_TIME;
    this.moving = true;
}


// Update
Camera.prototype.update = function(tm,  tmap) {

    if(!this.moving)
        return;

    // Update movement
    let t = this.moveTimer / INITIAL_MOVE_TIME;
    this.pos.x = (this.startPos.x*t + (1-t)*this.target.x) | 0;
    this.pos.y = (this.startPos.y*t + (1-t)*this.target.y) | 0;

    // Update timer
    this.moveTimer -= 1.0 * tm;
    if(this.moveTimer <= 0.0) {

        this.pos = this.target.copy();
        this.pos.x |= 0;
        this.pos.y |= 0;
        this.moving = false;

        // Loop
        if(tmap != null) {

            this.pos.x = negMod(this.pos.x, tmap.width*16);
            this.pos.y = negMod(this.pos.y, tmap.height*16);
        }
    }
}


// Use camera
Camera.prototype.use = function(g) {

    g.translate(-this.pos.x, -this.pos.y);
}
