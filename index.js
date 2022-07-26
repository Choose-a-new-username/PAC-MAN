const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let keys = {};
let queued = "";
addEventListener("keydown",e=>{if(!keys[e.key]===true){
    keys[e.key]=true;
    switch(e.key) {
        case "ArrowUp":
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize && !tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))) {
                pacman.dir = 0;
            }
            if(pacman.dir !== 0)queued = "up";
            break;
        case "ArrowRight":
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize && !tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)) {
                pacman.dir = 1;
            }
            if(pacman.dir !== 1)queued = "right";
            break;
        case "ArrowDown":
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize && !tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))) {
                pacman.dir = 2;
            }
            if(pacman.dir !== 2)queued = "down";
            break;
        case "ArrowLeft":
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize && !tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)) {
                pacman.dir = 3;
            }
            if(pacman.dir !== 3)queued = "left";
            break;
        default:
            break;
    }
}});
addEventListener("keyup",e=>{keys[e.key]=false;});

const boardsize = [20,20];
const cellsize = 40;
const offset = [40,0];
const tilemap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]
let score = 0;
let pacman = {
    x: cellsize,
    y: cellsize,
    w: cellsize,
    h: cellsize,
    dir: 1,
    // cellsize must be divisible by pacman.speed
    speed: cellsize/10,
    anim: 0,
    animframes: 4,
    animwidth: 16,
    animspeed: 5,
}
let pellets = {};
let tick = 0;

const wait = (secs) => {return new Promise(resolve => setTimeout(resolve,secs));}

function drawImage(context, img, x, y, width, height,angle=0,dx=0,dy=0,dw=img.width,dh=img.height) {
    context.save();
    context.translate(x + width / 2, y + height / 2);
    context.rotate(angle);
    context.translate(- x - width / 2, - y - height / 2);
    context.drawImage(img, dx, dy, dw, dh, x, y, width, height);
    context.restore();
}

const pellet = (x,y) => pellets.push({x,y});

function pacmanBehavior() {
    switch (pacman.dir) {
        case 0:
            if (!tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))) {
                pacman.y-=pacman.speed;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))){break;}    
                        pacman.dir = 0;
                        queued = "";
                        break;
                    case "right":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)){break;}
                        pacman.dir = 1;
                        queued = "";
                        break;
                    case "down":
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))){break;}
                        pacman.dir = 2;
                        queued = "";
                        break;
                    case "left":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)){break;}
                        pacman.dir = 3;
                        queued = "";
                        break;
                    default:
                        break;
                }
            }
            break;
        case 1:
            if (!tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)) {
                pacman.x+=pacman.speed;
                if(pacman.x > (canvas.width - cellsize))pacman.x = 0;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))){break;}
                        pacman.dir = 0;
                        queued = "";
                        break;
                    case "right":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)){break;}
                        pacman.dir = 1;
                        queued = "";
                        break;
                    case "down":
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))){break;}
                        pacman.dir = 2;
                        queued = "";
                        break;
                    case "left":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)){break;}
                        pacman.dir = 3;
                        queued = "";
                        break;
                    default:
                        break;
                }
            }
            break;
        case 2:
            if (!tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))) {
                pacman.y+=pacman.speed;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))){break;}
                        pacman.dir = 0;
                        queued = "";
                        break;
                    case "right":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)){break;}
                        pacman.dir = 1;
                        queued = "";
                        break;
                    case "down":
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))){break;}
                        pacman.dir = 2;
                        queued = "";
                        break;
                    case "left":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)){break;}
                        pacman.dir = 3;
                        queued = "";
                        break;
                    default:
                        break;
                }
            }
            break;    
        case 3:
            if (!tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)) {
                pacman.x-=pacman.speed;
                if(pacman.x < 0)pacman.x = canvas.width - cellsize;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))){break;}
                        pacman.dir = 0;
                        queued = "";
                        break;
                    case "right":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)){break;}
                        pacman.dir = 1;
                        queued = "";
                        break;
                    case "down":
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))){break;}
                        pacman.dir = 2;
                        queued = "";
                        break;
                    case "left":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)){break;}
                        pacman.dir = 3;
                        queued = "";
                        break;
                    default:
                        break;
                }
            
            }
            break;
    }
    if(pacman.anim === pacman.animframes)pacman.anim = 0;
}

function render() {
    pacmanBehavior();
    tick++;
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < boardsize[0];i++) {
        for(let j = 0; j < boardsize[1];j++) {
            ctx.fillStyle = tilemap[j][i]?"blue":"black";
            ctx.fillRect(offset[1]+i*cellsize,offset[0]+j*cellsize,cellsize,cellsize)
        }
    }
    drawImage(ctx,document.getElementById("pacman"),offset[1]+pacman.x,offset[0]+pacman.y,pacman.w,pacman.h,((pacman.dir - 1) * 90)*(Math.PI/180),pacman.anim*pacman.animwidth,0,pacman.animwidth,pacman.animwidth);
}

async function update() {
    render();
    draw();
    requestAnimationFrame(update);
}
update();