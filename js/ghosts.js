class ghost {
    move() {
        if(this.state=="trapped")return;
        this.x+=this.ddS[this.dir][3]*this.speed;
        this.y+=this.ddS[this.dir][4]*this.speed;
        if(this.x > (canvas.width-this.speed-offset[1]-(cellsize/2)))this.x = -(cellsize/2);
        if(this.x < -cellsize)this.x = canvas.width - this.speed - offset[1] - (cellsize/2);
    }
    behavior(x,y,x2,y2) {
        if(Math.round(this.x/cellsize)*cellsize===this.x && Math.round(this.y/cellsize)*cellsize===this.y){
            switch (this.state){
                case "norm":
                    switch(ghoststate){
                        case "chase":
                            this.dir = normAI(x,y,this.dir,this.x,this.y);
                            break;
                        case "scatter":
                            this.dir = normAI(x2,y2,this.dir,this.x,this.y);
                            break;
                        case "trapped":
                            this.dir = normAI(11,15,this.dir,this.x,this.y);
                            break;
                    }
                    break;
            }
        }
        this.move();
    }
    constructor() {
        this.ddS = [
            [64,-cellsize,-cellsize,0,-1],
            [0,cellsize,0,1,0],
            [96,0,cellsize,0,1],
            [32,-cellsize,0,-1,0]
        ]
    }
}

class BLINKY extends ghost {
    ibehavior() {
        this.behavior(pacman.x,pacman.y+pacman.h,cellsize*27,cellsize);
    }
    draw() {
        ctx.drawImage(
            ghost_sprite,
            (this.ddS[this.dir][0])+((tick%10<5)*16),
            0,
            16,
            16,
            this.x+offset[1]-15,
            this.y+offset[0]-15,
            cellsize+30,
            cellsize+30
        );
    }
    reset() {
        this.x = cellsize*13.5,
        this.y = cellsize*12,
        this.w = cellsize,
        this.h = cellsize,
        this.dir = 1,
        this.state = "norm",
        this.speed = pacman.speed;
    }
    constructor() {
        super();
        this.reset();
    }
}

class PINKY extends ghost {
    ibehavior() {
        this.behavior(pacman.x+(this.ddS[pacman.dir][1]*4),pacman.y+pacman.h+(this.ddS[pacman.dir][2]*4),cellsize*2,cellsize);
    }
    draw() {
        ctx.drawImage(
            ghost_sprite,
            (this.ddS[this.dir][0])+((tick%10<5)*16),
            16,
            16,
            16,
            this.x+offset[1]-15,
            this.y+offset[0]-15,
            cellsize+30,
            cellsize+30
        );
    }
    reset() {
        this.x = cellsize*15,
        this.y = cellsize*15,
        this.w = cellsize,
        this.h = cellsize,
        this.dir = 3,
        this.state = "trapped",
        this.speed = pacman.speed;
    }
    constructor() {
        super();
        this.reset();
    }
}