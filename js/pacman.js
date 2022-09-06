class pacman_c {
    update() {
        if(this.anim === PACMAN_ANIMATION_FRAMES)
            this.anim = 0;
        if(ghostmanager.BLINKY.scared||ghostmanager.PINKY.scared||ghostmanager.INKY.scared||ghostmanager.CLYDE.scared)
            this.speed = PACMAN_ACTUAL_SPEED*0.9;
        else
            this.speed = PACMAN_ACTUAL_SPEED*0.8;
        this.move();
        queuedDo();
    }
    move() {
        let canAnimate = false;
        this.x += this.speed * AI.ddS[this.dir][3];
        console.log(this.speed+1)
        if(TILEMAP[AI.ddS[this.dir][6](this.y/CELL_SIZE)+AI.ddS[this.dir][4]].at(AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][3])===1){
            this.x = AI.ddS[this.dir][6](this.x/CELL_SIZE)*CELL_SIZE;
            if(queued=="up")
                this.dir = 0;
            else if(queued=="down")
                this.dir = 2;
        }else if(CELL_SIZE%this.speed!==0&&queued==="left"&&TILEMAP[AI.ddS[this.dir][6](this.y/CELL_SIZE)+AI.ddS[this.dir][5](this.speed)*AI.ddS[this.dir][3]].at(AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][3])!==1){
            this.y = AI.ddS[this.dir][6](this.y/CELL_SIZE)*CELL_SIZE;
            this.dir = 3;
            canAnimate = true;
        }else if(CELL_SIZE%this.speed!==0&&queued==="right"&&TILEMAP[AI.ddS[this.dir][6](this.y/CELL_SIZE)+AI.ddS[this.dir][5](this.speed)*AI.ddS[this.dir][3]].at(AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][3])!==1){
            this.y = AI.ddS[this.dir][6](this.y/CELL_SIZE)*CELL_SIZE;
            this.dir = 1;
            canAnimate = true;
        }else
            canAnimate = true;
        this.y += this.speed * AI.ddS[this.dir][4];
        if(TILEMAP[AI.ddS[this.dir][6](this.y/CELL_SIZE)+AI.ddS[this.dir][4]].at(AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][3])===1){
            this.y = AI.ddS[this.dir][5](this.y/CELL_SIZE)*CELL_SIZE;
            if(queued=="left")
                this.dir = 3;
            else if(queued=="right")
                this.dir = 1;
        }else if(CELL_SIZE%this.speed!==0&&queued==="up"&&TILEMAP[AI.ddS[0][6](this.y/CELL_SIZE)+AI.ddS[0][4]].at(AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][6](this.speed)*AI.ddS[this.dir][4])!==1){
            this.x = (AI.ddS[this.dir][5](this.x/CELL_SIZE))*CELL_SIZE;
            this.dir = 0;
            canAnimate = true;
        }else if(CELL_SIZE%this.speed!==0&&queued==="down"&&TILEMAP[AI.ddS[2][6](this.y/CELL_SIZE)+AI.ddS[2][4]].at(AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][6](this.speed)*AI.ddS[this.dir][4])!==1){
            this.x = (AI.ddS[this.dir][5](this.x/CELL_SIZE))*CELL_SIZE;
            this.dir = 2;
            canAnimate = true;
        }else
            canAnimate = true;
        if(this.x > (canvas.width-PACMAN_SPEED-OFFSET[1]-(CELL_SIZE/2)))
            this.x = -(CELL_SIZE/2);
        if(this.x < -(CELL_SIZE/2))
            this.x = canvas.width - PACMAN_SPEED - OFFSET[1] - (CELL_SIZE/2);
        if(canAnimate&&time.tick%PACMAN_ANIMATION_SPEED===0)
            this.anim++;
    }
    draw() {
        ctx.drawImag(
            PACMAN_SPRITE,
            OFFSET[1]+this.x-DRAW_OFFSET,
            OFFSET[0]+(PACMAN_HEIGHT+this.y)-DRAW_OFFSET,
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
        this.x       = CELL_SIZE*13.5;
        this.y       = CELL_SIZE*23;
        this.dir     = 3;
        this.anim    = 2;
        this.speed   = PACMAN_SPEED;
    }
    die() {
        MUS_DEATH.pause();
        MUS_DEATH.currentTime = 0;
        MUS_DEATH.pla();
        begun = false;
        this.dead = true;
        MUS_DEATH.addEventListener("ended",()=>requestAnimationFrame(restart));
    }
    constructor() {
        this.score   = 0;
        this.hp      = 3;
        this.max_hp  = 3;
        this.dead = false;
        this.reset();
    }
}

var pacman = new pacman_c();