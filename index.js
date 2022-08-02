//canvas/ctx settings
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.font = "bold 20px pixel-face";
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
const pacsprite = document.getElementById("pacman");
const mapsprite = document.getElementById("map");
const intro = document.getElementById("intro");
const munch_1 = document.getElementById("munch_1");
const munch_2 = document.getElementById("munch_2");

//key events
let keys = {};
let queued = "";
addEventListener("keydown",e=>{if(!keys[e.key]===true){
    keys[e.key]=true;
    switch(e.key) {
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
}});
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

//constants
const tilemap = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
[1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
[1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
[2,2,2,2,2,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,2,2,2,2,2],
[2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
[2,2,2,2,2,1,0,1,1,2,1,1,1,2,2,1,1,1,2,1,1,0,1,2,2,2,2,2],
[1,1,1,1,1,1,0,1,1,2,1,2,2,2,2,2,2,1,2,1,1,0,1,1,1,1,1,1],
[2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2],
[1,1,1,1,1,1,0,1,1,2,1,2,2,2,2,2,2,1,2,1,1,0,1,1,1,1,1,1],
[2,2,2,2,2,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,2,2,2,2,2],
[2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
[2,2,2,2,2,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,2,2,2,2,2],
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
const boardsize = [tilemap[0].length,tilemap.length];
const cellsize = 40;
const pelletsize = 10;
const offset = [cellsize,0];

//math
const getMin = object => {
    return Object.keys(object).filter(x => {
         return object[x] == Math.min.apply(null, 
         Object.values(object));
   });
};
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//ghosts
let ghosts = {
    BLINKY: {
        x: cellsize*9,
        y: cellsize*8,
        w: cellsize,
        h: cellsize,
        dir: 1,
        state: "scatter"
    },
    PINKY: {
        x: cellsize*9,
        y: cellsize*8,
        w: cellsize,
        h: cellsize,
        dir: 3,
        state: "scatter"
    }
};
function normAI(tx,ty,curdir,x,y) {
    let dirs = [0,1,2,3];
    let dists = {0:0,1:0,2:0,3:0};
    delete dists[dirs[dirs.indexOf(dirs.at(curdir-2))]];
    dirs.splice(dirs.indexOf(dirs.at(curdir-2)),1);
    if((tilemap[y/cellsize-2].at(x/cellsize)===1)){delete dists["0"];dirs.splice(dirs.indexOf(0),1);}
    if((tilemap[y/cellsize].at(x/cellsize)===1)){delete dists["2"];dirs.splice(dirs.indexOf(2),1);}
    if((tilemap[y/cellsize-1].at(x/cellsize-1)===1)){delete dists["3"];dirs.splice(dirs.indexOf(3),1);}
    if((tilemap[y/cellsize-1].at(x/cellsize+1)===1)){delete dists["1"];dirs.splice(dirs.indexOf(1),1);}
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
    return dirs[dirs.indexOf(dirs.at(curdir-2))];
}

//pacman
let pacman = {
    x: cellsize*13.5,
    y: cellsize*23,
    w: cellsize,
    h: cellsize,
    dir: 3,
    //cellsize must be divisible by pacman.speed
    speed: cellsize/10,
    anim: 2,
    animframes: 3,
    animwidth: 13,
    animspeed: 2,
}

//pellets
let pellets = [];
let score = 0;
const pellet = (x,y,w,h) => pellets.push({x,y,w,h});
for(i in tilemap) {
    for(j in tilemap[i]) {
        if(tilemap[i][j] === 0) {
            pellet(j*cellsize+(cellsize/2)-(pelletsize/2),i*cellsize+cellsize+(cellsize/2)-(pelletsize/2),pelletsize,pelletsize);       
        }
    }
}

//time/time functions
let tick = 0;
const wait = (secs) => {return new Promise(resolve => setTimeout(resolve,secs));}

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

//behavior functions (movement, pellets, etc...)
function ghostBehaivor() {
    //BLINKY
        if(Math.round(ghosts["BLINKY"].x/cellsize)*cellsize===ghosts["BLINKY"].x && Math.round(ghosts["BLINKY"].y/cellsize)*cellsize===ghosts["BLINKY"].y){
            switch(ghosts["BLINKY"].state){
                case "chase":
                    ghosts["BLINKY"].dir = normAI(pacman.x,pacman.y+pacman.h,ghosts["BLINKY"].dir,ghosts["BLINKY"].x,ghosts["BLINKY"].y);
                    break;
                case "scatter":
                    ghosts["BLINKY"].dir = normAI(cellsize*27,cellsize*1,ghosts["BLINKY"].dir,ghosts["BLINKY"].x,ghosts["BLINKY"].y);
                    break;
            }
        }
        switch (ghosts["BLINKY"].dir) {
            case 0:
                ghosts["BLINKY"].y-=pacman.speed;
                break;
            case 1:
                ghosts["BLINKY"].x+=pacman.speed;
                if(ghosts["BLINKY"].x > canvas.width - pacman.speed-offset[1])ghosts["BLINKY"].x = -cellsize;
                break;
            case 2:
                ghosts["BLINKY"].y+=pacman.speed;
                break;
            case 3:
                ghosts["BLINKY"].x-=pacman.speed;
                if(ghosts["BLINKY"].x < -cellsize)ghosts["BLINKY"].x = canvas.width - pacman.speed;
                break;
        }
    //PINKY
    if(Math.round(ghosts["PINKY"].x/cellsize)*cellsize===ghosts["PINKY"].x && Math.round(ghosts["PINKY"].y/cellsize)*cellsize===ghosts["PINKY"].y){
        switch(ghosts["PINKY"].state){
            case "chase":
                switch(pacman.dir) {
                    case 0:
                        ghosts["PINKY"].dir = normAI(pacman.x,clamp(pacman.y,0,boardsize[1]*cellsize),ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                        break;
                    case 1:
                        ghosts["PINKY"].dir = normAI(clamp(pacman.x+cellsize,0,boardsize[1]*cellsize),pacman.y+pacman.h,ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                        break;
                    case 2:
                        ghosts["PINKY"].dir = normAI(pacman.x,clamp(pacman.y+pacman.h+cellsize,0,boardsize[0]*cellsize),ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                        break;
                    case 3:
                        ghosts["PINKY"].dir = normAI(clamp(pacman.x-cellsize,0,boardsize[1]*cellsize),pacman.y+pacman.h,ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                        break;
                }
                break;
            case "scatter":
                ghosts["PINKY"].dir = normAI(cellsize*2,cellsize*1,ghosts["PINKY"].dir,ghosts["PINKY"].x,ghosts["PINKY"].y);
                break;
        }
    }
    switch (ghosts["PINKY"].dir) {
        case 0:
            ghosts["PINKY"].y-=pacman.speed;
            break;
        case 1:
            ghosts["PINKY"].x+=pacman.speed;
            if(ghosts["PINKY"].x > canvas.width - pacman.speed-offset[1])ghosts["PINKY"].x = -cellsize;
            break;
        case 2:
            ghosts["PINKY"].y+=pacman.speed;
            break;
        case 3:
            ghosts["PINKY"].x-=pacman.speed;
            if(ghosts["PINKY"].x < -cellsize)ghosts["PINKY"].x = canvas.width - pacman.speed;
            break;
    }
    //INKY
    //CLYDE
    if (collision2(ghosts["BLINKY"].x,ghosts["BLINKY"].y,ghosts["BLINKY"].w,ghosts["BLINKY"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3)){
        console.log("COLLISION");
    }
    if (collision2(ghosts["PINKY"].x,ghosts["PINKY"].y,ghosts["PINKY"].w,ghosts["PINKY"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3)){
        console.log("COLLISION");
    }
}

function pelletBehaivor() {
        for(let i = 0; i < pellets.length; i++) {
            //pellet collision detection is WEIRD
            if(collision2(pellets[i].x+(pellets[i].w/2),pellets[i].y+(pellets[i].w/2),1,1,pacman.x+4,pacman.y+pacman.h+4,pacman.w-5,pacman.h-5)) {            
                score += 1;
                if(munch_b){munch_1.currentTime = 0;munch_2.pause();munch_1.play();munch_b=false;}else{munch_2.currentTime = 0;munch_1.pause();munch_2.play();munch_b=true;}
                pellets.splice(i, 1);
            }
        }
}

function pacmanBehavior() {
    switch (pacman.dir) {
        case 0:
            if (!(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1||tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===3)) {
                pacman.y-=pacman.speed;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
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
            break;
        case 1:
            if (!(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1)) {
                pacman.x+=pacman.speed;
                if(pacman.x > (canvas.width-pacman.speed-offset[1]-(cellsize/2)))pacman.x = -(cellsize/2);
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
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
            break;
        case 2:
            if (!(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1)) {
                pacman.y+=pacman.speed;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
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
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1){break;}
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
            break;    
        case 3:
            if (!(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===1||tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===3)) {
                pacman.x-=pacman.speed;
                if(pacman.x < -cellsize)pacman.x = canvas.width - pacman.speed - offset[1] - (cellsize/2);
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            } 
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
            break;
    }
    if(pacman.anim === pacman.animframes)pacman.anim = 0;
}

//run the behavior functions
async function render() {
    pacmanBehavior();
    pelletBehaivor();
    ghostBehaivor();
    tick++;
}

//draw loop
const ooo = 13;
async function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillText(score,0,25);
    /*for(let i = 0; i < boardsize[0];i++) {
        for(let j = 0; j < boardsize[1];j++) {
            ctx.fillStyle = tilemap[j][i]===1?"blue":"black";
            ctx.fillRect(offset[1]+i*cellsize,offset[0]+j*cellsize,cellsize,cellsize)
        }
    }*/
    ctx.drawImage(mapsprite,0,-80,cellsize*28,cellsize*36);
    drawImage(ctx,pacsprite,offset[1]+pacman.x+(cellsize/pacman.animwidth)-ooo,offset[0]+pacman.y+(cellsize/pacman.animwidth)-ooo,pacman.w-((cellsize/pacman.animwidth)*2)+ooo*2,pacman.h-((cellsize/pacman.animwidth)*2)+ooo*2,((pacman.dir - 1) * 90)*(Math.PI/180),pacman.anim*pacman.animwidth,0,pacman.animwidth,pacman.animwidth);
    ctx.fillStyle = "#db851c";
    for(i in pellets) {
        ctx.fillRect(pellets[i].x+offset[1],pellets[i].y,pellets[i].w,pellets[i].h);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(ghosts["BLINKY"].x+offset[1],ghosts["BLINKY"].y,cellsize,cellsize);
    ctx.fillStyle = "pink";
    ctx.fillRect(ghosts["PINKY"].x+offset[1],ghosts["PINKY"].y,cellsize,cellsize);
}

//main loop
async function update() {
    if(begun)render();
    draw();
    requestAnimationFrame(update);
}

//setup
requestAnimationFrame(()=>
    requestAnimationFrame(()=>{
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText("PRESS ENTER TO START",canvas.width/2-("PRESS ENTER TO START".length*10), canvas.height/2);
    })
);
//when the round begins, is set to true
let begun = false;
//which munch sound to play
let munch_b = false;
(async function(){
    await getKey("Enter");
    intro.play();
    update();
    intro.addEventListener("ended",()=>begun=true);
})();