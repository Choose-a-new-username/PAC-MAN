//canvas/ctx settings
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = "bold 30px pixel-face";
ctx.imageSmoothingEnabled = false; //this is to fix the "blur" effect. 
function drawImage(context, img, x, y, width, height,angle=0,dx=0,dy=0,dw=img.width,dh=img.height) {
    context.save();
    context.translate(x + width / 2, y + height / 2);
    context.rotate(angle);
    context.translate(- x - width / 2, - y - height / 2);
    context.drawImage(img, dx, dy, dw, dh, x, y, width, height);
    context.restore();
}

//assets/images
const pac_sprite    = document.getElementById("pacman");
const ghost_sprite  = document.getElementById("ghosts");
const map_sprite    = document.getElementById("map");
const hp_sprite    = document.getElementById("health");
const intro        = document.getElementById("intro");
const munch_1      = document.getElementById("munch_1");
const munch_2      = document.getElementById("munch_2");
const ghost_sound  = document.getElementById("ghost_sound");

var INKYTARGETX    = 0;
var INKYTARGETY    = 0;

//constants
const tilemap      = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
[1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
[1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
[2,2,2,2,2,2,0,2,2,2,1,1,2,2,2,2,1,1,2,2,2,0,2,2,2,2,2,2],
[1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,0,0,1,1,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,1,1,0,0,0,1],
[1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
[1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
[1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
[1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
[1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const boardsize    = [tilemap[0].length-1,tilemap.length];
const cellsize     = 40;
const pelletsize   = 10;
const offset       = [cellsize*1,20];

//math
const getMin = object => {
    return Object.keys(object).filter(x => {
         return object[x] == Math.min.apply(null, 
         Object.values(object));
   });
};
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//levels
var level = 1;

//ghosts
var ghosts = {};
var ghoststate = "scatter";
function randAI(curdir,x,y){
    let dirs = [0,1,2,3];
    if((x === cellsize*12 || x === cellsize*15)&&(y === cellsize*12)){
        if(dirs.includes(0))dirs.splice(dirs.indexOf(0),1);
    }    
    for (let i = 0; i < 4; i++){
        if(dirs.includes(i))if(curdir===Math.abs(i-3))dirs.splice(dirs.indexOf(i),1);
    }    
    if(dirs.includes(0))if((tilemap[y/cellsize-2].at(x/cellsize)===1)){dirs.splice(dirs.indexOf(0),1);}
    if(dirs.includes(2))if((tilemap[y/cellsize].at(x/cellsize)===1)){dirs.splice(dirs.indexOf(2),1);}
    if(dirs.includes(3))if((tilemap[y/cellsize-1].at(x/cellsize-1)===1)){dirs.splice(dirs.indexOf(3),1);}
    if(dirs.includes(1))if((tilemap[y/cellsize-1].at(x/cellsize+1)===1)){dirs.splice(dirs.indexOf(1),1);}
    let i = Math.round(Math.random()*dirs.length-1);
    return dirs[i] || dirs[0];
}
function normAI(tx,ty,curdir,x,y) {
    let dirs = [0,1,2,3];
    let dists = {0:0,1:0,2:0,3:0};
    if((x === cellsize*12 || x === cellsize*15)&&(y === cellsize*12)){
        delete dists["0"];
        if(dirs.includes(0))dirs.splice(dirs.indexOf(0),1);
    }
    delete dists[(curdir+2)%4];    
    dirs.splice(dirs.indexOf((curdir+2)%4),1);
    if(dirs.includes(0))if((tilemap[y/cellsize-2].at(x/cellsize)===1)&&!((y/cellsize==15||y/cellsize==14)&&x/cellsize>=14&&x/cellsize<=15)){delete dists["0"];dirs.splice(dirs.indexOf(0),1);}
    if(dirs.includes(2))if((tilemap[y/cellsize].at(x/cellsize)===1)){delete dists["2"];dirs.splice(dirs.indexOf(2),1);}
    if(dirs.includes(3))if((tilemap[y/cellsize-1].at(x/cellsize-1)===1)){delete dists["3"];dirs.splice(dirs.indexOf(3),1);}
    if(dirs.includes(1))if((tilemap[y/cellsize-1].at(x/cellsize+1)===1)){delete dists["1"];dirs.splice(dirs.indexOf(1),1);}
    for(i in dirs) {
        switch(dirs[i]){
            case 0: 
                dists["0"]=Math.abs(x-tx)+Math.abs(y-cellsize-ty);
                break;
            case 1: 
                dists["1"]=Math.abs(x+cellsize-tx)+Math.abs(y-ty);
                break;
            case 2: 
                dists["2"]=Math.abs(x-tx)+Math.abs(y+cellsize-ty);
                break;
            case 3: 
                dists["3"]=Math.abs(x-cellsize-tx)+Math.abs(y-ty);
                break;
        }
    }
    let min = getMin(dists);
    if(min.includes("0")){
        return 0;
    }else if(min.includes("3")){
        return 3;
    }else if(min.includes("2")){
        return 2;
    }else if(min.includes("1")){
        return 1;
    }
    return (curdir+2)%4;
}

//pacman
var pacman = {}
var pacman_dead = false;
var health_points = 3;
const max_health = 3;

//pellets
var pellets = [];
var score = 0;
const pellet = (x,y,w,h) => pellets.push({x,y,w,h});
for(i in tilemap) {
    for(j in tilemap[i]) {
        if(tilemap[i][j] === 0) {
            pellet(j*cellsize+(cellsize/2)-(pelletsize/2),i*cellsize+cellsize+(cellsize/2)-(pelletsize/2),pelletsize,pelletsize);       
        }
    }
}

//time/time functions
var tick = 0;
const wait = secs => {return new Promise(resolve => setTimeout(resolve,secs));}
const AnimationFrame = () => {return new Promise(resolve => requestAnimationFrame(resolve,secs));}
var TimeNow = Date.now();

//collision functions
function corner(a,b,c,d,e,f) {
    return (a >= c && a <= (c+e) && b >= d && b <= (d+f));
}
function corner4(a,b,c,d,e,f,g,h) {
    return corner(a,b,e,f,g,h) || corner(a+c,b,e,f,g,h) || corner(a,b+d,e,f,g,h) || corner(a+c,b+d,e,f,g,h);
}
function collision2(a,b,c,d,e,f,g,h) {
    return corner4(a,b,c,d,e,f,g,h) || corner4(e,f,g,h,a,b,c,d);
}

//restart
async function restart() {
    begun = false;
    pacman_dead = false;
    ghoststate = "scatter";
    pacman = {
        x: cellsize*13.5,
        y: cellsize*23,
        w: cellsize,
        h: cellsize,
        dir: 3,
        //cellsize must be divisible by pacman.speed
        speed: cellsize/8,
        anim: 2,
        animframes: 3,
        animwidth: 13,
        animspeed: 2,
    }
    ghosts = {
        BLINKY: {
            x: cellsize*13.5,
            y: cellsize*12,
            w: cellsize,
            h: cellsize,
            dir: 1,
            state: "norm"
        },
        PINKY: {
            x: cellsize*15,
            y: cellsize*15,
            w: cellsize,
            h: cellsize,
            dir: 3,
            state: "trapped"
        },
        INKY: {
            x: cellsize*13.5,
            y: cellsize*15,
            w: cellsize,
            h: cellsize,
            dir: 3,
            state: "trapped"
        },
        CLYDE: {
            x: cellsize*12,
            y: cellsize*15,
            w: cellsize,
            h: cellsize,
            dir: 3,
            state: "trapped"
        },
    };
    intro.currentTime = 0;
    intro.play();
}


//key events
var keys = {};
var konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","Enter","Enter"];
var konamimode = false;
var pressedsequence = [];
var queued = "up";
addEventListener("keydown",e=>{
    if((keys[e.key]===true)||(pacman_dead))return;
    //konami section starts    
        pressedsequence.push(e.key);
        if(!(e.key === konami[pressedsequence.length-1]))pressedsequence = [];
    //konami section ends
    keys[e.key]=true;
    switch(e.key) {
        case "r":
        case "s":
        case "t":
        case "R":
        case "S":
        case "T":
            if((keys["r"]||keys["R"])&&(keys["s"]||keys["S"])&&(keys["t"]||keys["T"])&&begun){
                restart();            
            }
            break;
        case "ArrowUp":
            queued = "up";
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize && !(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1)) {
                pacman.dir = 0;
            }
            break;
        case "ArrowRight":
            queued = "right";
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize && !(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1||tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===3)) {
                pacman.dir = 1;
            }
            break;
        case "ArrowDown":
            queued = "down";
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize && !(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1)) {
                pacman.dir = 2;
            }
            break;
        case "ArrowLeft":
            queued = "left";
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize && !(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1))===1||tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===3) {
                pacman.dir = 3;
            }
            break;
        default:
            break;
    }
});
addEventListener("keyup",e=>{keys[e.key]=false;});
function getKey(k) {
    return new Promise(r=>{
        const keypressed=()=>{
            if(keys[k]){
                r();
            } else {
                requestAnimationFrame(keypressed);
            }
        }
        keypressed();
    });
}

//behavior functions (movement, pellets, etc...) 
function ghostBehaivor() {
    //BLINKY
        if(Math.round(ghosts["BLINKY"].x/cellsize)*cellsize===ghosts["BLINKY"].x && Math.round(ghosts["BLINKY"].y/cellsize)*cellsize===ghosts["BLINKY"].y){
            switch (ghosts["BLINKY"].state){
                case "norm":
                    switch(ghoststate){
                        case "chase":
                            ghosts["BLINKY"].dir = normAI(pacman.x,pacman.y+pacman.h,ghosts["BLINKY"].dir,ghosts["BLINKY"].x,ghosts["BLINKY"].y);
                            break;
                        case "scatter":
                            ghosts["BLINKY"].dir = normAI(cellsize*27,cellsize*1,ghosts["BLINKY"].dir,ghosts["BLINKY"].x,ghosts["BLINKY"].y);
                            break;
                    }
                    break;
            }
        }
        if(ghosts["BLINKY"].state!="trapped")switch (ghosts["BLINKY"].dir) {
            case 0:
                ghosts["BLINKY"].y-=pacman.speed;
                break;
            case 1:
                ghosts["BLINKY"].x+=pacman.speed;
                if(ghosts["BLINKY"].x > (canvas.width-pacman.speed-offset[1]-(cellsize/2)))ghosts["BLINKY"].x = -(cellsize/2);
                break;
            case 2:
                ghosts["BLINKY"].y+=pacman.speed;
                break;
            case 3:
                ghosts["BLINKY"].x-=pacman.speed;
                if(ghosts["BLINKY"].x < -cellsize)ghosts["BLINKY"].x = canvas.width - pacman.speed - offset[1]- (cellsize/2);
                break;
        }
    //PINKY
        if(Math.round(ghosts["PINKY"].x/cellsize)*cellsize===ghosts["PINKY"].x && Math.round(ghosts["PINKY"].y/cellsize)*cellsize===ghosts["PINKY"].y){
            switch(ghosts["PINKY"].state) {
                case "norm":
                    switch (ghoststate) {
                        case "chase":
                            switch(pacman.dir) {
                                case 0:
                                    ghosts["PINKY"].dir = normAI(clamp(pacman.x-cellsize*4,0,boardsize[1]*cellsize),clamp(pacman.y+pacman.h-cellsize*4,0,boardsize[1]*cellsize),ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                                    break;
                                case 1:
                                    ghosts["PINKY"].dir = normAI(clamp(pacman.x+cellsize*4,0,boardsize[1]*cellsize),pacman.y+pacman.h,ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                                    break;
                                case 2:
                                    ghosts["PINKY"].dir = normAI(pacman.x,clamp(pacman.y+pacman.h+cellsize*4,0,boardsize[0]*cellsize),ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                                    break;
                                case 3:
                                    ghosts["PINKY"].dir = normAI(clamp(pacman.x-cellsize*4,0,boardsize[1]*cellsize),pacman.y+pacman.h,ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                                    break;
                            }
                            break;
                        case "scatter":
                            ghosts["PINKY"].dir = normAI(cellsize*2,cellsize*1,ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                            break;
                        }
                    break;
        }
        }
        if(ghosts["PINKY"].state!="trapped")switch (ghosts["PINKY"].dir) {
            case 0:
                ghosts["PINKY"].y-=pacman.speed;
                break;
            case 1:
                ghosts["PINKY"].x+=pacman.speed;
                if(ghosts["PINKY"].x > (canvas.width-pacman.speed-offset[1]-(cellsize/2)))ghosts["PINKY"].x = -(cellsize/2);
                break;
            case 2:
                ghosts["PINKY"].y+=pacman.speed;
                break;
            case 3:
                ghosts["PINKY"].x-=pacman.speed;
                if(ghosts["PINKY"].x < -cellsize)ghosts["PINKY"].x = canvas.width - pacman.speed - offset[1] - (cellsize/2);
                break;
        }
    //INKY
        if(Math.round(ghosts["INKY"].x/cellsize)*cellsize===ghosts["INKY"].x && Math.round(ghosts["INKY"].y/cellsize)*cellsize===ghosts["INKY"].y){
            switch (ghosts["INKY"].state){ 
                case "norm":
                    switch(ghoststate){
                        case "chase":
                            let xx = pacman.x;
                            let yy = pacman.y+pacman.h;
                            switch(pacman.dir) {
                                case 0:
                                    xx = clamp(pacman.x-cellsize*2,0,boardsize[1]*cellsize);
                                    yy = clamp(pacman.y+pacman.h-cellsize*2,0,boardsize[1]*cellsize);
                                    break;
                                case 1:
                                    xx = clamp(pacman.x+cellsize*2,0,boardsize[1]*cellsize);
                                    break;
                                case 2:
                                    yy = clamp(pacman.y+pacman.h+cellsize*2,0,boardsize[0]*cellsize);
                                    break;
                                case 3:
                                    xx = clamp(pacman.x-cellsize*2,0,boardsize[1]*cellsize);
                                    break;
                            }
                            //for simplifying the complicated algorithm
                            INKYTARGETX = clamp(clamp(Math.abs(ghosts["BLINKY"].x-xx),0,boardsize[1]*cellsize)>xx?xx-clamp(Math.abs(ghosts["BLINKY"].x-xx),0,boardsize[0]*cellsize):xx+clamp(Math.abs(ghosts["BLINKY"].x-xx),0,boardsize[0]*cellsize),0,boardsize[0]*cellsize);
                            INKYTARGETY = clamp(clamp(Math.abs(ghosts["BLINKY"].y-yy),0,boardsize[0]*cellsize)>yy?yy-clamp(Math.abs(ghosts["BLINKY"].y-yy),0,boardsize[1]*cellsize):yy+clamp(Math.abs(ghosts["BLINKY"].y-yy),0,boardsize[1]*cellsize),0,boardsize[1]*cellsize);
                            ghosts["INKY"].dir = normAI(INKYTARGETX,INKYTARGETY,ghosts["INKY"].dir,clamp(ghosts["INKY"].x,0,boardsize[0]*cellsize),clamp(ghosts["INKY"].y,0,boardsize[1]*cellsize));
                            break;
                        case "scatter":
                            ghosts["INKY"].dir = normAI(cellsize*27,cellsize*30,ghosts["INKY"].dir,ghosts["INKY"].x,ghosts["INKY"].y);
                            break;
                    }
                    break;
            }
        }    
        if(ghosts["INKY"].state!="trapped")switch (ghosts["INKY"].dir) {
            case 0:
                ghosts["INKY"].y-=pacman.speed;
                break;
            case 1:
                ghosts["INKY"].x+=pacman.speed;
                if(ghosts["INKY"].x > (canvas.width-pacman.speed-offset[1]-(cellsize/2)))ghosts["INKY"].x = -(cellsize/2);
                break;
            case 2:
                ghosts["INKY"].y+=pacman.speed;
                break;
            case 3:
                ghosts["INKY"].x-=pacman.speed;
                if(ghosts["INKY"].x < -cellsize)ghosts["INKY"].x = canvas.width - pacman.speed - offset[1] - (cellsize/2);
                break;
        }
    //CLYDE
        if(Math.round(ghosts["CLYDE"].x/cellsize)*cellsize===ghosts["CLYDE"].x && Math.round(ghosts["CLYDE"].y/cellsize)*cellsize===ghosts["CLYDE"].y){
            switch(ghosts["CLYDE"].state) {
                case "norm":
                    switch(ghoststate){
                        case "chase":
                            if(ghosts["CLYDE"].x < pacman.x + (cellsize*8) && ghosts["CLYDE"].x > pacman.x - (cellsize*8) && ghosts["CLYDE"].y < pacman.y + (cellsize*8) && ghosts["CLYDE"].y > pacman.y - (cellsize*8)){
                                ghosts["CLYDE"].dir = randAI(ghosts["CLYDE"].dir,ghosts["CLYDE"].x,ghosts["CLYDE"].y);
                            }else{
                                ghosts["CLYDE"].dir = normAI(pacman.x,pacman.y+pacman.h,ghosts["CLYDE"].dir,ghosts["CLYDE"].x,ghosts["CLYDE"].y);
                            }
                            break;
                        case "scatter":
                            ghosts["CLYDE"].dir = normAI(cellsize*2,cellsize*30,ghosts["CLYDE"].dir,ghosts["CLYDE"].x,ghosts["CLYDE"].y);
                            break;
                    }
                    break;
            }
        }
        if(ghosts["CLYDE"].state!="trapped")switch (ghosts["CLYDE"].dir) {
            case 0:
                ghosts["CLYDE"].y-=pacman.speed;
                break;
            case 1:
                ghosts["CLYDE"].x+=pacman.speed;
                if(ghosts["CLYDE"].x > (canvas.width-pacman.speed-offset[1]-(cellsize/2)))ghosts["CLYDE"].x = -(cellsize/2);
                break;
            case 2:
                ghosts["CLYDE"].y+=pacman.speed;
                break;
            case 3:
                ghosts["CLYDE"].x-=pacman.speed;
                if(ghosts["CLYDE"].x < -cellsize)ghosts["CLYDE"].x = canvas.width - pacman.speed - offset[1]- (cellsize/2);
                break;
        }
    if (collision2(ghosts["BLINKY"].x,ghosts["BLINKY"].y,ghosts["BLINKY"].w,ghosts["BLINKY"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3)||collision2(ghosts["PINKY"].x,ghosts["PINKY"].y,ghosts["PINKY"].w,ghosts["PINKY"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3)||collision2(ghosts["INKY"].x,ghosts["INKY"].y,ghosts["INKY"].w,ghosts["INKY"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3)||collision2(ghosts["CLYDE"].x,ghosts["CLYDE"].y,ghosts["CLYDE"].w,ghosts["CLYDE"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3))
        pacmanDie();
}

function pelletBehaivor() {
    for(let i = 0; i < pellets.length; i++) {
        if(collision2(pellets[i].x+(pellets[i].w/2),pellets[i].y+(pellets[i].w/2),1,1,pacman.x-13,pacman.y+pacman.h-13,pacman.w+26,pacman.h+26)) {            
            score += 10;
            if(munch_b){munch_1.currentTime = 0;munch_2.pause();munch_1.play();munch_b=false;}else{munch_2.currentTime = 0;munch_1.pause();munch_2.play();munch_b=true;}
            pellets.splice(i, 1);
        }
    }
}

function queuedDo() {
    switch (queued) {
        case "up":
            if(pacman.x !== Math.floor(pacman.x / cellsize)*cellsize){break;}
            if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1){break;}    
            pacman.dir = 0;
            queued = "";
            break;
        case "right":
            if(pacman.y !== Math.floor(pacman.y / cellsize)*cellsize){break;}
            if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1){break;}
            pacman.dir = 1;
            queued = "";
            break;
        case "down":
            if(pacman.x !== Math.floor(pacman.x / cellsize)*cellsize){break;}                        
            if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1||tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===3){break;}
            pacman.dir = 2;
            queued = "";
            break;
        case "left":
            if(pacman.y !== Math.floor(pacman.y / cellsize)*cellsize){break;}
            if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===1){break;}
            pacman.dir = 3;
            queued = "";
            break;
        default:
            break;
    }
}

function pacmanBehavior() {
    switch (pacman.dir) {
        case 0:
            if (!(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1)) {
                pacman.y-=pacman.speed;
                if(tilemap[Math.round(pacman.y/cellsize)][Math.round(pacman.x/cellsize)]===1)pacman.y+=pacman.speed;
                if(!(tick%pacman.animspeed))pacman.anim++;
            }
            break;
        case 1:
            if (!(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1)) {
                pacman.x+=pacman.speed;
                if(pacman.x > (canvas.width-pacman.speed-offset[1]-(cellsize/2)))pacman.x = -(cellsize/2);
                if(tilemap[Math.round(pacman.y/cellsize)][Math.round(pacman.x/cellsize)]===1)pacman.x-=pacman.speed;
                if(!(tick%pacman.animspeed))pacman.anim++;
            }
            break;
        case 2:
            if (!(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1)) {
                pacman.y+=pacman.speed;
                if(tilemap[Math.round(pacman.y/cellsize)][Math.round(pacman.x/cellsize)]===1)pacman.y-=pacman.speed;
                if(!(tick%pacman.animspeed))pacman.anim++;
            }
            break;    
        case 3:
            if (!(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===1)) {
                pacman.x-=pacman.speed;
                if(tilemap[Math.round(pacman.y/cellsize)][Math.round(pacman.x/cellsize)]===1)pacman.x+=pacman.speed;
                if(pacman.x < -cellsize)pacman.x = canvas.width - pacman.speed - offset[1] - (cellsize/2);
                if(!(tick%pacman.animspeed))pacman.anim++;
            }
            break;
    }
    queuedDo();
    if(pacman.anim === pacman.animframes)pacman.anim = 0;
}

function pacmanDie(){
    begun = false;
    pacman_dead = true;
    setTimeout(restart,2000);
}
function timeBehavior(){
    switch (level) {
        case 1:
            if(Math.floor((Date.now()-TimeNow)/1000)==34)ghosts["CLYDE"].state = "norm";
            switch (Math.floor((Date.now()-TimeNow)/1000)) {
                case 7:
                    ghosts["PINKY"].state = "norm";
                case 34:
                case 41:
                case 66:
                    if(ghoststate==="chase")break;
                    ghoststate = "chase";
                    ghosts["INKY"].dir=Math.abs(ghosts["INKY"].dir+2)%4;
                    ghosts["BLINKY"].dir=Math.abs(ghosts["BLINKY"].dir+2)%4;
                    ghosts["PINKY"].dir=Math.abs(ghosts["PINKY"].dir+2)%4;
                    ghosts["CLYDE"].dir=Math.abs(ghosts["CLYDE"].dir+2)%4;
                    break;
                case 27:
                    ghosts["INKY"].state = "norm";
                case 54:
                case 61:
                    if(ghoststate==="scatter")break;
                    ghoststate = "scatter";
                    ghosts["INKY"].dir=(ghosts["INKY"].dir+2)%4;
                    ghosts["BLINKY"].dir=(ghosts["BLINKY"].dir+2)%4;
                    ghosts["PINKY"].dir=(ghosts["PINKY"].dir+2)%4;
                    ghosts["CLYDE"].dir=(ghosts["CLYDE"].dir+2)%4;
                    break;
                default:
                    break;
            }
            break;
    }
}

//run the behavior functions
async function render() {
    if(ghost_sound.currentTime >= ghost_sound.duration-0.55){ghost_sound.currentTime = 0;ghost_sound.play();}
    pacmanBehavior();
    pelletBehaivor();
    timeBehavior();
    ghostBehaivor();
    tick++;
}

//draw loop
const ooo = 13;
function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = `hsla(${(tick/12+240)},100%,50%,0.8)`;
    ctx.drawImage(map_sprite,offset[1],-80+offset[0],cellsize*28,cellsize*36);
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(score,10,50);
    if(pressedsequence.length === konami.length){konamimode =! konamimode; pressedsequence = []}
    if(konamimode)ctx.fillText("KONAMI MODE ACTIVATED",130,50)
    drawImage(ctx,pac_sprite,offset[1]+pacman.x+(cellsize/pacman.animwidth)-ooo,offset[0]+cellsize+pacman.y+(cellsize/pacman.animwidth)-ooo,pacman.w-((cellsize/pacman.animwidth)*2)+ooo*2,pacman.h-((cellsize/pacman.animwidth)*2)+ooo*2,((pacman.dir - 1) * 90)*(Math.PI/180),pacman.anim*pacman.animwidth,0,pacman.animwidth,pacman.animwidth);
    for(i in pellets) {
        ctx.fillRect(pellets[i].x+offset[1],pellets[i].y+offset[0],pellets[i].w,pellets[i].h);
    }
    for(let i = 0; i < max_health; i++)if(max_health-i<=health_points)ctx.drawImage(hp_sprite,(i*60)+30,1330,60,60);
    if(!pacman_dead){
        ctx.drawImage(ghost_sprite,(ghosts["BLINKY"].dir==0?64:ghosts["BLINKY"].dir==1?0:ghosts["BLINKY"].dir==2?96:32)+(tick%10<5?16:0),0,16,16,ghosts["BLINKY"].x+offset[1]-ooo*1.5,ghosts["BLINKY"].y+offset[0]-ooo*1.5,cellsize+ooo*3,cellsize+ooo*3);
        ctx.drawImage(ghost_sprite,(ghosts["PINKY"].dir==0?64:ghosts["PINKY"].dir==1?0:ghosts["PINKY"].dir==2?96:32)+(tick%10<5?16:0),16,16,16,ghosts["PINKY"].x+offset[1]-ooo*1.5,ghosts["PINKY"].y+offset[0]-ooo*1.5,cellsize+ooo*3,cellsize+ooo*3);
        ctx.drawImage(ghost_sprite,(ghosts["INKY"].dir==0?64:ghosts["INKY"].dir==1?0:ghosts["INKY"].dir==2?96:32)+(tick%10<5?16:0),32,16,16,ghosts["INKY"].x+offset[1]-ooo*1.5,ghosts["INKY"].y+offset[0]-ooo*1.5,cellsize+ooo*3,cellsize+ooo*3);
        ctx.drawImage(ghost_sprite,(ghosts["CLYDE"].dir==0?64:ghosts["CLYDE"].dir==1?0:ghosts["CLYDE"].dir==2?96:32)+(tick%10<5?16:0),48,16,16,ghosts["CLYDE"].x+offset[1]-ooo*1.5,ghosts["CLYDE"].y+offset[0]-ooo*1.5,cellsize+ooo*3,cellsize+ooo*3);
    }    
}

//main loop
async function update() {
    if(begun && !pacman_dead)render(); else{ghost_sound.pause();TimeNow = Date.now();}
    draw();
    requestAnimationFrame(update);
}

//setup
requestAnimationFrame(()=>
    requestAnimationFrame(()=>{
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText("PRESS ENTER TO START",canvas.width/2-("PRESS ENTER TO START".length*15), canvas.height/2);
    })
);
//when the round begins, is set to true
var begun = false;
//which munch sound to play
var munch_b = false;
(async function(){
    await getKey("Enter");
    restart();
    update();
    intro.addEventListener("ended",()=>{ghost_sound.play();begun=true;health_points--;if(health_points<0){alert("U DED");history.go(0);}});
})();