// Stage
// (c) 2019 Jani Nykänen


// Constructor
let Stage = function(docs) {

    // Set defaults
    this.cloudPos = 0;

    // Create tilemap
    this.tmap = new Tilemap(docs.map);
}


// Draw the tilemap
Stage.prototype.drawTilemap = function(cam, g) {

    let startx = ((cam.pos.x/16) | 0) -1;
    let starty = ((cam.pos.y/16) | 0) -1;
    let ex = startx + (192/16) + 2;
    let ey = starty + (144/16) + 2;

    // Draw tiles
    let tile = 0;
    let sx, sy;
    for(let x = startx; x <= ex; ++ x) {

        for(let y = starty; y <= ey; ++ y) {

            // Get tile
            tile = this.tmap.getTile(0, x, y, true);

            // Skip, if none
            if(tile <= 0)
                continue;

            // Draw tile
            -- tile;
            sx = tile % 16;
            sy = (tile / 16) | 0;
            g.drawBitmapRegion(g.bitmaps.tileset, sx*16, sy*16, 16, 16,
                x*16, y*16);
        }
    }
}


// Update stage
Stage.prototype.update = function(tm) {

    const CLOUD_SPEED = 0.25;

    // Update clouds
    this.cloudPos += CLOUD_SPEED * tm;
    if(this.cloudPos >= 192)
        this.cloudPos -= 192;
}


// Draw stage
Stage.prototype.draw = function(cam, g) {

    const CLOUD_Y = 16;

    // Draw background
    g.drawBitmap(g.bitmaps.background, 0, 0);

    // Draw clouds
    for(let i = 0; i < 2; ++ i) {

        g.drawBitmap(g.bitmaps.clouds, 
            -this.cloudPos + i*192, CLOUD_Y);
    }

    // Draw forest
    g.drawBitmap(g.bitmaps.trees, 0, 144-64);

    // Use camera
    cam.use(g);
    // Draw tilemap
    this.drawTilemap(cam, g);
}

