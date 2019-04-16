// A tilemap
// TODO: Once functioning, merge to ld-engine
// (c) 2019 Jani Nykänen


// A utility function for negative modulo
let negMod = (m, n) => {

    if(m < 0) {

        return n - (-m % n);
    }
    return m % n;
}


// Constructor
let Tilemap = function(xml) {

    let parser = new DOMParser();
    let doc = parser.parseFromString(xml,"text/xml");

    // Get dimensions
    let root = doc.getElementsByTagName("map")[0];
    this.width = String(root.getAttribute("width"));
    this.height = String(root.getAttribute("height"));
    
    // Get layers
    let data = root.getElementsByTagName("layer");
    this.layers = new Array();
    for(let i = 0; i < data.length; ++ i) {

        // Get layer data & remove newlines
        let str = data[i].getElementsByTagName("data")[0].
            childNodes[0].
            nodeValue.
            replace(/(\r\n|\n|\r)/gm, "");
        // Put to an array
        let content = str.split(",");

        // Create a layer
        this.layers.push(new Array());
        for(let j = 0; j < content.length; ++ j) {

            this.layers[i][j] = parseInt(content[j]);
        }
    }
}


// Get a tile
Tilemap.prototype.getTile = function(layer, x, y, loop) {

    // Integer positions only
    x |= 0;
    y |= 0;

    if(loop) {

        x = negMod(x, this.width);
        y = negMod(y, this.height);
    }

    if(x < 0 || y < 0 || x >= this.width || y >= this.height)
        return -1;

    return this.layers[layer][y*this.width+x];
}
