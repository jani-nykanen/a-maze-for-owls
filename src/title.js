// Title screen
// (c) 2019 Jani Nykänen


const TITLE_ENTER_TIME_MAX = 60;


// Constructor
let Title = function() {

    this.name = "title";

    this.s = new Stage();

    // Enter timer
    this.enterTimer = TITLE_ENTER_TIME_MAX/2 -1;
}


// Initialize
Title.prototype.init = function(evMan) {

}


// On load
Title.prototype.onLoad = function(assets) {

    // ...
}


// Update
Title.prototype.update = function(evMan, tm) {

    const FLICKER_SPEED = 15;

    if(evMan.transition.active) {

        if(evMan.transition.mode == Fade.In) {

            this.enterTimer += FLICKER_SPEED * tm;
            this.enterTimer %= TITLE_ENTER_TIME_MAX;
        }

        return;
    }

    // Check enter or Z
    if( evMan.vpad.buttons.start.state == State.Pressed ||
         evMan.vpad.buttons.fire1.state == State.Pressed ) {

        evMan.transition.activate(Fade.In, 1.0, 
            () => {evMan.changeScene("story");},
            {r: 0, g: 0, b: 0}, 4);
    }

    // Update "stage"
    this.s.update(tm);

    // Update enter timer
    this.enterTimer += 1.0 * tm;
    this.enterTimer %= TITLE_ENTER_TIME_MAX;
}


// Draw
Title.prototype.draw = function(g) {

    const LOGO_Y = 8;
    const BG_TRANS = 32;
    const COPYRIGHT_YOFF = 9;
    const ENTER_YOFF = 40;

    g.clear(85, 85, 85);

    // Draw background
    this.s.draw(null, g, BG_TRANS);

    // Draw logo
    g.drawBitmap(g.bitmaps.logo, 0, LOGO_Y);

    // Draw copyright
    g.drawText(g.bitmaps.font, "\4 2019 JANI NYK\5NEN", 
        g.canvas.width/2, g.canvas.height-COPYRIGHT_YOFF,
        0, 0, true);
    
    // Draw "PRESS ENTER
    if(this.enterTimer >= TITLE_ENTER_TIME_MAX/2) {

        g.drawText(g.bitmaps.font, "PRESS ENTER", 
            g.canvas.width/2, g.canvas.height-ENTER_YOFF,
            0, 0, true);
    }
}
