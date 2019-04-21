// Stage
// (c) 2019 Jani Nykänen


// A dying brick
let DyingBrick = function() {

    this.exist = false;
    this.spr = new AnimatedSprite(16, 16);
    this.pos = new Vec2();
}


// Create a dying brick
DyingBrick.prototype.createSelf = function(x, y) {

    this.exist = true;
    this.pos.x = x;
    this.pos.y = y;
    this.spr.frame = 15-4;
    this.spr.row = 7;
    this.count = 0;
}


// Update a dying brick
DyingBrick.prototype.update = function(tm) {

    const ANIM_SPEED = 6;

    if(!this.exist) return;
    this.spr.animate(7, 15-4, 16, ANIM_SPEED, tm);
    if(this.spr.frame == 16) {

        this.exist = false;
    }
}


// Draw a dying brick
DyingBrick.prototype.draw = function(g) {

    if(!this.exist) return;
    this.spr.draw(g, g.bitmaps.tileset, this.pos.x, this.pos.y);
}


// Constructor
let Stage = function(docs) {

    const DYING_BRICK_COUNT = 4;

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
    this.surfY = this.tmap.height*16 - 144 - 16;

    // Initialize dying bricks
    this.bricks = new Array(DYING_BRICK_COUNT);
    for(let i = 0; i < this.bricks.length; ++ i) {

        this.bricks[i] = new DyingBrick();
    }

    // Feather count
    this.featherCount = 0;
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


// Create a dying brick
Stage.prototype.createDyingBrick = function(x, y) {

    // Find a brick that is not active
    let b = null;
    for(let i = 0; i < this.bricks.length; ++ i) {

        if(!this.bricks[i].exist) {

            b = this.bricks[i];
            break;
        }
    }
    if(b == null) return;

    // Create brick
    b.createSelf(x, y);
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

    // Update dying bricks
    for(let i = 0; i < this.bricks.length; ++ i) {

        this.bricks[i].update(tm);
    }
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

    // Draw dying bricks
    for(let i = 0; i < this.bricks.length; ++ i) {

        this.bricks[i].draw(g);
    }
}


// Get enemy collisions
Stage.prototype.enemyCollision = function(e) {

    const COL_OFF = 2;

    let sx = ((e.pos.x/16) | 0) - 2;
    let sy = ((e.pos.y/16) | 0) - 2;
    let ex = sx + 5;
    let ey = sy + 5;

    // Go though tiles and find solid
    // tiles
    let s;
    for(let y = sy; y <= ey; ++ y) {

        for(let x = sx; x <= ex; ++ x) {
            
            s = this.checkSolid(x, y);
            if(s <= 0) {

                if(!e.onGround || s < -1) continue;

                // Special collision for ground enemies
                if(
                  (
                   e.speed.x < 0 && 
                    this.checkSolid(x+1, y) <= 0 &&
                   this.checkSolid(x+1, y+1) > 0 &&
                   this.checkSolid(x, y+1) <= 0) 
                   ||
                   (
                   e.speed.x > 0 &&    
                   this.checkSolid(x-1, y) <= 0 &&
                   this.checkSolid(x-1, y+1) > 0 &&
                   this.checkSolid(x, y+1) <= 0)  
                   ) {

                    e.solidCollision(x*16+COL_OFF, y*16+COL_OFF, 
                        16-COL_OFF*2, 16-COL_OFF*2);
                }

                continue;
            }

            if(s == 1 || s == 2 || s == 4) {

                e.solidCollision(x*16+COL_OFF, y*16+COL_OFF, 
                    16-COL_OFF*2, 16-COL_OFF*2);
            }

        }
    }
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

            if(s == 1 || s == 2 || s == 4) {

                // Floor collision
                if(s == 2 || this.checkSolid(x, y-1) != s) {

                    if(pl.floorCollision(x*16, y*16, 16, tm) &&
                       pl.thwomping && 
                       s == 4) {

                        // Remove tile
                        this.tmap.setTile(0, 0, x, y);
                        // Create a dying brick
                        this.createDyingBrick(x*16, y*16);
                    }
                }

                // Other collision, not for type 2 colliders
                if(s != 2) {

                    // Ceiling collision
                    if(this.checkSolid(x, y+1) != s) {

                        pl.ceilingCollision(x*16, (y+1)*16, 16, tm);
                    }
                    // Wall collision, right
                    let collided = false;
                    if(this.checkSolid(x-1, y) != s) {

                        collided = pl.wallCollision(1, x*16, y*16, 16, tm);
                    }
                    // Wall collision, left
                    if(this.checkSolid(x+1, y) != s) {

                        collided = collided || 
                            pl.wallCollision(-1, (x+1)*16, y*16, 16, tm);
                    }

                    if(collided && s == 4 && pl.skills[6]) {

                        // Remove tile
                        this.tmap.setTile(0, 0, x, y);
                        // Create a dying brick
                        this.createDyingBrick(x*16, y*16);
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


// Parse map for objects
Stage.prototype.parseObjects = function(game) {

    let t;
    for(let y = 0; y < this.tmap.height; ++ y) {

        for(let x = 0; x < this.tmap.width; ++ x) {

            t = this.tmap.getTile(1, x, y)-128;
            if(t <= 0)
                continue;
                
            if(t < 3) {
                switch(t) {

                // Player
                case 1:
                    game.player = new Player(x*16+8, (y+1)*16);
                    break;  

                // Feather
                case 2:
                    game.feathers.push(new Feather(x*16, y*16));
                    ++ this.featherCount;
                    break;  


                default:
                    break;
                };
            }
            // Enemies
            else if(t < 9) {

                game.enemies.push(new Enemy(x*16+8, (y+1)*16, t-3));
            } 
            // Disc
            else if(t < 17) {

                game.discs.push(new Disc(x*16, y*16, t-9));
            }
            else if(t == 17) {

                game.donut = new Donut(x*16, (y+1)*16 + 8);
            }
        }
    }
}
