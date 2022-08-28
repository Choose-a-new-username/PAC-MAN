var level = 1;
var debug_mode = false;

//pellets
var pellets = [];
var score = 0;
const pellet = (x,y,w,h) => pellets.push({x,y,w,h});
for(i in TILEMAP) 
    for(j in TILEMAP[i]) 
        if(TILEMAP[i][j] === 0) 
            pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2),PELLET_SIZE,PELLET_SIZE);       

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
    time.now = Date.now();
    if(pacman.hp <= 0){
        history.go(0);
        return;
    }
    begun = false;
    pacman_dead = false;
    ghoststate = "scatter";
    pacman.reset();
    BLINKY_I.reset();
    PINKY_I.reset();
    INKY_I.reset();
    CLYDE_I.reset();
    if(!from){begun=true;return;}
    MUS_INTRO.currentTime = 0;
    MUS_INTRO.play();
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
                pacman.hp += 1;
                pacman.max_hp = pacman.hp>3?pacman.hp:3;
            }
            break; 
        case "h":
        case "p":
        case "-":
        case "H":
        case "P":
        case "_":
            if((keys["h"]||keys["H"])&&(keys["p"]||keys["P"])&&(keys["-"]||keys["_"])){
                pacman.hp -= 1;
                pacman.max_hp = pacman.hp>3?pacman.hp:3;
                if(pacman.hp < 0){
                    history.go(0);   
                }
            }
            break;
        case "d":
        case "b":
        case "g":
        case "D":
        case "B":
        case "G":
            if((keys["d"]||keys["D"])&&(keys["b"]||keys["B"])&&(keys["g"]||keys["G"]))
                debug_mode =! debug_mode
            break;
        case "ArrowUp":
            queued = "up";
            if(pacman.x === Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1].at(Math.round(pacman.x/CELL_SIZE))===1)) {
                pacman.dir = 0;
            }
            break;
        case "ArrowRight":
            queued = "right";
            if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===1||TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===3)) {
                pacman.dir = 1;
            }
            break;
        case "ArrowDown":
            queued = "down";
            if(pacman.x === Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1].at(Math.round(pacman.x/CELL_SIZE))===1)) {
                pacman.dir = 2;
            }
            break;
        case "ArrowLeft":
            queued = "left";
            if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.ceil(pacman.x/CELL_SIZE)-1))===1||TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===3) {
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
    BLINKY_I.ibehavior();
    PINKY_I.ibehavior();
    INKY_I.ibehavior();
    CLYDE_I.ibehavior();
    if (collision2(BLINKY_I.x,BLINKY_I.y,BLINKY_I.w,BLINKY_I.h,pacman.x+2,pacman.y+PACMAN_HEIGHT+2,PACMAN_WIDTH-6,PACMAN_HEIGHT-6)||collision2(PINKY_I.x,PINKY_I.y,PINKY_I.w,PINKY_I.h,pacman.x+1,pacman.y+PACMAN_HEIGHT+1,PACMAN_WIDTH-3,PACMAN_HEIGHT-3)||collision2(INKY_I.x,INKY_I.y,INKY_I.w,INKY_I.h,pacman.x+1,pacman.y+PACMAN_HEIGHT+1,PACMAN_WIDTH-3,PACMAN_HEIGHT-3)||collision2(CLYDE_I.x,CLYDE_I.y,CLYDE_I.w,CLYDE_I.h,pacman.x+1,pacman.y+PACMAN_HEIGHT+1,PACMAN_WIDTH-3,PACMAN_HEIGHT-3))
        pacmanDie();
}

function pelletBehaivor() {
    for(let i = 0; i < pellets.length; i++) {
        if(collision2(pellets[i].x+(pellets[i].w/2),pellets[i].y+(pellets[i].w/2),1,1,pacman.x-13,pacman.y+PACMAN_HEIGHT-13,PACMAN_WIDTH+26,PACMAN_HEIGHT+26)) {            
            score += 10;
            if(munch_b){MUS_MUNCH_1.currentTime = 0;MUS_MUNCH_2.pause();MUS_MUNCH_1.play();munch_b=false;}else{MUS_MUNCH_2.currentTime = 0;MUS_MUNCH_1.pause();MUS_MUNCH_2.play();munch_b=true;}
            pellets.splice(i, 1);
        }
    }
}

function queuedDo() {
    switch (queued) {
        case "up":
            if(pacman.x !== Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1].at(Math.round(pacman.x/CELL_SIZE))===1){break;}    
            pacman.dir = 0;
            queued = "";
            break;
        case "right":
            if(pacman.y !== Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===1){break;}
            pacman.dir = 1;
            queued = "";
            break;
        case "down":
            if(pacman.x !== Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1].at(Math.round(pacman.x/CELL_SIZE))===1||TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1].at(Math.round(pacman.x/CELL_SIZE))===3){break;}
            pacman.dir = 2;
            queued = "";
            break;
        case "left":
            if(pacman.y !== Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.ceil(pacman.x/CELL_SIZE)-1)===1){break;}
            pacman.dir = 3;
            queued = "";
            break;
        default:
            break;
    }
}

function pacmanDie(){
    MUS_DEATH.pause();
    MUS_DEATH.currentTime = 0;
    MUS_DEATH.play();
    begun = false;
    pacman_dead = true;
    MUS_DEATH.addEventListener("ended",()=>requestAnimationFrame(restart));
}

async function render() {
    if(MUS_GHOST_NORM.currentTime >= MUS_GHOST_NORM.duration-0.55){MUS_GHOST_NORM.currentTime = 0;MUS_GHOST_NORM.play();}
    pacman.move();
    pelletBehaivor();
    BLINKY_I.flip();
    ghostBehaivor();
}

//draw loop
function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(!debug_mode){
        if(konamimode){
            ctx.globalCompositeOperation = "source-in";
            ctx.fillStyle = `hsla(${(tick/12+240)},100%,50%,0.8)`;
        }
        ctx.drawImage(MAP_SPRITE,OFFSET[1],-80+OFFSET[0],CELL_SIZE*28,CELL_SIZE*36);
        if(ctx.fillStyle != "#000000"){
            ctx.fillRect(0,0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";
        }
    }
    ctx.fillStyle = "#ffffff";
    if(debug_mode)
        ctx.font = "bold 30px serif";
    else
        ctx.font = "bold 30px pixel-face";
    ctx.fillText(score,10,50);    
    for(i in pellets) {
        ctx.fillRect(pellets[i].x+OFFSET[1],pellets[i].y+OFFSET[0],pellets[i].w,pellets[i].h);
    }
    ctx.fillStyle = "#2222bb"
    if(debug_mode){
        for(i in TILEMAP[0])
            for(j in TILEMAP)
                if(TILEMAP[j][i]==1)
                    ctx.fillRect(i*CELL_SIZE+OFFSET[1],j*CELL_SIZE+CELL_SIZE+OFFSET[0],CELL_SIZE,CELL_SIZE);
        ctx.fillStyle = "#ffff00"
    }
    if(pressedsequence.length === konami.length){konamimode =! konamimode; pressedsequence = []}
    if(debug_mode)
        ctx.fillRect(pacman.x+OFFSET[1],pacman.y+CELL_SIZE+OFFSET[0]+pacman_dead*(CELL_SIZE/2),CELL_SIZE,CELL_SIZE-pacman_dead*(CELL_SIZE/2));
    else
        pacman.draw();
    if(debug_mode){
        ctx.fillStyle = "#ffffff";
        ctx.fillText(pacman.hp,30,1360,60,60)
    }else
        for(let i = 0; i < pacman.max_hp; i++)if(pacman.max_hp-i<=pacman.hp)
            ctx.drawImage(HP_SPRITE,(i*60)+30,1330,60,60);
    if(!pacman_dead){
        if(debug_mode){
            ctx.fillStyle = "#bb2222"
            ctx.fillRect(BLINKY_I.x+OFFSET[1],BLINKY_I.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#ffc0cb"
            ctx.fillRect(PINKY_I.x+OFFSET[1],PINKY_I.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#add8e6"
            ctx.fillRect(INKY_I.x+OFFSET[1],INKY_I.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#ffa500"
            ctx.fillRect(CLYDE_I.x+OFFSET[1],CLYDE_I.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
        } else {
            BLINKY_I.draw();
            PINKY_I.draw();
            INKY_I.draw();
            CLYDE_I.draw();
        }    
    }
}

//main loop
async function update() {
    if(begun && !pacman_dead)render(); else{MUS_GHOST_NORM.pause();MUS_MUNCH_1.pause();MUS_MUNCH_2.pause();time.now = Date.now();}
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
    MUS_INTRO.addEventListener("ended",()=>{MUS_GHOST_NORM.play();begun=true;pacman.hp--;});
})();