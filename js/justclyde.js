class CLYDE extends ghost {
    ibehavior() {
        this.behavior(pacman.x,pacman.y+PACMAN_HEIGHT,CELL_SIZE,CELL_SIZE*31,(this.x<pacman.x+(CELL_SIZE*8)&&this.x>pacman.x-(CELL_SIZE*8)&&this.y<pacman.y+(CELL_SIZE*8)&&this.y>pacman.y-(CELL_SIZE*8)));
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

var CLYDE_I     = new CLYDE();