class ghost {
    move() {
        //if(this.state=="trapped")return;
        this.x+=AI.ddS[this.dir][3]*this.speed;
        this.y+=AI.ddS[this.dir][4]*this.speed;
        if(this.x >= (canvas.width-this.speed-OFFSET[1]-(CELL_SIZE/2)))this.x = -(CELL_SIZE/2);
        if(this.x <= -CELL_SIZE)this.x = canvas.width - this.speed - OFFSET[1] - (CELL_SIZE/2);
    }
    behavior(x,y,x2,y2,t=false) {
        if(Math.round(this.x/CELL_SIZE)*CELL_SIZE===this.x && Math.round(this.y/CELL_SIZE)*CELL_SIZE===this.y){
            switch (this.state){
                case "norm":
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
                    this.dir = AI.normal(11,15,this.dir,this.x,this.y,this.state);
                    break;
            }
        }
        this.move();
    }
    constructor() {
        this.speed = PACMAN_SPEED;
    }
}

class BLINKY extends ghost {
    ibehavior() {
        this.behavior(pacman.x,pacman.y+PACMAN_HEIGHT,CELL_SIZE*27,CELL_SIZE);
    }
    draw() {
        ctx.drawImag(
            GHOST_SPRITE,
            this.x+OFFSET[1]-ooo,
            this.y+OFFSET[0]-ooo,
            CELL_SIZE+ooo*2,
            CELL_SIZE+ooo*2,
            (AI.ddS[this.dir][0])+((tick%10<5)*16),
            0,
            16,
            16
        );
    }
    reset() {
        this.x = CELL_SIZE*13.5;
        this.y = CELL_SIZE*12;
        this.w = CELL_SIZE;
        this.h = CELL_SIZE;
        this.dir = 1;
        this.state = "norm";
    }
    constructor() {
        super();
        this.reset();
    }
}

class PINKY extends ghost {
    ibehavior() {
        this.behavior(pacman.x+(AI.ddS[pacman.dir][1]*4),pacman.y+PACMAN_HEIGHT+(AI.ddS[pacman.dir][2]*4),CELL_SIZE*2,CELL_SIZE);
    }
    draw() {
        ctx.drawImag(
            GHOST_SPRITE,
            this.x+OFFSET[1]-15,
            this.y+OFFSET[0]-15,
            CELL_SIZE+30,
            CELL_SIZE+30,
            (AI.ddS[this.dir][0])+((tick%10<5)*16),
            16,
            16,
            16
        );
    }
    reset() {
        this.x = CELL_SIZE*15;
        this.y = CELL_SIZE*15;
        this.w = CELL_SIZE;
        this.h = CELL_SIZE;
        this.dir = 3;
        this.state = "trapped";
    }
    constructor() {
        super();
        this.reset();
    }
}

class INKY extends ghost {
    ibehavior() {
        var xx = pacman.x+AI.ddS[pacman.dir][1]*2
        var yy = pacman.y+PACMAN_HEIGHT+AI.ddS[pacman.dir][2]*2
        var INKYTARGETX = Math.abs(ghosts["BLINKY"].x-xx)>xx?xx-Math.abs(ghosts["BLINKY"].x-xx):xx+Math.abs(ghosts["BLINKY"].x-xx);
        var INKYTARGETY = Math.abs(ghosts["BLINKY"].y-yy)>yy?yy-Math.abs(ghosts["BLINKY"].y-yy):yy+Math.abs(ghosts["BLINKY"].y-yy);
        this.behavior(INKYTARGETX,INKYTARGETY,CELL_SIZE*27,CELL_SIZE*30);
    }
    draw() {
        ctx.drawImag(
            GHOST_SPRITE,
            this.x+OFFSET[1]-15,
            this.y+OFFSET[0]-15,
            CELL_SIZE+30,
            CELL_SIZE+30,
            (AI.ddS[this.dir][0])+((tick%10<5)*16),
            32,
            16,
            16
        );
    }
    reset() {
        this.x = CELL_SIZE*13.5;
        this.y = CELL_SIZE*15;
        this.w = CELL_SIZE;
        this.h = CELL_SIZE;
        this.dir = 3;
        this.state = "trapped";
    }
    constructor() {
        super();
        this.reset();
    }
}

class CLYDE extends ghost {
    ibehavior() {
        this.behavior(pacman.x,pacman.y+PACMAN_HEIGHT,CELL_SIZE*2,CELL_SIZE,(this.x<pacman.x+(CELL_SIZE*8)&&this.x>pacman.x-(CELL_SIZE*8)&&this.y<pacman.y+(CELL_SIZE*8)&&this.y>pacman.y-(CELL_SIZE*8)));
    }
    draw() {
        ctx.drawImag(
            GHOST_SPRITE,
            this.x+OFFSET[1]-15,
            this.y+OFFSET[0]-15,
            CELL_SIZE+30,
            CELL_SIZE+30, 
            (AI.ddS[this.dir][0])+((tick%10<5)*16),
            48,
            16,
            16
        );
    }
    reset() {
        this.x = CELL_SIZE*12;
        this.y = CELL_SIZE*15;
        this.w = CELL_SIZE;
        this.h = CELL_SIZE;
        this.dir = 3;
        this.state = "trapped";
    }
    constructor() {
        super();
        this.reset();
    }
}