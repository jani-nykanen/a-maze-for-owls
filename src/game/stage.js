// Stage
// (c) 2019 Jani Nykänen


// Constructor
let Stage = function(docs) {

    // Set defaults
    this.cloudPos = 0;
    this.waterPos = 0;
    this.wave = 0;

    // Create tilemap
    this.tmap = new Tilemap(docs.map);
    // Create collision map
    this.collisions = new Tilemap(docs.collisions);

    // Dimensions
    this.width = this.tmap.width*16;
    this.height = this.tmap.height*16;

    // Water surface position
    this.surfY = this.tmap.height*16 - 144 - 16;;
}


// Check solid state
Stage.prototype.checkSolid = function(x, y) {
    
    let t = this.tmap.getTile(0, x, y);
    -- t;
    let dx = (t % 16) | 0;
    let dy = (t/16) | 0;

    return this.collisions.getTile(0, dx, dy);
}


// Draw water
Stage.prototype.drawWater = function(cam, g) {

    const WAVE_AMPL = 2;

    // Draw surface
    if(cam.pos.y+144 >= this.surfY && cam.pos.y <= this.surfY+16) {

        let startx = ((cam.pos.x/16) | 0) -1;   
        let ex = startx + (192/16) + 2;

        let yplus = ( (Math.sin(this.wave)+1) * WAVE_AMPL) | 0;

        for(let x = startx; x <= ex; ++ x) {

            g.drawBitmapRegion(g.bitmaps.tileset, 0, 48, 16, 16,
                x*16 - this.waterPos, this.surfY+yplus);
        }
    }

    // Draw black background
    if(cam.pos.y+144 >= this.surfY+16) {

        g.fillRect(cam.pos.x, this.surfY+16, 192, 144,
            {r: 0, g: 0, b: 0});
    }
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
    const WATER_SPEED = 0.125;
    const WAVE_SPEED = 0.040;

    // Update clouds
    this.cloudPos += CLOUD_SPEED * tm;
    if(this.cloudPos >= 192)
        this.cloudPos -= 192;

    // Update water
    this.waterPos += WATER_SPEED * tm;
    if(this.waterPos >= 16)
        this.waterPos -= 16;
    // Update waves
    this.wave += WAVE_SPEED*tm;
    if(this.wave >= 2*Math.PI) 
        this.wave -= 2*Math.PI;
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
    // Draw water
    this.drawWater(cam, g);
    // Draw tilemap
    this.drawTilemap(cam, g);
}


// Get player collisions
Stage.prototype.playerCollision = function(pl, tm) {

    const HURT_OFF = 8;

    let sx = ((pl.pos.x/16) | 0) - 2;
    let sy = ((pl.pos.y/16) | 0) - 2;
    let ex = sx + 5;
    let ey = sy + 5;

    // Go though tiles and find solid
    // tiles
    let s;
    for(let y = sy; y <= ey; ++ y) {

        for(let x = sx; x <= ex; ++ x) {
            
            s = this.checkSolid(x, y);
            if(s <= 0) continue;

            if(s == 1 || s == 2) {

                // Floor collision
                if(s == 2 || this.checkSolid(x, y-1) != 1) {

                    pl.floorCollision(x*16, y*16, 16, tm);
                }

                // Other collision, not for type 2 colliders
                if(s == 1) {

                    // Ceiling collision
                    if(this.checkSolid(x, y+1) != 1) {

                        pl.ceilingCollision(x*16, (y+1)*16, 16, tm);
                    }
                    // Wall collision, right
                    if(this.checkSolid(x-1, y) != 1) {

                        pl.wallCollision(1, x*16, y*16, 16, tm);
                    }
                    // Wall collision, left
                    if(this.checkSolid(x+1, y) != 1) {

                        pl.wallCollision(-1, (x+1)*16, y*16, 16, tm);
                    }
                }
            }
            // Hurt collision
            else if(s == 3) {   

                let dx = x*16;
                let dy = y*16;
                let dw = 16;
                let dh = 16;

                // Modify hitbox
                let t = this.tmap.getTile(0, x, y) -1;
                t -= 8 + 6*16;
                t %= 4;
                if(t == 0) {

                    dy += HURT_OFF;
                    dh -= HURT_OFF;
                }
                if(t == 2) {

                    dh -= HURT_OFF;
                }
                if(t == 3) {

                    dx += HURT_OFF;
                    dw -= HURT_OFF;
                }
                if(t == 1) {

                    dw -= HURT_OFF;
                }
                

                pl.hurtCollision(dx, dy, dw, dh);
            }
        }
    }
}
