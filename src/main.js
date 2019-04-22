// Main
// (c) 2019 Jani Nykänen


// The main function
let main = function() {

    // Assets
    let assetContent = {

        // Bitmaps
        bitmapPath: "assets/bitmaps",
        bitmaps: {

            background: "background.png",
            clouds: "clouds.png",
            tileset: "tileset.png",
            trees: "trees.png",
            owl: "owl.png",
            disc: "disc.png",
            font: "font.png",
            feather: "feather.png",
            enemies: "enemies.png",
            donut: "donut.png",
            theEnd: "the_end.png",
            logo: "logo.png",
            intro: "intro.png",
        },

        // Documents
        docPath: "assets/maps",
        documents: {

            map: "map.tmx",
            collisions: "collisions.tmx",
        }
    }

    // Gamepad config
    let gamepadConfig = {

        buttons: {

            fire1: 90,
            start: 13,
            cancel: 27,
           // debug: 80, // TODO: REMOVE!
        }
    }
    // Desired framerate
    let framerate = 30;


    // Create application core
    let c = new Core();

    // Add scenes
    c.addScene(new ToggleAudio(), true);
    c.addScene(new Intro(), false);
    c.addScene(new Title(), false);
    c.addScene(new Game(), false);
    c.addScene(new Story(), false);
    c.addScene(new Ending(), false);
    c.addScene(new Global(), false, true);

    // Run application
    c.run(framerate, assetContent, gamepadConfig);
}
