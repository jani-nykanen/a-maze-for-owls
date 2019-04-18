// A feather
// (c) 2019 Jani Nykänen


// Constructor
let Feather = function(x, y) {

    this.pos = new Vec2(x, y);
    this.exist = true;
    this.waveTimer = Math.random() * Math.PI*2;
    this.inCamera = false;
}


// Update
Feather.prototype.update = function(tm, cam) {

    const WAVE_SPEED = 0.075;

    if(!this.exist) return;

    // Is in camera
    this.inCamera = 
        cam.moving || (
        this.pos.x+16 > cam.pos.x  && 
        this.pos.x < cam.pos.x+192 &&
        this.pos.y+16 > cam.pos.y  && 
        this.pos.y < cam.pos.y+144);

    if(!this.inCamera)
        return;

    // Update wave
    this.waveTimer += WAVE_SPEED * tm;
    this.waveTimer %= Math.PI*2;
}


// Player collision
Feather.prototype.playerCollision = function(pl) {

    if(!this.exist || pl.dying || !this.inCamera) return;
    
    let x = this.pos.x;
    let y = this.pos.y;
    let w = 16;
    let h = 16;

    if(pl.pos.x+pl.width/2 >= x && pl.pos.x-pl.width/2 <= x+w &&
        pl.pos.y >= y && pl.pos.y-pl.height <= y+h ) {

        // Deposit self
        this.exist = false;
    }
}


// Draw
Feather.prototype.draw = function(g, stage, cam) {

    const AMPLITUDE = 3;

    if(!this.exist || !this.inCamera) return;

    // Draw feather
    g.drawBitmap(g.bitmaps.feather, 
        this.pos.x,
        this.pos.y + Math.sin(this.waveTimer)*AMPLITUDE);

    if(cam.moving) {

        g.drawBitmap(g.bitmaps.feather, 
            this.pos.x + stage.width,
            this.pos.y + Math.sin(this.waveTimer)*AMPLITUDE);
    }
}
