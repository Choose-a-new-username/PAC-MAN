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
const pac_sprite    = document.getElementById("pacman"),
      ghost_sprite  = document.getElementById("ghosts"),
      map_sprite    = document.getElementById("map"),
      hp_sprite     = document.getElementById("health"),
      intro         = document.getElementById("intro"),
      munch_1       = document.getElementById("munch_1"),
      munch_2       = document.getElementById("munch_2"),
      death_sound       = document.getElementById("death_sound"),
      ghost_sound   = document.getElementById("ghost_sound");

//math
const getMin = object => {
    if(Object.keys(object).length==1)
        return Object.keys(object)[0];
    return Object.keys(object).filter(x => {return object[x] == Math.min.apply(null,Object.values(object));});
};
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

//levels
var level = 1;

//ghosts
var ghosts = {};
var ghoststate = "scatter";
function normAI(tx,ty,curdir,x,y,state) {
    let dirs = [0,1,2,3];
    let dists = {0:0,1:0,2:0,3:0};
    if((x === cellsize*12 || x === cellsize*15)&&(y === cellsize*12)){
        delete dists["0"];
        if(dirs.includes(0))dirs.splice(dirs.indexOf(0),1);
    }
    delete dists[(curdir+2)%4];    
    dirs.splice(dirs.indexOf((curdir+2)%4),1);
    if(dirs.includes(0))if((tilemap[y/cellsize-2].at(x/cellsize)===1)&&!((y/cellsize==15||y/cellsize==14)&&x/cellsize>=14&&x/cellsize<=15&&(state!="trapped"))){delete dists["0"];dirs.splice(dirs.indexOf(0),1);}
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
    }else{
        return (curdir+2)%4
    }
}

//pacman
var pacman = {}
var pacman_dead = false;
var debug_mode = false;
var health_points = 3;
var max_health = 3;

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
async function restart(from=true) {
    tick=0;
    TimeNow = Date.now();
    if(health_points < 0){
        history.go(0);
        return;
    }
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
        animwidth: 16,
        animheight: 16,
        animspeed: 2,
    }
    ghosts = {
        BLINKY: new BLINKY(),
        PINKY: new PINKY(),
        INKY: new INKY(),
        CLYDE: new CLYDE(),
    };
    if(!from){begun=true;return;}
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
                restart(false);            
            }
            break;
        case "h":
        case "p":
        case "=":
        case "H":
        case "P":
        case "+":
            if((keys["h"]||keys["H"])&&(keys["p"]||keys["P"])&&(keys["="]||keys["+"])){
                health_points += 1;
                max_health = health_points>3?health_points:3;
            }
            break; 
        case "h":
        case "p":
        case "-":
        case "H":
        case "P":
        case "_":
            if((keys["h"]||keys["H"])&&(keys["p"]||keys["P"])&&(keys["-"]||keys["_"])){
                health_points -= 1;
                max_health = health_points>3?health_points:3;
                if(health_points < 0){
                    history.go(0);   
                }
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

function ghostBehaivor() {
    ghosts["BLINKY"].ibehavior();
    ghosts["PINKY"].ibehavior();
    ghosts["INKY"].ibehavior();
    ghosts["CLYDE"].ibehavior();
    if (collision2(ghosts["BLINKY"].x,ghosts["BLINKY"].y,ghosts["BLINKY"].w,ghosts["BLINKY"].h,pacman.x+2,pacman.y+pacman.h+2,pacman.w-6,pacman.h-6)||collision2(ghosts["PINKY"].x,ghosts["PINKY"].y,ghosts["PINKY"].w,ghosts["PINKY"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3)||collision2(ghosts["INKY"].x,ghosts["INKY"].y,ghosts["INKY"].w,ghosts["INKY"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3)||collision2(ghosts["CLYDE"].x,ghosts["CLYDE"].y,ghosts["CLYDE"].w,ghosts["CLYDE"].h,pacman.x+1,pacman.y+pacman.h+1,pacman.w-3,pacman.h-3))
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
    death_sound.pause();
    death_sound.currentTime = 0;
    death_sound.play();
    begun = false;
    pacman_dead = true;
    death_sound.addEventListener("ended",()=>requestAnimationFrame(restart));
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
                    ghosts["INKY"].dir=(ghosts["INKY"].dir+2)%4;
                    ghosts["BLINKY"].dir=(ghosts["BLINKY"].dir+2)%4;
                    ghosts["PINKY"].dir=(ghosts["PINKY"].dir+2)%4;
                    ghosts["CLYDE"].dir=(ghosts["CLYDE"].dir+2)%4;
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
}

//draw loop
const ooo = 15;
function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(konamimode){
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = `hsla(${(tick/12+240)},100%,50%,0.8)`;
    }
    ctx.drawImage(map_sprite,offset[1],-80+offset[0],cellsize*28,cellsize*36);
    if(ctx.fillStyle != "#000000"){
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
    }
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(score,10,50);
    if(pressedsequence.length === konami.length){konamimode =! konamimode; pressedsequence = []}
    drawImage(ctx,pac_sprite,offset[1]+pacman.x+(cellsize/pacman.animwidth)-ooo,offset[0]+cellsize+pacman.y+(cellsize/pacman.animheight)-ooo,pacman.w-((cellsize/pacman.animwidth)*2)+ooo*2,pacman.h-((cellsize/pacman.animheight)*2)+ooo*2,((pacman.dir - 1) * 90)*(Math.PI/180),pacman.anim*pacman.animwidth+2,0,pacman.animwidth-1,pacman.animheight-1);
    for(i in pellets) {
        ctx.fillRect(pellets[i].x+offset[1],pellets[i].y+offset[0],pellets[i].w,pellets[i].h);
    }
    for(let i = 0; i < max_health; i++)if(max_health-i<=health_points)ctx.drawImage(hp_sprite,(i*60)+30,1330,60,60);
    if(!pacman_dead){
        ghosts["BLINKY"].draw();
        ghosts["PINKY"].draw();
        ghosts["INKY"].draw();
        ghosts["CLYDE"].draw();
    }    
}

//main loop
async function update() {
    if(begun && !pacman_dead)render(); else{ghost_sound.pause();TimeNow = Date.now();}
    if(pacman_dead && (tick%7==0)){
        if(pacman.anim<14){
            pacman.dir = 1;
            if(pacman.anim<=2){pacman.anim=2;tick=(Math.round(tick/5)*5);}
            pacman.anim++;
        }
    }
    draw();
    requestAnimationFrame(update);
    tick++;
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
    intro.addEventListener("ended",()=>{ghost_sound.play();begun=true;health_points--;});
})();