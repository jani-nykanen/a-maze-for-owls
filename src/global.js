// The default global scene
// Update & draw are called every frame
// (c) Insert your name here

// Global scene
let Global = function() {

    this.name = "global";
}


// Initialize
Global.prototype.init = function(evMan) {

    // Fade in
    evMan.transition.activate(Fade.Out, 1.0, null, null, 4);
}


// On load
Global.prototype.onLoad = function(assets) {

    // Implement
}


// Update
Global.prototype.update = function(evMan, tm) {

    // Implement
}


// Draw
Global.prototype.draw = function(g) {

    // Implement
}
