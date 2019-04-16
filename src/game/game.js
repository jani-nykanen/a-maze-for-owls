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
    this.player = new Player(192/2-8, 144/2 - 8);
}


// Update
Game.prototype.update = function(evMan, tm) {

    // Update camera
    this.cam.update(tm, this.stage.tmap);


    // No collision etc if camera moving
    if(!this.cam.moving) {

        // Update player
        this.player.update(this.cam, evMan, tm);
        // Player-stage collision
        this.player.stageCollision(this.stage, this.cam, tm);
        // Update stage
        this.stage.update(tm);
    }
}


// Draw
Game.prototype.draw = function(g) {

    // Reset camerea
    g.setTranslation(0, 0);

    // Draw stage
    this.stage.draw(this.cam, g);

    // Draw objects if camera not
    // moving
    if(!this.cam.moving) {

        // Draw player
        this.player.draw(g);
    }
}
