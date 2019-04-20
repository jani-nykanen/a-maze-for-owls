// Game secene
// (c) 2019 Jani Nykänen


// Constructor
let Game = function() {

    this.name = "game";
}


// Update an object
Game.prototype.updateObjects = function(arr, tm) {

    for(let i = 0; i < arr.length; ++ i) {

        arr[i].update(tm, this.cam);
        arr[i].playerCollision(this.player, this.msg);
    }
}


// Draw an object
Game.prototype.drawObjects = function(arr, g) {

    for(let i = 0; i < arr.length; ++ i) {

        arr[i].draw(g, this.stage, this.cam);
    }
}



// Initialize
Game.prototype.init = function(evMan) {

    // Create components that do not
    // require assets
    this.msg = new Message();

    // Initialize arrays
    this.discs = [];
    this.feathers = [];
    this.enemies = [];
}


// On load
Game.prototype.onLoad = function(assets) {

    // Create stage
    this.stage = new Stage(assets.documents);
    // Parse stage
    this.stage.parseObjects(this);

    // Set camera
    this.cam = new Camera(
        ((this.player.pos.x/192) | 0) * 192, 
        ((this.player.pos.y/144) | 0) * 144
    );

    // Translate player a little
    this.player.pos.y -= 32;
}


// Update
Game.prototype.update = function(evMan, tm) {

    // Update message
    if(this.msg.active) {

        this.msg.update(evMan, tm);
        return;
    }

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
        this.updateObjects(this.discs, tm);
        // Update feathers
        this.updateObjects(this.feathers, tm);
        // Update enemies
        this.updateObjects(this.enemies, tm);

        // Enemy collisions
        for(let i = 0; i < this.enemies.length; ++ i) {
            
            this.stage.enemyCollision(this.enemies[i]);
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
    this.drawObjects(this.discs, g);
    // Draw feathers
    this.drawObjects(this.feathers, g);
    // Draw enemies
    this.drawObjects(this.enemies, g);

    // Draw player
    this.player.draw(g, this.stage, this.cam);

    // Draw message
    g.setTranslation(0, 0);
    this.msg.draw(g);
}
