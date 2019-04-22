// The default global scene
// Update & draw are called every frame
// (c) Insert your name here

// Global scene
let Global = function() {

    this.name = "global";
}


// Initialize
Global.prototype.init = function(evMan) {

    // ...
    this.evMan = evMan;
}


// On load
Global.prototype.onLoad = function(assets) {

    // TODO: Fix this in the engine!
    this.evMan.sounds = assets.audio;
}


// Update
Global.prototype.update = function(evMan, tm) {

    // Implement
}


// Draw
Global.prototype.draw = function(g) {

    // Implement
}
