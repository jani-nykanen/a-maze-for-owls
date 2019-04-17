// A message box
// (c) 2019 Jani Nykänen

// Appear timer
const MSG_APPEAR_TIMER = 30;


// Constructor
let Message = function() {

    this.msg = "";
    this.timer = 0;
    this.active = false;
}


// Create self
Message.prototype.createSelf = function(msg) {

    this.timer = MSG_APPEAR_TIMER;
    this.msg = msg;
    this.active = true;
}


// Update
Message.prototype.update = function(evMan, tm) {

    if(!this.active) return;

    // Update timer
    if(this.timer > 0.0) {

        this.timer -= 1.0 * tm;
    }
    else {

        // Check enter or fire1 press
        if(evMan.vpad.buttons.start.state == State.Pressed ||
           evMan.vpad.buttons.fire1.state == State.Pressed ) {

            this.active = false;
        }
    }
}


// Draw
Message.prototype.draw = function(g) {

    const WIDTH = 112;
    const HEIGHT = 48;

    const BORDER_OFF_X = 2;
    const BORDER_OFF_Y = 2;
    const XOFF = 0;
    const YOFF = 1;

    if(!this.active) return;

    // Draw box
    let t = 1.0-this.timer/MSG_APPEAR_TIMER;
    let w = WIDTH*t;
    let h = HEIGHT*t;
    let x = g.canvas.width/2 - w/2;
    let y = g.canvas.height/2 - h/2;

    // Outlines
    g.fillRect(x-2, y-2, w+4, h+4, {r: 255, g: 255, b: 255});
    g.fillRect(x-1, y-1, w+2, h+2, {r: 0, g: 0, b: 0});
    g.fillRect(x, y, w, h, {r: 85, g: 85, b: 85});

    // Draw message
    if(this.timer <= 0.0) {

        g.drawText(g.bitmaps.font, this.msg, 
            x+BORDER_OFF_X, y+BORDER_OFF_Y, 
            XOFF, YOFF);
    }
}
