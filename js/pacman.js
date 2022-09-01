let PACMAN_CHANGABLE_SPEED = 2.5679398393;
class pacman_c {
    update() {
        queuedDo();
        if(this.anim === PACMAN_ANIMATION_FRAMES)
            this.anim = 0;
            this.move(PACMAN_SPEED);
    }
    move(speed) {
        if (!(TILEMAP[AI.ddS[this.dir][6](this.y/CELL_SIZE)+AI.ddS[this.dir][4]].at(AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][3])===1)) {
            this.x += speed * AI.ddS[this.dir][3];
            this.y += speed * AI.ddS[this.dir][4];
            if(this.x > (canvas.width-PACMAN_SPEED-OFFSET[1]-(CELL_SIZE/2)))
                this.x = -(CELL_SIZE/2);
            if(this.x < -(CELL_SIZE/2))
                this.x = canvas.width - PACMAN_SPEED - OFFSET[1] - (CELL_SIZE/2);
            if((time.tick%PACMAN_ANIMATION_SPEED)==0)
                this.anim++;
        }
    }
    draw() {
        ctx.drawImag(
            PACMAN_SPRITE,
            OFFSET[1]+this.x-DRAW_OFFSET,
            OFFSET[0]+PACMAN_HEIGHT+this.y-DRAW_OFFSET,
            PACMAN_WIDTH+DRAW_OFFSET*2-2,
            PACMAN_HEIGHT+DRAW_OFFSET*2-2,
            this.anim*PACMAN_ANIMATION_WIDTH+2,
            0,
            PACMAN_ANIMATION_WIDTH-1,
            PACMAN_ANIMATION_HEIGHT-1,
            ((this.dir - 1) * 90)*(Math.PI/180)
        );
    }
    reset() {
        this.x     = CELL_SIZE*13.5;
        this.y     = CELL_SIZE*23;
        this.dir   = 3;
        this.anim  = 2;
    }
    constructor() {
        this.score   = 0;
        this.hp      = 3;
        this.max_hp  = 3;
        this.reset();
    }
}

var pacman = new pacman_c();
var pacman_dead = false;