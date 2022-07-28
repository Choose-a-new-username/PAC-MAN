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
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize && !(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1)) {
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
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize && !(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1))===1) {
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
const boardsize = [5,5];
const cellsize = 40;
const pelletsize = 5;
const offset = [40,0];
const tilemap = [
[1,1,1,1,1],
[1,0,0,0,1],
[1,0,0,0,1],
[1,0,0,0,1],
[1,1,1,1,1],
]

//pellet behaivior
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

//pacman object
let pacman = {
    x: cellsize,
    y: cellsize,
    w: cellsize,
    h: cellsize,
    dir: 1,
    //cellsize must be divisible by pacman.speed
    speed: cellsize/10,
    anim: 0,
    animframes: 4,
    animwidth: 16,
    animspeed: 5,
}

//time/time functions
let tick = 0;
const wait = (secs) => {return new Promise(resolve => setTimeout(resolve,secs));}

//behavior functions (movement, pellets, etc...)
function pelletBehaivor() {
    for(let i = 0; i < pellets.length-1; i++) {
        if(pellets[i].x+(pellets[1].w/2) > pacman.x && pellets[i].x < pacman.x+pacman.w && pellets[i].y+(pellets[1].h/2) >= pacman.y+pacman.h && pellets[i].y <= pacman.y+pacman.h+pacman.h) {            
            score += 1;
            if(munch_b){munch_1.play();munch_b=false;}else{munch_2.play();munch_b=true;}
            pellets.splice(i, 1);
        }
    }
}
function pacmanBehavior() {
    switch (pacman.dir) {
        case 0:
            if (!(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1)) {
                pacman.y-=pacman.speed;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1){break;}    
                        pacman.dir = 0;
                        queued = "";
                        break;
                    case "right":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1){break;}
                        pacman.dir = 1;
                        queued = "";
                        break;
                    case "down":
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1){break;}
                        pacman.dir = 2;
                        queued = "";
                        break;
                    case "left":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===1){break;}
                        pacman.dir = 3;
                        queued = "";
                        break;
                    default:
                        break;
                }
            }
            break;
        case 1:
            if (!(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1)) {
                pacman.x+=pacman.speed;
                if(pacman.x > (canvas.width - cellsize))pacman.x = 0;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1){break;}
                        pacman.dir = 0;
                        queued = "";
                        break;
                    case "right":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1){break;}
                        pacman.dir = 1;
                        queued = "";
                        break;
                    case "down":
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1){break;}
                        pacman.dir = 2;
                        queued = "";
                        break;
                    case "left":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===1){break;}
                        pacman.dir = 3;
                        queued = "";
                        break;
                    default:
                        break;
                }
            }
            break;
        case 2:
            if (!(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1)) {
                pacman.y+=pacman.speed;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
            if(pacman.y === Math.floor(pacman.y / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1){break;}
                        pacman.dir = 0;
                        queued = "";
                        break;
                    case "right":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1){break;}
                        pacman.dir = 1;
                        queued = "";
                        break;
                    case "down":
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1){break;}
                        pacman.dir = 2;
                        queued = "";
                        break;
                    case "left":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===1){break;}
                        pacman.dir = 3;
                        queued = "";
                        break;
                    default:
                        break;
                }
            }
            break;    
        case 3:
            if (!(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===1)) {
                pacman.x-=pacman.speed;
                if(pacman.x < 0)pacman.x = canvas.width - cellsize;
                if(tick%pacman.animspeed===0&&pacman.animframes>1)pacman.anim++;
            }
            if(pacman.x === Math.floor(pacman.x / cellsize)*cellsize) {
                switch (queued) {
                    case "up":
                        if(tilemap[Math.ceil(pacman.y/cellsize)-1].at(Math.round(pacman.x/cellsize))===1){break;}
                        pacman.dir = 0;
                        queued = "";
                        break;
                    case "right":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.floor(pacman.x/cellsize)+1)===1){break;}
                        pacman.dir = 1;
                        queued = "";
                        break;
                    case "down":
                        if(tilemap[Math.floor(pacman.y/cellsize)+1].at(Math.round(pacman.x/cellsize))===1){break;}
                        pacman.dir = 2;
                        queued = "";
                        break;
                    case "left":
                        if(tilemap[Math.round(pacman.y/cellsize)].at(Math.ceil(pacman.x/cellsize)-1)===1){break;}
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

//run the behavior functions
function render() {
    pacmanBehavior();
    pelletBehaivor();
    tick++;
}

//draw loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillText(score,0,25);
    for(let i = 0; i < boardsize[0];i++) {
        for(let j = 0; j < boardsize[1];j++) {
            ctx.fillStyle = tilemap[j][i]?"blue":"black";
            ctx.fillRect(offset[1]+i*cellsize,offset[0]+j*cellsize,cellsize,cellsize)
        }
    }
    ctx.fillStyle = "yellow";
    for(i in pellets) {
        ctx.fillRect(pellets[i].x,pellets[i].y,pellets[i].w,pellets[i].h);
    }
    drawImage(ctx,pacsprite,offset[1]+pacman.x,offset[0]+pacman.y,pacman.w,pacman.h,((pacman.dir - 1) * 90)*(Math.PI/180),pacman.anim*pacman.animwidth,0,pacman.animwidth,pacman.animwidth);
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