// Intro
// (c) 2019 Jani Nykänen


// Constructor
let Intro = function() {

    const WAIT_TIME = 90;

    this.name = "intro";

    // Timer
    this.timer = WAIT_TIME;
}


// Initialize
Intro.prototype.init = function(evMan) {

}


// On load
Intro.prototype.onLoad = function(assets) {

    // ...
}


// Update
Intro.prototype.update = function(evMan, tm) {

    if(evMan.transition.active) return;

    // Update timer & check keyboard
    if( ((this.timer -= 1.0 * tm) <= 0) ||
        evMan.vpad.buttons.start.state == State.Pressed ||
        evMan.vpad.buttons.fire1.state == State.Pressed ) {

        evMan.transition.activate(Fade.In, 2.0, 
            () => {evMan.changeScene("title");},
            {r: 0, g: 0, b: 0}, 4);
    }
}


// Draw
Intro.prototype.draw = function(g) {

    g.drawBitmap(g.bitmaps.intro, 0, 0);
}
