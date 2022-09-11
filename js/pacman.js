class pac_manager {
    constructor() {
        this.round = {
            x: {
                z0: {
                    z0: () => AI.ddS[this.dir][6](this.x/CELL_SIZE)+AI.ddS[this.dir][4],
                    z1: () => AI.ddS[this.dir][6](this.x/CELL_SIZE)+AI.ddS[this.dir][3],
                },
                z1: {
                    z0: () => AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][4],
                    z1: () => AI.ddS[this.dir][5](this.x/CELL_SIZE)+AI.ddS[this.dir][3],
                },
            },
            y:  {
                z0: {
                    z0: () => AI.ddS[this.dir][5](this.y/CELL_SIZE)+AI.ddS[this.dir][3],
                    z1: () => AI.ddS[this.dir][5](this.y/CELL_SIZE)+AI.ddS[this.dir][4],
                },
                z1: {
                    z0: () => AI.ddS[this.dir][6](this.y/CELL_SIZE)+AI.ddS[this.dir][3],
                    z1: () => AI.ddS[this.dir][6](this.y/CELL_SIZE)+AI.ddS[this.dir][4],
                },
            },
        };
        this.roundb = {
            x: {
                z0: {
                    z0: () => AI.ddS[this.dir][6](this.x/CELL_SIZE)*CELL_SIZE,
                    z1: () => AI.ddS[this.dir][6](this.x/CELL_SIZE)*CELL_SIZE,
                },
                z1: {
                    z0: () => AI.ddS[this.dir][5](this.x/CELL_SIZE)*CELL_SIZE,
                    z1: () => AI.ddS[this.dir][5](this.x/CELL_SIZE)*CELL_SIZE,
                },
            },
            y:  {
                z0: {
                    z0: () => AI.ddS[this.dir][5](this.y/CELL_SIZE)*CELL_SIZE,
                    z1: () => AI.ddS[this.dir][5](this.y/CELL_SIZE)*CELL_SIZE,
                },
                z1: {
                    z0: () => AI.ddS[this.dir][6](this.y/CELL_SIZE)*CELL_SIZE,
                    z1: () => AI.ddS[this.dir][6](this.y/CELL_SIZE)*CELL_SIZE,
                },
            },
        };
        this.roundw = {
            x: {
                z0: {
                    z0: (a,b) => AI.ddS[this.dir][6](this.x/CELL_SIZE+a)+AI.ddS[this.dir][4]+b,
                    z1: (a,b) => AI.ddS[this.dir][6](this.x/CELL_SIZE+a)+AI.ddS[this.dir][3]+b,
                },
                z1: {
                    z0: (a,b) => AI.ddS[this.dir][5](this.x/CELL_SIZE+a)+AI.ddS[this.dir][4]+b,
                    z1: (a,b) => AI.ddS[this.dir][5](this.x/CELL_SIZE+a)+AI.ddS[this.dir][3]+b,
                },
            },
            y: {
                z0: {
                    z0: (a,b) => AI.ddS[this.dir][5](this.y/CELL_SIZE+a)+AI.ddS[this.dir][3]+b,
                    z1: (a,b) => AI.ddS[this.dir][5](this.y/CELL_SIZE+a)+AI.ddS[this.dir][4]+b,
                },
                z1: {
                    z0: (a,b) => AI.ddS[this.dir][6](this.y/CELL_SIZE+a)+AI.ddS[this.dir][3]+b,
                    z1: (a,b) => AI.ddS[this.dir][6](this.y/CELL_SIZE+a)+AI.ddS[this.dir][4]+b,
                },
            },
        };
        this.tget = {
            x: (c) => Math.clamp(c,0,TILEMAP[0].length),
            y: (d) => Math.clamp(d,0,TILEMAP.length),
            map: (a,b) => TILEMAP[this.tget.y(a)][this.tget.x(b)],
        };
    }
}
class pacman_c extends pac_manager {
    update() {
        if(this.anim === PACMAN_ANIMATION_FRAMES)
            this.anim = 0;
        if(ghostmanager.BLINKY.scared||ghostmanager.PINKY.scared||ghostmanager.INKY.scared||ghostmanager.CLYDE.scared)
            this.speed = UNIVERSAL_SPEED*getAt(AI.speed.pp,level);
        else
            this.speed = UNIVERSAL_SPEED*getAt(AI.speed.pn,level);
        this.move();
    }
    move() {
        let animate = true;
        const add = 1 / (10 ** Math.countDecimals(this.speed));
        const iter = this.speed / add;
        for(let i = 0; i < iter; i++){
            this.x += AI.ddS[this.dir][3]*add;
            this.x = Math.round(this.x * 100) / 100;
            if(this.tget.map(this.round.y.z1.z1(),this.round.x.z1.z1())===1){
                animate = false;
                this.x = this.roundb.x.z1.z1();
                queuedDo();
                break;
            }
            this.y += AI.ddS[this.dir][4]*add;
            this.y = Math.round(this.y * 100) / 100;
            if(this.tget.map(this.round.y.z1.z1(),this.round.x.z1.z1())===1){
                animate = false;
                this.y = this.roundb.y.z1.z1();
                queuedDo();
                break;
            }
            queuedDo();
        }
        if(this.x > (canvas.width-UNIVERSAL_SPEED-OFFSET[1]-(CELL_SIZE/2)))
            this.x = -(CELL_SIZE/2);
        if(this.x < -(CELL_SIZE/2))
            this.x = canvas.width - UNIVERSAL_SPEED - OFFSET[1] - (CELL_SIZE/2);
        if(time.tick%PACMAN_ANIMATION_SPEED===0&&animate)
            this.anim++;
    }
    draw() {
        ctx.drawImag(
            PACMAN_SPRITE,
            OFFSET[1]+this.x-DRAW_OFFSET,
            OFFSET[0]+(PACMAN_HEIGHT+this.y)-DRAW_OFFSET,
            PACMAN_WIDTH+DRAW_OFFSET*2-4,
            PACMAN_HEIGHT+DRAW_OFFSET*2-4,
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
        this.speed = UNIVERSAL_SPEED;
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
        super();
        this.score   = 0;
        this.hp      = 3;
        this.max_hp  = 3;
        this.dead = false;
        this.reset();
    }
}

var pacman = new pacman_c();