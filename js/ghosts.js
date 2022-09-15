var ghostmanager = {};
class ghost {
    checkDie() {
        if(this.scared)
            this.die();
        else if(!(this.state === "dead")){
            pacman.die();
        }
    }
    drawself(y){
        if(!this.eaten)
            ctx.drawImag(
                GHOST_SPRITE,
                this.x+OFFSET[1]-DRAW_OFFSET,
                this.y+OFFSET[0]-DRAW_OFFSET,
                CELL_SIZE+DRAW_OFFSET*2,
                CELL_SIZE+DRAW_OFFSET*2,
                (AI.ddS[this.scared?(this.scared < 180 ? (time.tick%40<20?1:3) : 1):this.dir][0])+((time.tick%10>5)*16),
                this.state === "dead" ? 82 : this.scared > 0 ? 64 : y,
                16,
                16
            ); 
    }
    die(){
        this.x = this.x.rnd(CELL_SIZE);
        this.y = this.y.rnd(CELL_SIZE);
        this.scared = 0;
        pacman.ate = true;
        this.eaten = true;
        MUS_EAT_GHOST.currentTime = 0;
        MUS_EAT_GHOST.pause();
        MUS_EAT_GHOST.play();
        this.state = "dead";
        eval(`MUS_EAT_GHOST.addEventListener("ended",()=>{pacman.ate=false;this.eaten=false;});`)
    }
    isdead(){
        return this.state === "dead" && !this.eaten; 
    }
    move() {
        if(pacman.ate)
            return;
        if(this.scared){
            this.scared--;
            //if(!this.scared){
            //    this.x = this.x.rnd(CELL_SIZE);
            //    this.y = this.y.rnd(CELL_SIZE);
            //    pacman.x = pacman.x.rnd(CELL_SIZE);
            //    pacman.y = pacman.y.rnd(CELL_SIZE);
            //}
        }
        if(this.exittimer)
            this.exittimer--;
        else if(this.state === "trapped")
            this.state = "exit";
        if(this.state==="dead")
            this.speed = UNIVERSAL_SPEED*2;
        else if(this.scared && this.state != "trapped")
            this.speed = UNIVERSAL_SPEED*getAt(AI.speed.gp,level);
        else
            this.speed = UNIVERSAL_SPEED*getAt(AI.speed.gn,level);
        const iter = Math.round(this.speed / 0.001);
        for(let i = 0; i < iter; i++){
            if(Math.round(this.x/CELL_SIZE)*CELL_SIZE === this.x && Math.round(this.y/CELL_SIZE)*CELL_SIZE === this.y){
                this.ithingy2();
            }
            this.x+=AI.ddS[this.dir][3]*0.001;
            this.x = Math.round(this.x * 1000) / 1000;
            this.y+=AI.ddS[this.dir][4]*0.001;
            this.y = Math.round(this.y * 1000) / 1000;
            if(this.state === "exit" && Math.fround(this.x / CELL_SIZE) === 13.5)
                if(this.y / CELL_SIZE === 12){
                    this.dir   = 1;
                    this.x     = 13.5 * CELL_SIZE;
                    this.state = "norm";
                }else
                    this.dir = 0;
            if(this.state === "dead" && Math.fround(this.x / CELL_SIZE) === 13.5)
                if(this.y >= 12 * CELL_SIZE && this.y <= 14 * CELL_SIZE){
                    this.dir = 2;
                    this.x = 13.5 * CELL_SIZE;
                }else if(this.y === 15 * CELL_SIZE){
                    this.state = "trapped";
                    this.dir = 1;
                }
                
        }
        if(this.x > (canvas.width-this.speed-OFFSET[1]-(CELL_SIZE/2)))this.x = -(CELL_SIZE/2);
        if(this.x < -CELL_SIZE/2)this.x = canvas.width - this.speed - OFFSET[1] - (CELL_SIZE/2);
    }
    behavior(x,y,x2=x,y2=y,t=false) {
        if(Math.round(this.x/CELL_SIZE)*CELL_SIZE===this.x && Math.round(this.y/CELL_SIZE)*CELL_SIZE===this.y){
            switch (this.state){
                case "norm":
                    if(this.scared>0)
                        this.dir = AI.random(this.dir,this.x,this.y,this.state);
                    else
                        switch(ghoststate){
                            case "chase":
                                this.dir = t?AI.random(this.dir,this.x,this.y,this.state):AI.normal(x,y,this.dir,this.x,this.y,this.state);
                                break;
                            case "scatter":
                                this.dir = AI.normal(x2,y2,this.dir,this.x,this.y,this.state);
                                break;
                        }
                    break;
                case "trapped":
                    this.dir = AI.normal(CELL_SIZE*15,CELL_SIZE*15,this.dir,this.x,this.y,this.state);
                    break;
                case "exit":
                    this.dir = AI.normal(CELL_SIZE*14,CELL_SIZE*15,this.dir,this.x,this.y,this.state);
                    break;
                case "dead":
                    this.dir = AI.normal(CELL_SIZE*13,CELL_SIZE*12,this.dir,this.x,this.y,this.state);
                    if([12,13].includes(this.x / CELL_SIZE) && this.y / CELL_SIZE === 12)
                        this.dir = 1;
                    else if([14,15].includes(this.x / CELL_SIZE) && this.y / CELL_SIZE === 12)
                        this.dir = 3;
                    break;
            }
        }
    }
    flip(){
        if(!(["exit","dead"].includes(this.state)))
            this.dir = (this.dir+2)%4;
    }
    constructor() {
        this.speed = UNIVERSAL_SPEED;
        this.scared = 0;
        this.eaten = false;
        this.w = this.h = CELL_SIZE;
    }
}
var ghoststate = "scatter";

class BLINKY extends ghost {
    ithingy2() {
        if(objectmanager.objects.reduce((a, v) => (v.name === "pellet" ? a + 1 : a), 0) >= AI.ppL[Math.clamp(level,0,18)])
            this.behavior(pacman.x,pacman.y+PACMAN_HEIGHT,CELL_SIZE*27,-CELL_SIZE);
        else
            this.behavior(pacman.x,pacman.y+PACMAN_HEIGHT);
    }
    draw() {
        this.drawself(0);
    }
    reset() {
        this.x = CELL_SIZE*13.5;
        this.y = CELL_SIZE*12;
        this.dir = 1;
        this.state = "norm";
        this.exittimer = 0;
        this.name = 0;
        this.scared = 0;
    }
    constructor() {
        super();
        this.reset();
    }
}
ghostmanager.BLINKY = new BLINKY();

class PINKY extends ghost {
    ithingy2() {
        this.behavior(pacman.x+(AI.ddS[pacman.dir][1]),pacman.y+PACMAN_HEIGHT+(AI.ddS[pacman.dir][2]),CELL_SIZE*2,-CELL_SIZE);
    }
    draw() {
        this.drawself(16);
    }
    reset() {
        this.x = CELL_SIZE*15;
        this.y = CELL_SIZE*15;
        this.dir = 1;
        this.state = "trapped";
        this.exittimer = getAt(getAt(AI.lt2,level),0)*60;
        this.name = 1;
        this.scared = 0;
    }
    constructor() {
        super();
        this.reset();
    }
}
ghostmanager.PINKY = new PINKY();

class INKY extends ghost {
    ithingy2() {
        const xx = pacman.x+AI.ddS[pacman.dir][1]*2;
        const yy = pacman.y+PACMAN_HEIGHT+AI.ddS[pacman.dir][2]*2;
        const x2 = Math.diff(ghostmanager.BLINKY.x,xx);
        const y2 = Math.diff(ghostmanager.BLINKY.y,yy);
        this.behavior(x2>xx?xx-x2:xx+x2,y2>yy?yy-y2:yy+y2,CELL_SIZE*27,CELL_SIZE*31);
    }
    draw() {
        this.drawself(32);
    }
    reset() {
        this.x = CELL_SIZE*13.5;
        this.y = CELL_SIZE*15;
        this.dir = 1;
        this.state = "trapped";
        this.exittimer = getAt(getAt(AI.lt2,level),1)*60;
        this.name = 2;
        this.scared = 0;
    }
    constructor() {
        super();
        this.reset();
    }
}
ghostmanager.INKY = new INKY();

class CLYDE extends ghost {
    ithingy2() {
        this.behavior(pacman.x,pacman.y+PACMAN_HEIGHT,CELL_SIZE,CELL_SIZE*31,(this.x<pacman.x+(CELL_SIZE*8)&&this.x>pacman.x-(CELL_SIZE*8)&&this.y<pacman.y+(CELL_SIZE*8)&&this.y>pacman.y-(CELL_SIZE*8)));
    }
    draw() {
        this.drawself(48);
    }
    reset() {
        this.x = CELL_SIZE*12;
        this.y = CELL_SIZE*15;
        this.dir = 1;
        this.state = "trapped";
        this.exittimer = getAt(getAt(AI.lt2,level),2)*60;
        this.name = 3;
        this.scared = 0;
    }
    constructor() {
        super();
        this.reset();
    }
}
ghostmanager.CLYDE = new CLYDE();

ghostmanager.update = function() {
    this.BLINKY.move();
    this.PINKY.move();
    this.INKY.move();
    this.CLYDE.move();
    if(!pacman.ate)
        if (AI.collision2(this.BLINKY.x,this.BLINKY.y,this.BLINKY.w,this.BLINKY.h,pacman.x+4,pacman.y+PACMAN_HEIGHT+4,PACMAN_WIDTH-12,PACMAN_HEIGHT-12))
            this.BLINKY.checkDie();
        if (AI.collision2(this.PINKY.x,this.PINKY.y,this.PINKY.w,this.PINKY.h,pacman.x+4,pacman.y+PACMAN_HEIGHT+4,PACMAN_WIDTH-12,PACMAN_HEIGHT-12))
            this.PINKY.checkDie();
        if (AI.collision2(this.INKY.x,this.INKY.y,this.INKY.w,this.INKY.h,pacman.x+4,pacman.y+PACMAN_HEIGHT+4,PACMAN_WIDTH-12,PACMAN_HEIGHT-12))
            this.INKY.checkDie();
        if (AI.collision2(this.CLYDE.x,this.CLYDE.y,this.CLYDE.w,this.CLYDE.h,pacman.x+4,pacman.y+PACMAN_HEIGHT+4,PACMAN_WIDTH-12,PACMAN_HEIGHT-12))
            this.CLYDE.checkDie();
    if(getAt(AI.lt,level)[0].includes(Math.floor((time.tick)/60))&&ghoststate!=="chase"){
        ghoststate = "chase";
        this.INKY.flip();
        this.BLINKY.flip();
        this.PINKY.flip();
        this.CLYDE.flip();
    }else if(getAt(AI.lt,level)[1].includes(Math.floor((time.tick)/60))&&ghoststate!=="scatter"){
        ghoststate = "scatter";
        this.INKY.flip();
        this.BLINKY.flip();
        this.PINKY.flip();
        this.CLYDE.flip();
    }
}