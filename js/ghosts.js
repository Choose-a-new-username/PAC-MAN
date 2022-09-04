var ghostmanager = {};
class ghost {
    checkDie() {
        if(this.scared||this.state==="dead")
            this.die();
        else
            pacman.die();
    }
    drawself(y){
        ctx.drawImag(
            GHOST_SPRITE,
            this.x+OFFSET[1]-17,
            this.y+OFFSET[0]-17,
            CELL_SIZE+34,
            CELL_SIZE+34,
            (AI.ddS[this.dir][0])+((time.tick%10>5)*16),
            y,
            16,
            16
        ); 
    }
    die(){
        this.state = "deed";
        this.scared = 1;
    }
    move() {
        if(Math.round(this.x/(PACMAN_SPEED*2))*(PACMAN_SPEED*2)===this.x&&Math.round(this.y/(PACMAN_SPEED*2))*(PACMAN_SPEED*2)===this.y&&this.scared===1){
            this.scared = 0;
            if(this.state==="deed")
                this.state = "dead";
        }
        if(this.scared && this.state != "trapped")
            this.speed = PACMAN_SPEED / 2;
        else if(this.state==="dead")
            this.speed = PACMAN_SPEED * 2;
        else
            this.speed = PACMAN_SPEED;
        this.x+=AI.ddS[this.dir][3]*this.speed;
        this.y+=AI.ddS[this.dir][4]*this.speed;
        if(this.x/CELL_SIZE===13.5&&this.state==="exit"&&this.y%CELL_SIZE===0&&this.y/CELL_SIZE>=12&&this.y/CELL_SIZE<=15){
            if(this.y/CELL_SIZE===12){
                this.dir = 1;
                this.state = "norm";
            }else
                this.dir = 0;
        }else if(this.state==="dead"&&this.y%CELL_SIZE===0&&this.y/CELL_SIZE>=12&&this.y/CELL_SIZE<=15){
            if(this.x/CELL_SIZE===13.5)
            if(this.y/CELL_SIZE===15){
                this.dir = 1;
                this.state = "trapped";
                this.scared = 0;
            }else
                this.dir = 2;
            else if([12,13].includes(this.x/CELL_SIZE))
                this.dir = 1;
            else if([14,15].includes(this.x/CELL_SIZE))
                this.dir = 3;    
        }
        if(this.x > (canvas.width-this.speed-OFFSET[1]-(CELL_SIZE/2)))this.x = -(CELL_SIZE/2);
        if(this.x < -CELL_SIZE/2)this.x = canvas.width - this.speed - OFFSET[1] - (CELL_SIZE/2);
    }
    behavior(x,y,x2=x,y2=y,t=false) {
        if(this.scared>1)
            this.scared--;
        if(this.exittimer)
            this.exittimer--;
        else if(this.state === "trapped")
            this.state = "exit";
        if(Math.round(this.x/CELL_SIZE)*CELL_SIZE===this.x && Math.round(this.y/CELL_SIZE)*CELL_SIZE===this.y){
            switch (this.state){
                case "norm":
                case "deed":
                    if(this.scared>0)
                        this.dir = AI.random(this.dir,this.x,this.y,this.state)
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
                    this.dir = AI.normal(CELL_SIZE*13.5,CELL_SIZE*12,this.dir,this.x,this.y,this.state);
                    break;
            }
        }
        this.move();
    }
    flip(){
        this.dir = (this.dir+2)%4;
    }
    constructor() {
        this.speed = PACMAN_SPEED;
        this.scared = 0;
    }
}
var ghoststate = "scatter";

class BLINKY extends ghost {
    ibehavior() {
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
        this.w = CELL_SIZE;
        this.h = CELL_SIZE;
        this.dir = 1;
        this.state = "norm";
        this.exittimer = 0;
    }
    constructor() {
        super();
        this.reset();
    }
}
ghostmanager.BLINKY = new BLINKY();

class PINKY extends ghost {
    ibehavior() {
        this.behavior(pacman.x+(AI.ddS[pacman.dir][1]),pacman.y+PACMAN_HEIGHT+(AI.ddS[pacman.dir][2]),CELL_SIZE*2,-CELL_SIZE);
    }
    draw() {
        this.drawself(16);
    }
    reset() {
        this.x = CELL_SIZE*15;
        this.y = CELL_SIZE*15;
        this.w = CELL_SIZE;
        this.h = CELL_SIZE;
        this.dir = 1;
        this.state = "trapped";
        this.exittimer = 7 * 60;
    }
    constructor() {
        super();
        this.reset();
    }
}
ghostmanager.PINKY = new PINKY();

class INKY extends ghost {
    ibehavior() {
        var xx = pacman.x+AI.ddS[pacman.dir][1]*2;
        var yy = pacman.y+PACMAN_HEIGHT+AI.ddS[pacman.dir][2]*2;
        var INKYTARGETX = Math.abs(ghostmanager.BLINKY.x-xx)>xx?xx-Math.abs(ghostmanager.BLINKY.x-xx):xx+Math.abs(ghostmanager.BLINKY.x-xx);
        var INKYTARGETY = Math.abs(ghostmanager.BLINKY.y-yy)>yy?yy-Math.abs(ghostmanager.BLINKY.y-yy):yy+Math.abs(ghostmanager.BLINKY.y-yy);
        this.behavior(INKYTARGETX,INKYTARGETY,CELL_SIZE*27,CELL_SIZE*31);
    }
    draw() {
        this.drawself(32);
    }
    reset() {
        this.x = CELL_SIZE*13.5;
        this.y = CELL_SIZE*15;
        this.w = CELL_SIZE;
        this.h = CELL_SIZE;
        this.dir = 1;
        this.state = "trapped";
        this.exittimer = 27 * 60;
    }
    constructor() {
        super();
        this.reset();
    }
}
ghostmanager.INKY = new INKY();

class CLYDE extends ghost {
    ibehavior() {
        this.behavior(pacman.x,pacman.y+PACMAN_HEIGHT,CELL_SIZE,CELL_SIZE*31,(this.x<pacman.x+(CELL_SIZE*8)&&this.x>pacman.x-(CELL_SIZE*8)&&this.y<pacman.y+(CELL_SIZE*8)&&this.y>pacman.y-(CELL_SIZE*8)));
    }
    draw() {
        this.drawself(48);
    }
    reset() {
        this.x = CELL_SIZE*12;
        this.y = CELL_SIZE*15;
        this.w = CELL_SIZE;
        this.h = CELL_SIZE;
        this.dir = 1;
        this.state = "trapped";
        this.exittimer = 34 * 60;
    }
    constructor() {
        super();
        this.reset();
    }
}
ghostmanager.CLYDE = new CLYDE();

ghostmanager.update = function() {
    this.BLINKY.ibehavior();
    this.PINKY.ibehavior();
    this.INKY.ibehavior();
    this.CLYDE.ibehavior();
    if (AI.collision2(this.BLINKY.x,this.BLINKY.y,this.BLINKY.w,this.BLINKY.h,pacman.x+4,pacman.y+PACMAN_HEIGHT+4,PACMAN_WIDTH-12,PACMAN_HEIGHT-12))
        this.BLINKY.checkDie();
    if (AI.collision2(this.PINKY.x,this.PINKY.y,this.PINKY.w,this.PINKY.h,pacman.x+1,pacman.y+PACMAN_HEIGHT+1,PACMAN_WIDTH-3,PACMAN_HEIGHT-3))
        this.PINKY.checkDie();
    if (AI.collision2(this.INKY.x,this.INKY.y,this.INKY.w,this.INKY.h,pacman.x+1,pacman.y+PACMAN_HEIGHT+1,PACMAN_WIDTH-3,PACMAN_HEIGHT-3))
        this.INKY.checkDie();
    if (AI.collision2(this.CLYDE.x,this.CLYDE.y,this.CLYDE.w,this.CLYDE.h,pacman.x+1,pacman.y+PACMAN_HEIGHT+1,PACMAN_WIDTH-3,PACMAN_HEIGHT-3))
        this.CLYDE.checkDie();
    switch (level) {
        case 1:
            switch (Math.floor((time.tick)/60)) {
                case 7:
                case 34:
                case 41:
                case 66:
                    if(ghoststate==="chase")
                        break;
                    ghoststate = "chase";
                    this.INKY.flip();
                    this.BLINKY.flip();
                    this.PINKY.flip();
                    this.CLYDE.flip();
                    break;
                case 27:
                case 54:
                case 61:
                    if(ghoststate==="scatter")
                        break;
                    ghoststate = "scatter";
                    this.INKY.flip();
                    this.BLINKY.flip();
                    this.PINKY.flip();
                    this.CLYDE.flip();
                    break;
            }
            break;
    }
}