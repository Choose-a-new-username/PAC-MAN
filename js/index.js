async function restart(from=true) {
    if(from){
        MUS_INTRO.pause();
        MUS_INTRO.currentTime = 0;
        MUS_INTRO.play();
    }
    time.tick=0;
    pacman.hp--;
    if(pacman.hp < 0){
        history.go(0);
        return;
    }
    begun = false;
    pacman.dead = false;
    ghoststate = "scatter";
    pacman.reset();
    ghostmanager.BLINKY.reset();
    ghostmanager.PINKY.reset();
    ghostmanager.INKY.reset();
    ghostmanager.CLYDE.reset();
    if(!from){begun=true;return;}
}
var keys = {};
var konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","Enter","Enter"];
var konamimode = false;
var pressedsequence = [];
var queued = "up";
addEventListener("keydown",e=>{
    if((keys[e.key]===true)||(pacman.dead))return;
    //konami section starts
        pressedsequence.push(e.key);
        if(!(e.key === konami[pressedsequence.length-1]))pressedsequence = [];
    //konami section ends
    keys[e.key]=true;
    if(!begun)return;
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
            if(pacman.x === Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE && TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1].at(Math.round(pacman.x/CELL_SIZE))!==1)
                pacman.dir = 0;
            break;
        case "ArrowRight":
            queued = "right";
            if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===1||TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===3))
                pacman.dir = 1;
            break;
        case "ArrowDown":
            queued = "down";
            if(pacman.x === Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1].at(Math.round(pacman.x/CELL_SIZE))===1))
                pacman.dir = 2;
            break;
        case "ArrowLeft":
            queued = "left";
            if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.ceil(pacman.x/CELL_SIZE)-1))===1||TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===3)
                pacman.dir = 3;
            break;
        default:
            break;
    }
});
addEventListener("keyup",e=>{keys[e.key]=false;});

function queuedDo() {
    switch (queued) {
        case "up":
            if(pacman.x !== Math.round(pacman.x / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1].at(Math.round(pacman.x/CELL_SIZE))===1){break;}
            pacman.dir = 0;
            queued = "";
            break;
        case "right":
            if(pacman.y !== Math.round(pacman.y / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===1){break;}
            pacman.dir = 1;
            queued = "";
            break;
        case "down":
            if(pacman.x !== Math.round(pacman.x / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1].at(Math.round(pacman.x/CELL_SIZE))===1){break;}
            pacman.dir = 2;
            queued = "";
            break;
        case "left":
            if(pacman.y !== Math.round(pacman.y / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.ceil(pacman.x/CELL_SIZE)-1)===1){break;}
            pacman.dir = 3;
            queued = "";
            break;
        default:
            break;
    }
}

async function render() {
    if(ghostmanager.INKY.state==="dead"||ghostmanager.PINKY.state==="dead"||ghostmanager.BLINKY.state==="dead"||ghostmanager.CLYDE.state==="dead")
        MUS_GHOST_RETREAT.pla();
    else if(ghostmanager.INKY.scared>0||ghostmanager.PINKY.scared>0||ghostmanager.BLINKY.scared>0||ghostmanager.CLYDE.scared>0)
        MUS_GHOST_SCARED.pla();
    else
        MUS_GHOST_NORM.pla();
    pacman.update();
    objectmanager.update();
    ghostmanager.update();
}

//draw loop
function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(konamimode){
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = `hsla(${(time.secrettick*2+240)},100%,50%,0.8)`;
    }
    ctx.drawImage(MAP_SPRITE,OFFSET[1],-80+OFFSET[0],CELL_SIZE*28,CELL_SIZE*36);
    if(konamimode){
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pacman.score,10,50);
    ctx.fillStyle = "#ffff00";
    ctx.font = "bold 35px pixel-face";
    if(!begun&&!pacman.dead)
        ctx.fillText("READY!",canvas.width/2-("READY!".length*17.5), canvas.height/2+CELL_SIZE*2.45)
    for(i in objectmanager.objects)
        objectmanager.objects[i].draw();
    ctx.fillStyle = "#2222bb"
    if(debug_mode){
        for(i in TILEMAP[0])
            for(j in TILEMAP)
                if(TILEMAP[j][i]===1)
                    ctx.fillRect(i*CELL_SIZE+OFFSET[1],j*CELL_SIZE+CELL_SIZE+OFFSET[0],CELL_SIZE,CELL_SIZE);
        ctx.fillStyle = "#ffff00"
    }
    if(pressedsequence.length === konami.length){konamimode =! konamimode; pressedsequence = []}
    if(!pacman.ate)
        if(debug_mode)
            ctx.fillRect(pacman.x+OFFSET[1],pacman.y+CELL_SIZE+OFFSET[0]+pacman.dead*(CELL_SIZE/2),CELL_SIZE,CELL_SIZE-pacman.dead*(CELL_SIZE/2));
        else
            pacman.draw();
    for(let i = 0; i < pacman.max_hp; i++)if(pacman.max_hp-i<=pacman.hp)
        ctx.drawImage(HP_SPRITE,(i*(CELL_SIZE*1.9))+5,CELL_SIZE*33.6,CELL_SIZE*1.8,CELL_SIZE*1.9);
    if(!pacman.dead){
        if(debug_mode){
            ctx.fillStyle = "#bb2222"
            ctx.fillRect(ghostmanager.BLINKY.x+OFFSET[1],ghostmanager.BLINKY.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#ffc0cb"
            ctx.fillRect(ghostmanager.PINKY.x+OFFSET[1],ghostmanager.PINKY.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#add8e6"
            ctx.fillRect(ghostmanager.INKY.x+OFFSET[1],ghostmanager.INKY.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#ffa500"
            ctx.fillRect(ghostmanager.CLYDE.x+OFFSET[1],ghostmanager.CLYDE.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
        }else{
            ghostmanager.BLINKY.draw();
            ghostmanager.PINKY.draw();
            ghostmanager.INKY.draw();
            ghostmanager.CLYDE.draw();
        }
    }
}

//main loop
async function update() {
    if(begun && !pacman.dead)render(); else{MUS_GHOST_NORM.pause();MUS_MUNCH_1.pause();MUS_MUNCH_2.pause();if(!pacman.dead)time.tick = 0;}
    if(pacman.dead && ((time.tick%7)===0)){
        if(pacman.anim<14){
            pacman.dir = 1;
            if(pacman.anim<=2){pacman.anim=2;time.tick=(Math.round(time.tick/5)*5);}
            pacman.anim++;
        }
    }
    draw();
    requestAnimationFrame(update);
    time.tick++;
    time.secrettick++;
}

//setup
requestAnimationFrame(()=>
    requestAnimationFrame(()=>{
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText("PRESS ENTER TO START",canvas.width/2-("PRESS ENTER TO START".length*15), canvas.height/2);
    })
);
var begun = false;
var munch_b = false;
(async function(){
    await time.waitbool("keys[\"Enter\"]");
    restart();
    update();
    MUS_INTRO.addEventListener("ended",()=>{MUS_GHOST_NORM.play();begun=true;});
})();