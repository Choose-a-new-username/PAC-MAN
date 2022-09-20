async function restart(from=true) {
    endedlevelt = 60*3;
    if(from)
        MUS_INTRO.pause(),
        MUS_INTRO.currentTime = 0,
        MUS_INTRO.play(),
        objectmanager.cherryeaten = 0,
        begun = false;
    else
        begun=true;
    ghoststate = "scatter";
    time.tick=0;
    ["pacman","ghostmanager.BLINKY","ghostmanager.PINKY","ghostmanager.INKY","ghostmanager.CLYDE"].forEach(i=>eval(i+".reset()"));
}

function queuedDo() {
    switch (keys.queued) {
        case "up":
            if(pacman.x !== Math.round(pacman.x / CELL_SIZE)*CELL_SIZE||TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1][Math.round(pacman.x/CELL_SIZE)]===1)
                break;
            pacman.dir = 0;
            keys.queued = "";
            break;
        case "right":
            if(pacman.y !== Math.round(pacman.y / CELL_SIZE)*CELL_SIZE||TILEMAP[Math.round(pacman.y/CELL_SIZE)][Math.floor(pacman.x/CELL_SIZE)+1]===1)
                break;
            pacman.dir = 1;
            keys.queued = "";
            break;
        case "down":
            if(pacman.x !== Math.round(pacman.x / CELL_SIZE)*CELL_SIZE||TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1][Math.round(pacman.x/CELL_SIZE)]===1)
                break;
            pacman.dir = 2;
            keys.queued = "";
            break;
        case "left":
            if(pacman.y !== Math.round(pacman.y / CELL_SIZE)*CELL_SIZE||TILEMAP[Math.round(pacman.y/CELL_SIZE)][Math.ceil(pacman.x/CELL_SIZE)-1]===1)
                break;
            pacman.dir = 3;
            keys.queued = "";
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
   if(String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))===""&&endedlevelt<60*1.5)
        ctx.drawImage(eval("MAP_SPRITE"+(time.secrettick%20>10?"_2":"")),OFFSET[1],-80+OFFSET[0],CELL_SIZE*28,CELL_SIZE*36);
    else    
        ctx.drawImage(MAP_SPRITE,OFFSET[1],-80+OFFSET[0],CELL_SIZE*28,CELL_SIZE*36);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pacman.score||"00",330-(String(pacman.score||"00").length*35),CELL_SIZE*2);
    if((pacman.hp>0)&&(time.secrettick%40<20))
        ctx.fillText("1UP",190,CELL_SIZE);
    if(pacman.score===Math.getMaxAmountV(getLocalStorage("highscores"))[0])
        ctx.fillStyle = "#ffff00";
    ctx.fillText("HIGH SCORE",430,CELL_SIZE);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(Math.getMaxAmountV(getLocalStorage("highscores"))[0]||"00",715-String(Math.getMaxAmountV(getLocalStorage("highscores"))[0]||"00").length*35,CELL_SIZE*2)
    ctx.fillStyle = "#ffff00";
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
    if(!pacman.ate)
        if(debug_mode)
            ctx.fillRect(pacman.x+OFFSET[1],pacman.y+CELL_SIZE+OFFSET[0]+pacman.dead*(CELL_SIZE/2),CELL_SIZE,CELL_SIZE-pacman.dead*(CELL_SIZE/2));
        else
            pacman.draw();
    for(let i = 0; i < pacman.max_hp; i++)
        if(pacman.max_hp-i<=pacman.hp)
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
let aa = false;
async function update() {
    if(!(gamepadconnected&&navigator.getGamepads()))
        await time.waitbool("gamepadconnected&&navigator.getGamepads()",()=>{
            ctx.fillStyle = "white";
            ctx.fillText("PLEASE CONNECT CONTROLLER",canvas.width/2-("PLEASE CONNECT CONTROLLER".length*35/2),canvas.height/2);
        });
    addGamepadKeyMap("ArrowUp",   e=>{return Math.round(e.axes[7])===-1||Math.round(e.axes[1])===-1;},"pacman.dir===0");
    addGamepadKeyMap("ArrowDown", e=>{return Math.round(e.axes[7])===1||Math.round(e.axes[1])===1},"pacman.dir===2");
    addGamepadKeyMap("ArrowLeft", e=>{return Math.round(e.axes[6])===-1||Math.round(e.axes[0])===-1},"pacman.dir===3");
    addGamepadKeyMap("ArrowRight",e=>{return Math.round(e.axes[6])===1||Math.round(e.axes[0])===1},"pacman.dir===1");
    if(end_game)
        return pacman.dieend();
    if(game_quit){
        ctx.fillStyle = "black";
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        let a = getLocalStorage("highscores"); 
        ctx.fillText("SCORES:",0,40);
        document.querySelectorAll("audio").forEach(i=>i.pause());
        document.querySelectorAll("audio[loop]").forEach(i=>i.pause());
        aa = false;
        window.setTimeout(()=>aa=true,1000)
        await time.waitbool("aa||keys.keyspressed[\"Enter\"]");
        clearTimeout();
        let i2 = 0;
        for(i of Math.getMaxAmountK(a))
            ctx.fillText(`${i2+1}.${" ".repeat(String(Object.keys(a).length).length-String(i2+1).length+1)}${i}:${" ".repeat(Object.keys(a).length===1?1:Math.sortl(a)[0].length-i.length+1)}${a[i]}`,0,(i2+2)*40),
            i2++,
            await time.wait(250);
        await time.waitbool("!keys.keyspressed[\"Enter\"]");
        await time.waitbool("keys.keyspressed[\"Enter\"]");
        await time.waitbool("!keys.keyspressed[\"Enter\"]");
        end_game = false;
        return reset();
    }
    if(!pacman.ate)
        time.tick++;
    time.secrettick++;
    if(String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))==="")
        if(endedlevelt)
            begun = false,
            endedlevelt--,
            document.querySelectorAll("audio[loop]").forEach(i=>{i.pause();i.currentTime=0;});
        else
            begun = true,
            level++,
            restart(),
            objectmanager.resetpellets();
    if(begun && !pacman.dead)
        render();
    else {
        MUS_GHOST_NORM.pause();
        MUS_MUNCH_1.pause();
        MUS_MUNCH_2.pause();
        if(!pacman.dead)
            time.tick = 0;
    }
    if(pacman.dead && ((time.tick%7)===0))
        if(pacman.anim<14){
            pacman.dir = 1;
            if(pacman.anim<=2)
                pacman.anim=2,
                time.tick = time.tick.rnd(5);
            pacman.anim++;
        }
    updateHighScore();
    draw();
    window.requestAnimationFrame(update);
}
var begun = false;
var munch_b = false;
async function reset(){
    if(!gamepadconnected)
        await time.waitbool("gamepadconnected",()=>{
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "white";
            ctx.fillText("PLEASE CONNECT CONTROLLER",canvas.width/2-("PLEASE CONNECT CONTROLLER".length*35/2),canvas.height/2);
        });
    window.requestAnimationFrame(()=>
        window.requestAnimationFrame(async ()=>{
            ctx.fillStyle = "black"
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "white";
            ctx.drawImage(LOGO_SPRITE,canvas.width/2-400,canvas.height/2-200,800,175);
            ctx.fillText("PLEASE WAIT FOR CASHIER",canvas.width/2-("PLEASE WAIT FOR CASHIER".length*35/2),canvas.height/2+80);
            ctx.fillText("TO START THE GAME",canvas.width/2-("TO START THE GAME".length*35/2),canvas.height/2+120);
        })
    );
    document.querySelectorAll("audio").forEach(i=>i.pause());
    document.querySelectorAll("audio[loop]").forEach(i=>i.pause());
    begun = game_begun = game_quit = false;
    level = 1;
    await time.waitbool("keys.keyspressed[\"Enter\"]");
    username = "";
    await time.waitbool("!keys.keyspressed[\"Enter\"]");
    await time.waitbool("keys.keyspressed[\"Enter\"]&&!usernameNaughty()",()=>{
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText("PLEASE TELL THE CASHIER",canvas.width/2-("PLEASE TELL THE CASHIER".length*35)/2,canvas.height/2-120)
        ctx.fillText("YOUR NAME.",canvas.width/2-("YOUR NAME.".length*35)/2,canvas.height/2-80)
        ctx.fillText(username,canvas.width/2-(username.length*35)/2,canvas.height/2);
    });
    if(getLocalStorage("highscores").hasOwnProperty(username))
        pacman.score = getLocalStorage("highscores")[username];
    game_begun=true;
    restart()
    objectmanager.resetpellets();
    update();
    MUS_INTRO.addEventListener("ended",()=>{MUS_GHOST_NORM.play();begun=true;});
}
time.calcfps();
reset();