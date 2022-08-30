class object {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
class pellet extends object {
    behavior() {
        if(!AI.collision2(this.x+(this.w/2),this.y+(this.w/2),1,1,pacman.x-13,pacman.y+PACMAN_HEIGHT-13,PACMAN_WIDTH+26,PACMAN_HEIGHT+26))return false;
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
            PELLET_SIZE
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
            