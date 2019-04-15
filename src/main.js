// A template main file
// (c) Insert your name here


// The main function
let main = function() {

    // Assets
    let assetContent = {

        // Bitmaps
        bitmapPath: "assets/bitmaps/",
        bitmaps: {

            background: "background.png",
            clouds: "clouds.png",
            tileset: "tileset.png",
            trees: "trees.png"
        },

        // Documents
        docPath: "assets/maps/",
        documents: {

            map: "map.tmx"
        }
    }

    // Gamepad config
    let gamepadConfig = {

        // Fill this
    }
    // Derired framerate
    let framerate = 30;


    // Create application core
    let c = new Core();

    // Add scenes
    // Help: addScene(scene, makeActive=false, makeGlobal=false)
    c.addScene(new Game(), true);
    c.addScene(new Global(), false, true);
    // Add more scenes here

    // Run application
    c.run(framerate, assetContent, gamepadConfig);
}
