// Toggle audio screen
// (c) 2019 Jani Nykänen


// Constructor
let ToggleAudio = function() {

    this.name = "toggle_audio";

    // Cursor position
    this.cpos = 0;
}


// Draw a box
ToggleAudio.prototype.drawBox = function(g, x, y, w, h) {

    g.fillRect(x-2, y-2, w+4, h+4, {r:255, g:255, b:255});
    g.fillRect(x-1, y-1, w+2, h+2, {r:0, g:0, b:0});
    g.fillRect(x, y, w, h, {r:85, g:85, b:85});
}


// Initialize
ToggleAudio.prototype.init = function(evMan) {

}


// On load
ToggleAudio.prototype.onLoad = function(assets) {

    // ...
}


// Update
ToggleAudio.prototype.update = function(evMan, tm) {

    // Check key presses
    if(evMan.vpad.buttons.start.state == State.Pressed ||
       evMan.vpad.buttons.fire1.state == State.Pressed ) {

        // Change scene to intro
        evMan.changeScene("intro");
        // Fade in
        evMan.transition.activate(Fade.Out, 1.0, null, null, 4);

        // Toggle audio
        evMan.audio.toggle(this.cpos == 0);

        // Play sound
        evMan.audio.playSample(evMan.sounds.select, 0.5);
    }

    // Update cursor
    let s = evMan.vpad.stick;
    let d = evMan.vpad.stickDelta;
    if( (s.y < 0 && d.y < 0 ) || (s.y > 0 && d.y > 0) ) {

        this.cpos = this.cpos == 0 ? 1 : 0;
        // Play sound
        evMan.audio.playSample(evMan.sounds.choose, 0.5);
    }
}


// Draw
ToggleAudio.prototype.draw = function(g) {

    const BIG_WIDTH = 134;
    const BIG_HEIGHT = 48;
    const BIG_Y = 16;
    const BIG_X_OFF = 2;
    const BIG_Y_OFF = 4;

    const SMALL_WIDTH = 36;
    const SMALL_HEIGHT = 24;
    const SMALL_X = 32;
    const SMALL_Y = 72;
    const SMALL_Y_OFF = 4;

    const TEXT_XOFF = 0;
    const TEXT_YOFF = 2;

    const BIG_TEXT = 
        "WOULD YOU LIKE\n"+
        "TO ENABLE AUDIO?\n"+
        "PRESS ENTER TO\n"+
        "CONFIRM.";

    // Clear
    g.clear(0, 0, 0);

    // Draw boxes
    let w = g.canvas.width;
    this.drawBox(
        g,
        w/2-BIG_WIDTH/2,
        BIG_Y,
        BIG_WIDTH,
        BIG_HEIGHT
    );
    this.drawBox(
        g,
        SMALL_X,
        SMALL_Y,
        SMALL_WIDTH,
        SMALL_HEIGHT
    );

    // Draw text
    g.drawText(g.bitmaps.font, BIG_TEXT, 
        w/2-BIG_WIDTH/2+BIG_X_OFF, BIG_Y+BIG_Y_OFF, 
        TEXT_XOFF, TEXT_YOFF);

    str = (this.cpos == 0 ? "\6" : "\0") + "YES";
    g.drawText(g.bitmaps.font, str,
        SMALL_X, SMALL_Y+SMALL_Y_OFF, 0, 0);

    str = (this.cpos == 1 ? "\6" : "\0") + "NO";
    g.drawText(g.bitmaps.font, str,
        SMALL_X, 
        SMALL_Y+SMALL_Y_OFF+(8+TEXT_YOFF),
        0, 0);    
}
