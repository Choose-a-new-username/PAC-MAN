async function restart(from=true) {
    endedlevelt = 60*2.5;
    if(from){
        MUS_INTRO.pause();
        MUS_INTRO.currentTime = 0;
        MUS_INTRO.play();
    }
    time.tick=0;
    begun = false;
    pacman.dead = false;
    ghoststate = "scatter";
    ["pacman","ghostmanager.BLINKY","ghostmanager.PINKY","ghostmanager.INKY","ghostmanager.CLYDE"].forEach(i=>eval(i+".reset()"));
    if(!from){begun=true;return;}
}
async function resetpellets(){
    objectmanager.objects = [];
    for(i in TILEMAP)
        for(j in TILEMAP[i])
            if(TILEMAP[i][j] === 0)
                objectmanager.objects.push(new pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2)));
            else if(TILEMAP[i][j] === 3)
                objectmanager.objects.push(new medium_pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE)));
            else if(TILEMAP[i][j] === 4)
                objectmanager.objects.push(new power_pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE)));
}
var keys = {};
var konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","Enter","Enter"];
var konamimode = false;
var pressedsequence = [];
var queued = "up";
addEventListener("keydown",e=>{
    if((keys[e.key]===true)||(pacman.dead))return;
    pressedsequence.push(e.key);
    if(!(e.key === konami[pressedsequence.length-1]))pressedsequence = [];
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
    if(ghostmanager.INKY.isdead()||ghostmanager.PINKY.isdead()||ghostmanager.BLINKY.isdead()||ghostmanager.CLYDE.isdead())
        MUS_GHOST_RETREAT.pla();
    else if(ghostmanager.INKY.scared||ghostmanager.PINKY.scared||ghostmanager.BLINKY.scared||ghostmanager.CLYDE.scared)
        MUS_GHOST_SCARED.pla();
    else
        MUS_GHOST_NORM.pla();
    pacman.update();
    objectmanager.update();
    ghostmanager.update();
}

//draw loop
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    if(konamimode)
        ctx.shadowOffsetX = Math.cos(time.secrettick/48)*2,
        ctx.shadowOffsetY = Math.sin(time.secrettick/48)*2,
        ctx.shadowColor = "#ff0000";
    if(String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))===""&&endedlevelt<60*2)
        ctx.drawImage(eval("MAP_SPRITE"+(time.secrettick%20>10?"_2":"")),OFFSET[1],-80+OFFSET[0],CELL_SIZE*28,CELL_SIZE*36);
    else    
        ctx.drawImage(MAP_SPRITE,OFFSET[1],-80+OFFSET[0],CELL_SIZE*28,CELL_SIZE*36);
    ctx.restore();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pacman.score,290-(String(pacman.score).length*35),CELL_SIZE*2);
    if(pacman.hp&&time.secrettick%40<20)
        ctx.fillText("1UP",280,CELL_SIZE);
    ctx.fillStyle = "#ffff00";
    ctx.font = "bold 35px pixel-face";
    if(!(begun||pacman.dead||String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))==="")){
        if(MUS_INTRO.currentTime > 3)            
            ctx.fillText("READY!",canvas.width/2-("READY!".length*17.5), canvas.height/2+CELL_SIZE*2.45);
        else
            ctx.fillText(`LEVEL ${level}`,canvas.width/2-(`LEVEL ${level}`.length*17.5),canvas.height/2+CELL_SIZE*2.45)
    }
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
    if(!(pacman.dead||String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))===""&&endedlevelt<60*2)){
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
    if(pacman.hp<0)
        return;
    time.tick++;
    time.secrettick++;
    if(String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))===""){
        if(endedlevelt){
            begun = false;
            endedlevelt--;
            document.querySelectorAll("audio[loop]").forEach(i=>{i.pause();i.currentTime=0;})
        }else{
            begun = true;
            level++;
            restart();
            resetpellets();
        }
    }
    if(begun && !pacman.dead)render(); else{MUS_GHOST_NORM.pause();MUS_MUNCH_1.pause();MUS_MUNCH_2.pause();if(!pacman.dead)time.tick = 0;}
    if(pacman.dead && ((time.tick%7)===0)){
        if(pacman.anim<14){
            pacman.dir = 1;
            if(pacman.anim<=2){pacman.anim=2;time.tick=(Math.round(time.tick/5)*5);}
            pacman.anim++;
        }
    }
    draw();
    document.getElementById("fps").innerHTML = "FPS: "+time.calcfps();
    requestAnimationFrame(update);
}

requestAnimationFrame(()=>
    requestAnimationFrame(()=>{
        document.getElementById("fps").innerHTML = "FPS: "+calcfps();
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
    resetpellets();
    update();
    MUS_INTRO.addEventListener("ended",()=>{MUS_GHOST_NORM.play();begun=true;});
})();
