// Game secene
// (c) 2019 Jani Nykänen


// Constructor
let Game = function() {

    this.name = "game";

    // Create components that do not
    // require assets
    this.cam = new Camera(0, 0);
}


// Initialize
Game.prototype.init = function(evMan) {

    // Implement
}


// On load
Game.prototype.onLoad = function(assets) {

    // Create stage
    this.stage = new Stage(assets.documents);
    // Create player
    this.player = new Player(192/2, 144/2);
}


// Update
Game.prototype.update = function(evMan, tm) {

    // Update camera
    this.cam.update(tm, this.stage.tmap);

    // Update player
    this.player.update(this.cam, evMan, tm);
    // Update stage
    this.stage.update(tm);
}


// Draw
Game.prototype.draw = function(g) {

    // Reset camerea
    g.setTranslation(0, 0);

    // Draw stage
    this.stage.draw(this.cam, g);
    // Draw player
    this.player.draw(g);
}
