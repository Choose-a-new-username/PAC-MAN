const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let keys = {};
let queued = "";
addEventListener("keydown",e=>{keys[e.key]=true;});
addEventListener("keyup",e=>{keys[e.key]=false;});

const boardsize = [20,20];
const cellsize = 40;
const offset = [40,0];
const tilemap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
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
let pacman = {
    x: cellsize,
    y: cellsize,
    w: cellsize,
    h: cellsize,
    dir: 1,
    // cellsize must be divisible by pacman.speed
    speed: cellsize/5,
    anim: 0,
    animframes: 2,
    animwidth: 16,
}
let tick = 0;

function wait(secs) {
    return new Promise(resolve => setTimeout(resolve,secs));
}

function drawImage(context, img, x, y, width, height,angle=0,dx=0,dy=0,dw=img.width,dh=img.height) {
    context.save();
    context.translate(x + width / 2, y + height / 2);
    context.rotate(angle);
    context.translate(- x - width / 2, - y - height / 2);
    context.drawImage(img, dx, dy, dw, dh, x, y, width, height);
    context.restore();
}

function pacmanBehavior() {
    if(pacman.anim === pacman.animframes)pacman.anim = 0;
    if(keys["ArrowUp"] && pacman.dir !== 0){
        if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize) {
            pacman.dir = 0;
        } else {
            queued = "up";
        }
    }
    if(keys["ArrowRight"] && pacman.dir !== 1){
        if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize) {
            pacman.dir = 1;
        } else {
            queued = "right";
        }
    }
    if(keys["ArrowDown"] && pacman.dir !== 2){
        if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize) {
            pacman.dir = 2;
        } else {
            queued = "down";
        }
    }
    if(keys["ArrowLeft"] && pacman.dir !== 3){
        if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize) {
            pacman.dir = 3;
        } else {
            queued = "left";
        }
    }
    switch (pacman.dir) {
        case 0:
            if (!tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))) {
                pacman.y-=pacman.speed;
                if(tick%10==0)pacman.anim++;
            }
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        pacman.dir = 0;
                        break;
                    case "right":
                        pacman.dir = 1;
                        break;
                    case "down":
                        pacman.dir = 2;
                        break;
                    case "left":
                        pacman.dir = 3;
                        break;
                    default:
                        break;
                }
                queued = "";
            }
            break;
        case 1:
            if (!tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)) {
                pacman.x+=pacman.speed;
                if(pacman.x > (canvas.width - cellsize))pacman.x = 0;
                if(tick%10==0)pacman.anim++;
            }
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        pacman.dir = 0;
                        break;
                    case "right":
                        pacman.dir = 1;
                        break;
                    case "down":
                        pacman.dir = 2;
                        break;
                    case "left":
                        pacman.dir = 3;
                        break;
                    default:
                        break;
                }
                queued = "";
            }
            break;
        case 2:
            if (!tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))) {
                pacman.y+=pacman.speed;
                if(tick%10==0)pacman.anim++;
            }
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        pacman.dir = 0;
                        break;
                    case "right":
                        pacman.dir = 1;
                        break;
                    case "down":
                        pacman.dir = 2;
                        break;
                    case "left":
                        pacman.dir = 3;
                        break;
                    default:
                        break;
                }
                queued = "";
            }
            break;    
        case 3:
            if (!tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)) {
                pacman.x-=pacman.speed;
                if(pacman.x < 0)pacman.x = canvas.width - cellsize;
                if(tick%10==0)pacman.anim++;
            }
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        pacman.dir = 0;
                        break;
                    case "right":
                        pacman.dir = 1;
                        break;
                    case "down":
                        pacman.dir = 2;
                        break;
                    case "left":
                        pacman.dir = 3;
                        break;
                    default:
                        break;
                }
                queued = "";
            }
            break;
    }
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