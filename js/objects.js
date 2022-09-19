var objectmanager = {objects:[]};
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
        if((objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}).length<=174&&objectmanager.cherryeaten===0&&objectmanager.objects.filter(a=>{return a.name==="fruit"}).length===0)||(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}).length<=74&&objectmanager.cherryeaten===1&&objectmanager.objects.filter(a=>{return a.name==="fruit"}).length===0))
            objectmanager.objects.push(new fruit(CELL_SIZE*13,CELL_SIZE*17.5));
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
        if(!AI.collision2(this.x,this.y,this.w,this.h,pacman.x,pacman.y+PACMAN_HEIGHT,PACMAN_WIDTH,PACMAN_HEIGHT))
            return false;
        pacman.score += 50;
        Object.keys(ghostmanager).forEach(i=>ghostmanager[i].scared = time.times.length * getAt(AI.asdfasdfhajklhajkl,level-1));
        if(time.times.length * getAt(AI.asdfasdfhajklhajkl,level-1))
            ghostmanager.INKY.flip(),
            ghostmanager.BLINKY.flip(),
            ghostmanager.PINKY.flip(),
            ghostmanager.CLYDE.flip();
        if((objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}).length<=174&&objectmanager.cherryeaten===0&&objectmanager.objects.filter(a=>{return a.name==="fruit"}).length===0)||(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}).length<=74&&objectmanager.cherryeaten===1&&objectmanager.objects.filter(a=>{return a.name==="fruit"}).length===0))
            objectmanager.objects.push(new fruit(CELL_SIZE*13,CELL_SIZE*17.5));
        return true;
    }
    draw() {
        if(time.secrettick%30<15)
            ctx.drawImag(THE_SPRITE_WE_USE_FOR_THE_DOTS,(Math.floor(this.x/CELL_SIZE))*CELL_SIZE+OFFSET[1],Math.ceil(this.y/CELL_SIZE)*CELL_SIZE+OFFSET[0],CELL_SIZE,CELL_SIZE,16,0,8,8)
    }
    constructor(x,y) {
        super(
            x,
            y,
            CELL_SIZE,
            CELL_SIZE,
            "power_pellet"
        );
    }
}
class fruit extends object {
    behavior() {
        this.timer--;
        if(this.timer<=0){
            objectmanager.cherryeaten++;
            return true;
        }
        if((!AI.collision2(this.x+0.5*CELL_SIZE,this.y+0.5*CELL_SIZE,this.w,this.h,pacman.x,pacman.y+PACMAN_HEIGHT,PACMAN_WIDTH,PACMAN_HEIGHT))||this.ate)
            return false;
        pacman.score += this.score;
        MUS_EAT_FRUIT.pause();
        MUS_EAT_FRUIT.currentTime = 0;
        MUS_EAT_FRUIT.play();
        this.ate = true;
        this.timer = 120;
        objectmanager.cherryeaten = 2;
    }
    draw() {
        if(this.ate)
            ctx.drawImag(SCORE_SPRITE,this.x+OFFSET[1],this.y+OFFSET[0],CELL_SIZE*2,CELL_SIZE*2,getAt(AI.leveli,level-1)*18,14,18,14);
        else
            ctx.drawImag(FRUIT_SPRITE,this.x+OFFSET[1],this.y+OFFSET[0],CELL_SIZE*2,CELL_SIZE*2,getAt(AI.leveli,level-1)*16,0,16,16);
    }
    constructor(x,y) {
        super(
            x,
            y,
            CELL_SIZE,
            CELL_SIZE,
            "fruit"
        );
        this.score = getAt(AI.levelsc,getAt(AI.leveli,level-1));
        this.timer = 60 * 5;
        this.ate = false;
    }
}
objectmanager.update = function () {
    for(i in this.objects)
        if(this.objects[i].behavior())
            this.objects.splice(i,1);
}
objectmanager.resetpellets = function () {
    this.objects = [];
    for(i in TILEMAP)
        for(j in TILEMAP[i])
            if(TILEMAP[i][j] === 0)
                this.objects.push(new pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2)));
            else if(TILEMAP[i][j] === 4)
                this.objects.push(new power_pellet(j*CELL_SIZE,i*CELL_SIZE+CELL_SIZE));
}
objectmanager.cherryeaten = 0;