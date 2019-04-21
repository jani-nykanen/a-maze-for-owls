// The ending scene
// (c) 2019 Jani Nykänen


const ENDING_CHARACTER_TIME = 5;
const ENDING_WAIT = 300;

// Text
const ENDING_TEXT = 
"WITH THE POWER OF\n"+
"ANCESTRAL FEATHERS\n" +
"YOU ASCEND THE SKY\n" +
"OF THE ELDER OWLS.\n" +
 "\n" +
"BUT IT IS TOO LATE:\n" +
"EVERYONE IS GONE\n" +
"AND THE SKY IS EMPTY.\n" +
"\n" +
"AND YOU... YOU ARE\n" +
"ALONE.";


// Constructor
let Ending = function() {

    this.name = "ending";
    
    // Character timer
    this.ctime = ENDING_CHARACTER_TIME;
    // Character count
    this.ccount = 0;

    // Phase
    this.phase = 0;
    // Wait time
    this.waitTime = 0;
}


// Initialize
Ending.prototype.init = function(evMan) {

}


// On load
Ending.prototype.onLoad = function(assets) {

}


// Update
Ending.prototype.update = function(evMan, tm) {

    if(evMan.transition.active ||
        this.phase == 1) return;

    // Update character timer
    if(this.ccount < ENDING_TEXT.length) {

        this.ctime -= 1.0 * tm;
        if(this.ctime <= 0) {

            this.ctime += ENDING_CHARACTER_TIME;
            ++ this.ccount;
        }

    }
    else {

        // Update timer
        this.waitTime += 1.0 * tm;

        // Check enter or Z or wait time
        if( (evMan.vpad.buttons.start.state == State.Pressed ||
            evMan.vpad.buttons.fire1.state == State.Pressed ) ||
            this.waitTime >= ENDING_WAIT ) {

            evMan.transition.activate(Fade.In, 1.0, () => {this.phase=1;},
                {r: 255, g: 255, b: 255}, 4);
        }
    }
}


// Draw
Ending.prototype.draw = function(g) {

    const POS_X = 16;
    const POS_Y = 28;

    if(this.phase == 0) {

        g.clear(85, 85, 85);
        // Draw text
        g.drawText(g.bitmaps.font, 
            ENDING_TEXT.substr(0, this.ccount), 
            POS_X, POS_Y, 0, 0);

    }
    else {

        g.clear(0, 0, 0);
        g.drawBitmap(g.bitmaps.theEnd,
            g.canvas.width/2-g.bitmaps.theEnd.width/2,
            g.canvas.height/2-g.bitmaps.theEnd.height/2);
    }
}
