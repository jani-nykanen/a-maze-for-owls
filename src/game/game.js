// Game secene
// (c) 2019 Jani Nykänen


// Constructor
let Game = function() {

    this.name = "game";
}


// Initialize
Game.prototype.init = function(evMan) {

    // Create components that do not
    // require assets
    this.cam = new Camera(0, 0);

    // Initialize arrays
    this.discs = [];
}


// On load
Game.prototype.onLoad = function(assets) {

    // Create stage
    this.stage = new Stage(assets.documents);
    // Parse stage
    this.stage.parseObjects(this);
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

        // Update discs
        for(let i = 0; i < this.discs.length; ++ i) {

            this.discs[i].update(tm);
            this.discs[i].playerCollision(this.player);
        }
    }
    // Specific behavior if camera moving
    else {

        this.player.moveCameraActive(this.stage, tm);
    }
}


// Draw
Game.prototype.draw = function(g) {

    // Reset camerea
    g.setTranslation(0, 0);

    // Draw stage
    this.stage.draw(this.cam, g);

     // Draw discs
    for(let i = 0; i < this.discs.length; ++ i) {

        this.discs[i].draw(g);
    }

    // Draw player
    this.player.draw(g, this.stage, this.cam);
}
