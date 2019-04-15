// Camera
// (c) 2019 Jani Nykänen

// Constructor
let Camera = function(x, y) {

    this.pos = new Vec2(x, y);
}


// Use camera
Camera.prototype.use = function(g) {

    g.translate(this.pos.x, this.pos.y);
}
