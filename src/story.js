// The Story scene
// (c) 2019 Jani Nykänen


const STORY_CHARACTER_TIME = 5;
const STORY_WAIT = 300;

// Text
const STORY_TEXT = 
"YOU ARE A YOUNG OWL.\n"+
"A YOUNG, SIMPLE-MINDED\n"+
"OWL. UNLIKE THE OTHER\n"+
"OWLS, YOU ARE TOO\n"+
"STUPID TO LEARN TO FLY.\n"+
"HOWEVER, RUMORS SAY\n"+
"THAT SOMEWHERE ON\n"+
"EARTH THERE EXISTS A\n"+
"MAZE FOR OWLS LIKE YOU.\n"+
"\n"+
"IF YOU GO THERE AND\n"+
"AND COLLECT ALL THE\n"+
"ANCESTRAL FEATHERS, YOU\n"+
"MIGHT LEARN TO FLY.";

// Constructor
let Story = function() {

    this.name = "story";
    
    // Character timer
    this.ctime = STORY_CHARACTER_TIME;
    // Character count
    this.ccount = 0;
    // Wait time
    this.waitTime = 0;
}


// Initialize
Story.prototype.init = function(evMan) {

}


// On load
Story.prototype.onLoad = function(assets) {

}


// Update
Story.prototype.update = function(evMan, tm) {

    if(evMan.transition.active) return;

    // Update character timer
    if(this.ccount < STORY_TEXT.length) {

        this.ctime -= 1.0 * tm;
        if(this.ctime <= 0) {

            this.ctime += STORY_CHARACTER_TIME;
            ++ this.ccount;
        }
        

    }
    else {

        // Update timer
        this.waitTime += 1.0 * tm;
    }

    // Check enter or Z or wait time
    if( (evMan.vpad.buttons.start.state == State.Pressed ||
        evMan.vpad.buttons.fire1.state == State.Pressed ) ||
        this.waitTime >= STORY_WAIT ) {

        evMan.transition.activate(Fade.In, 2.0, 
            () => {evMan.changeScene("game");},
            {r: 255, g: 255, b: 255}, 4);
    }
}


// Draw
Story.prototype.draw = function(g) {

    const POS_X = 4;
    const POS_Y = 12;

    g.clear(85, 85, 85);
    // Draw text
    g.drawText(g.bitmaps.font, 
         STORY_TEXT.substr(0, this.ccount), 
         POS_X, POS_Y, 0, 0);

}
