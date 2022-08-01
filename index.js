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
const boardsize = [19,21];
const cellsize = 40;
const pelletsize = 5;
const offset = [40,0];
const tilemap = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
[1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
[1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
[1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1],
[2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
[1,1,1,1,0,1,2,1,1,3,1,1,2,1,0,1,1,1,1],
[2,2,2,2,0,2,2,1,2,2,2,1,2,2,0,2,2,2,2],
[1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
[2,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,2],
[1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
[1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
[1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1],
[1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
[1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
[1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

//math
const getMin = object => {
    return Object.keys(object).filter(x => {
         return object[x] == Math.min.apply(null, 
         Object.values(object));
   });
};

//ghosts
let ghosts = {
    BLINKY: {
        x: cellsize*9,
        y: cellsize*10,
        w: cellsize,
        h: cellsize,
        dir: 3,
        state: "chase"
    },
    INKY: {
        x: cellsize*9,
        y: cellsize*10,
        w: cellsize,
        h: cellsize,
        dir: 3,
        state: "chase"
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
    x: cellsize*9,
    y: cellsize*15,
    w: cellsize,
    h: cellsize,
    dir: 3,
    //cellsize must be divisible by pacman.speed
    speed: cellsize/20,
    anim: 2,
    animframes: 3,
    animwidth: 13,
    animspeed: 5,
}

//pellets
let pellets = [];
let score = 0;
const pellet = (x,y,w,h) => pellets.push({x,y,w,h});
for(i in tilemap) {
    for(j in tilemap[i]) {
        if(tilemap[i][j] === 0) {
            pellet(j*cellsize+(cellsize/2)-(pelletsize/2),i*cellsize+cellsize+(cellsize/2)-(pelletsize/2),pelletsize,pelletsize);       
            if(tilemap[i].at(j-1)===0){pellet((j-0.5)*cellsize+(cellsize/2)-(pelletsize/2),i*cellsize+cellsize+(cellsize/2)-(pelletsize/2),pelletsize,pelletsize);}
            if(tilemap.at(i-1)[j]===0){pellet(j*cellsize+(cellsize/2)-(pelletsize/2),(i-0.5)*cellsize+cellsize+(cellsize/2)-(pelletsize/2),pelletsize,pelletsize);}
            if(j>1){
                pellet(j+0.25*cellsize+(cellsize/2)-(pelletsize/2),(i)*cellsize+cellsize+(cellsize/2)-(pelletsize/2),pelletsize,pelletsize);     
            }
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
        switch (ghosts["BLINKY"].dir) {
            case 0:
                ghosts["BLINKY"].y-=pacman.speed;
                break;
            case 1:
                ghosts["BLINKY"].x+=pacman.speed;
                if(ghosts["BLINKY"].x > canvas.width - pacman.speed)ghosts["BLINKY"].x = -cellsize;
                break;
            case 2:
                ghosts["BLINKY"].y+=pacman.speed;
                break;
            case 3:
                ghosts["BLINKY"].x-=pacman.speed;
                if(ghosts["BLINKY"].x < -cellsize)ghosts["BLINKY"].x = canvas.width - pacman.speed;
                break;
        }
        if(Math.round(ghosts["BLINKY"].x/cellsize)*cellsize===ghosts["BLINKY"].x && Math.round(ghosts["BLINKY"].y/cellsize)*cellsize===ghosts["BLINKY"].y){
            switch(ghosts["BLINKY"].state){
                case "chase":
                    ghosts["BLINKY"].dir = normAI(pacman.x,pacman.y+pacman.h,ghosts["BLINKY"].dir,ghosts["BLINKY"].x,ghosts["BLINKY"].y);
                    break;
                case "scatter":
                    ghosts["BLINKY"].dir = normAI(cellsize*18,cellsize*1,ghosts["BLINKY"].dir,ghosts["BLINKY"].x,ghosts["BLINKY"].y);
                    break;
            }
        }
        if (collision2(ghosts["BLINKY"].x,ghosts["BLINKY"].y,ghosts["BLINKY"].w,ghosts["BLINKY"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3)){
            console.log("COLLISION");
        }
    //PINKY
    //BLINKY
    //CLYDE
}

function pelletBehaivor() {
        for(let i = 0; i < pellets.length; i++) {
            //pellet collision detection is WEIRD
            if(collision2(pellets[i].x+(pellets[i].w/2),pellets[i].y+(pellets[i].w/2),1,1,pacman.x+4,pacman.y+pacman.h+4,pacman.w-5,pacman.h-5)) {            
                score += 1;
                if(munch_b){munch_1.currentTime = 0;munch_1.play();munch_b=false;}else{munch_2.currentTime = 0;munch_2.play();munch_b=true;}
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
                if(pacman.x > (canvas.width-pacman.speed))pacman.x = -cellsize;
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
                if(pacman.x < -cellsize)pacman.x = canvas.width - pacman.speed;
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
async function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillText(score,0,25);
    for(let i = 0; i < boardsize[0];i++) {
        for(let j = 0; j < boardsize[1];j++) {
            ctx.fillStyle = tilemap[j][i]===1?"blue":"black";
            ctx.fillRect(offset[1]+i*cellsize,offset[0]+j*cellsize,cellsize,cellsize)
        }
    }
    drawImage(ctx,pacsprite,offset[1]+pacman.x+(cellsize/pacman.animwidth),offset[0]+pacman.y+(cellsize/pacman.animwidth),pacman.w-((cellsize/pacman.animwidth)*2),pacman.h-((cellsize/pacman.animwidth)*2),((pacman.dir - 1) * 90)*(Math.PI/180),pacman.anim*pacman.animwidth,0,pacman.animwidth,pacman.animwidth);
    ctx.fillStyle = "#db851c";
    for(i in pellets) {
        ctx.fillRect(pellets[i].x,pellets[i].y,pellets[i].w,pellets[i].h);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(ghosts["INKY"].x,ghosts["INKY"].y,cellsize,cellsize);
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