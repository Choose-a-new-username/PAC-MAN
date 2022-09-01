class object {
    constructor(x,y,w,h,name) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.name = name;
    }
}
class pellet extends object {
    behavior() {
        if(!AI.collision2(this.x+(this.w/2),this.y+(this.w/2),1,1,pacman.x-13,pacman.y+PACMAN_HEIGHT-13,PACMAN_WIDTH+26,PACMAN_HEIGHT+26))
            return false;
        pacman.score += 10;
        if(munch_b){MUS_MUNCH_1.currentTime = 0;MUS_MUNCH_2.pause();MUS_MUNCH_1.play();munch_b=false;}else{MUS_MUNCH_2.currentTime = 0;MUS_MUNCH_1.pause();MUS_MUNCH_2.play();munch_b=true;}
        return true;
    }
    draw() {
        if(ctx.fillStyle != "#ffffff")ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x+OFFSET[1],this.y+OFFSET[0],this.w,this.h);
    }
    constructor(x,y) {
        super(
            x,
            y,
            PELLET_SIZE,
            PELLET_SIZE,
            "pellet"
        );
    }
}
class power_pellet extends object {
    behavior() {
        if(!AI.collision2(this.x+(this.w/2),this.y+(this.w/2),1,1,pacman.x-13,pacman.y+PACMAN_HEIGHT-13,PACMAN_WIDTH+26,PACMAN_HEIGHT+26))
            return false;
        pacman.score += 50;
        ghostmanager.BLINKY.scared = 60 * AI.asdfasdfhajklhajkl[Math.clamp(level,0,18)];
        ghostmanager.PINKY.scared = 60 * AI.asdfasdfhajklhajkl[Math.clamp(level,0,18)];
        ghostmanager.INKY.scared = 60 * AI.asdfasdfhajklhajkl[Math.clamp(level,0,18)];
        ghostmanager.CLYDE.scared = 60 * AI.asdfasdfhajklhajkl[Math.clamp(level,0,18)];
        // play power pellet noise
        // will ad in future
        return true;
    }
    draw() {
        if(ctx.fillStyle != "#ffffff")ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x+OFFSET[1],this.y+OFFSET[0],this.w,this.h);
    }
    constructor(x,y) {
        super(
            x,
            y,
            PELLET_SIZE/0.5,
            PELLET_SIZE/0.5,
            "power_pellet"
        );
    }
}
var objectmanager = {objects:[]};
objectmanager.update = function () {
    for(i in this.objects) 
        if(this.objects[i].behavior())
            this.objects.splice(i,1);
}
for(i in TILEMAP) 
    for(j in TILEMAP[i]) 
        if(TILEMAP[i][j] === 0) 
            objectmanager.objects.push(new pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2)));
        else if(TILEMAP[i][j] === 3) 
            objectmanager.objects.push(new power_pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE)));
            