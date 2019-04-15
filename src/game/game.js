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
}


// Update
Game.prototype.update = function(evMan, tm) {

    // Update stage
    this.stage.update(tm);
}


// Draw
Game.prototype.draw = function(g) {

    // Reset camerea
    g.setTranslation(0, 0);

    // Draw stage
    this.stage.draw(this.cam, g);
}
