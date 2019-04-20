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


// Draw feather count
Game.prototype.drawFeatherCount = function(g) {

    const YOFF = 1;
    const WIDTH = 44;
    const HEIGHT = 10;
    const XPOS = 20;
    const FEATHER_X = 1;

    let str = String(this.player.feathers) + "/" + 
        String(this.stage.featherCount);

    // Draw bar outlines
    let y = g.canvas.height-14;
    g.fillRect(XPOS-2, y-2, WIDTH+4, HEIGHT+4, {r:255, g:255, b:255});
    g.fillRect(XPOS-1, y-1, WIDTH+2, HEIGHT+2, {r:0, g:0, b:0});
    g.fillRect(XPOS, y, WIDTH, HEIGHT, {r:0, g:0, b:0});

    // Draw bar
    let t = this.player.feathers / this.stage.featherCount;
    let w = ((WIDTH-1)*t)|0;
    if(w > WIDTH-1)
        w = WIDTH-1;
    g.fillRect(XPOS, y, w, HEIGHT, {r:85, g:85, b:85});
    g.fillRect(XPOS, y+1, w, HEIGHT/2, {r:170, g:170, b:170});
    if(w > 0)
        g.fillRect(XPOS+w, y, 1, HEIGHT, {r:85, g:85, b:85});

    // Draw text
    g.drawText(g.bitmaps.font,
        str, 
        XPOS+WIDTH/2, y+YOFF, 
        0, 0, true);
    
    // Draw feather icon
    g.drawBitmap(g.bitmaps.feather, FEATHER_X, y+HEIGHT/2 - 8);
}


// Draw pause screen
Game.prototype.drawPause = function(g) {

    const WIDTH = 96;
    const HEIGHT = 16;

    let x = g.canvas.width/2 - WIDTH/2;
    let y = g.canvas.height/2 - HEIGHT/2;

    g.fillRect(x-2, y-2, WIDTH+4, HEIGHT+4, {r:255, g:255, b:255});
    g.fillRect(x-1, y-1, WIDTH+2, HEIGHT+2, {r:0, g:0, b:0});
    g.fillRect(x, y, WIDTH, HEIGHT, {r:85, g:85, b:85});

    g.drawText(g.bitmaps.font, "GAME PAUSED", 
        x+WIDTH/2, y+HEIGHT/2-4, 0, 0, true);
}


// Initialize
Game.prototype.init = function(evMan) {

    // Set initial values
    this.paused = false;
    
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

    if(evMan.transition.active) return;

    // Update message
    if(this.msg.active) {

        this.msg.update(evMan, tm);
        return;
    }

    // Check pause
    if(evMan.vpad.buttons.start.state == State.Pressed) {
            
        this.paused = !this.paused;
    }
    if(this.paused) return;

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

    // Draw feather count
    this.drawFeatherCount(g);

    // Draw pause
    if(this.paused)
        this.drawPause(g);
}
