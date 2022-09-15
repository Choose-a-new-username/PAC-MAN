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
        if(!AI.collision2(this.x+(this.w/2),this.y+(this.w/2),1,1,pacman.x,pacman.y+PACMAN_HEIGHT,PACMAN_WIDTH,PACMAN_HEIGHT))
            return false;
        pacman.score += 10;
        if(munch_b){MUS_MUNCH_1.currentTime = 0;MUS_MUNCH_2.pause();MUS_MUNCH_1.play();munch_b=false;}else{MUS_MUNCH_2.currentTime = 0;MUS_MUNCH_1.pause();MUS_MUNCH_2.play();munch_b=true;}
        return true;
    }
    draw() {
        ctx.drawImag(THE_SPRITE_WE_USE_FOR_THE_DOTS,Math.floor(this.x/CELL_SIZE)*CELL_SIZE+OFFSET[1],Math.ceil(this.y/CELL_SIZE-1)*CELL_SIZE+OFFSET[0],CELL_SIZE,CELL_SIZE,0,0,8,8)
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
        if(!AI.collision2(this.x+(this.w/2),this.y+(this.w/2),1,1,pacman.x,pacman.y+PACMAN_HEIGHT,PACMAN_WIDTH,PACMAN_HEIGHT))
            return false;
        pacman.score += 50;
        ghostmanager.INKY.flip();
        ghostmanager.BLINKY.flip();
        ghostmanager.PINKY.flip();
        ghostmanager.CLYDE.flip();
        for(const i of Object.keys(ghostmanager)){
            ghostmanager[i].x = Math.round(ghostmanager[i].x / CELL_SIZE) * CELL_SIZE;
            ghostmanager[i].y = Math.round(ghostmanager[i].y / CELL_SIZE) * CELL_SIZE;
        }
        Object.keys(ghostmanager).forEach(i=>ghostmanager[i].scared = time.times.length * getAt(AI.asdfasdfhajklhajkl,level));
        return true;
    }
    draw() {
        if(time.secrettick%30<15)
            ctx.drawImag(THE_SPRITE_WE_USE_FOR_THE_DOTS,(Math.floor(this.x/CELL_SIZE))*CELL_SIZE+OFFSET[1],Math.ceil(this.y/CELL_SIZE-1)*CELL_SIZE+OFFSET[0],CELL_SIZE,CELL_SIZE,16,0,8,8)
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
class medium_pellet extends object {
    behavior() {
        if(!AI.collision2(this.x+(this.w/2),this.y+(this.w/2),1,1,pacman.x,pacman.y+PACMAN_HEIGHT,PACMAN_WIDTH,PACMAN_HEIGHT))
            return false;
        pacman.score += 25;
        if(munch_b){MUS_MUNCH_1.currentTime = 0;MUS_MUNCH_2.pause();MUS_MUNCH_1.play();munch_b=false;}else{MUS_MUNCH_2.currentTime = 0;MUS_MUNCH_1.pause();MUS_MUNCH_2.play();munch_b=true;}
        return true;
    }
    draw() {
        if(time.secrettick%10<5)
            ctx.drawImag(THE_SPRITE_WE_USE_FOR_THE_DOTS,(Math.floor(this.x/CELL_SIZE))*CELL_SIZE+OFFSET[1],Math.ceil(this.y/CELL_SIZE-1)*CELL_SIZE+OFFSET[0],CELL_SIZE,CELL_SIZE,8,0,8,8)
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