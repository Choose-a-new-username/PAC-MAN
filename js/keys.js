let gamepadconnected = false;
window.addEventListener("gamepadconnected", () => gamepadconnected = true, false);
window.addEventListener("gamepaddisconnected", () => gamepadconnected = false, false);

function buttonPressed(b) {
    if (typeof b === "object") {
      return b.pressed;
    }
    return b === 1.0;
}
var keys = {
    keyspressed: {},
    queued: "up",
    keydown: function (e,e2) {
        if(!gamepadconnected)
            return;        
        if(!game_begun){
            if(e2 === "Backspace")
                username = username.slice(0,-1);
            else if(!(["Enter","Shift"].includes(e2)||username.length==10))
                username += e2;
        }
        if((this.keyspressed[e]===true)||(pacman.dead))
            return;
        this.keyspressed[e]=true;
        switch(e) {
            case "KeyR":
            case "KeyT":
                if(this.keyspressed["KeyR"]&&this.keyspressed["KeyT"])
                    restart(false);
                break;
            case "KeyH":
            case "KeyP":
            case "Equal":
            case "Minus":
                if(this.keyspressed["KeyH"]&&this.keyspressed["KeyP"]&&this.keyspressed["Equal"]){
                    pacman.hp += 1;
                    pacman.max_hp = pacman.hp>3?pacman.hp:3;
                }
                else if(this.keyspressed["KeyH"]&&this.keyspressed["KeyP"]&&this.keyspressed["Minus"]){
                    pacman.hp -= 1;
                    pacman.max_hp = pacman.hp>3?pacman.hp:3;
                    if(pacman.hp < 0)
                        end_game = true;
                }
                break;
            case "KeyB":
            case "KeyG":
                if(this.keyspressed["KeyD"]&&this.keyspressed["KeyB"]&&this.keyspressed["KeyG"])
                    debug_mode =! debug_mode
                break;
            case "KeyQ":
            case "KeyU":
                if(this.keyspressed["KeyQ"]&&this.keyspressed["KeyU"]&&begun)
                    game_quit = true;
                break;
            case "KeyF":
            case "KeyX":
                if(this.keyspressed["KeyF"]&&this.keyspressed["KeyX"])
                    document.getElementById("fps").style.display = document.getElementById("fps").style.display==="block"?"none":"block";
                break;
            case "ArrowUp":
            case "KeyW":
                this.queued = "up";
                if(pacman.x === AI.ddS[pacman.dir][6](pacman.x / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1][Math.round(pacman.x/CELL_SIZE)]===1))
                    pacman.dir = 0;
                else if(!((TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1][AI.ddS[pacman.dir][5](pacman.x/CELL_SIZE)+AI.ddS[pacman.dir][3]]===1)||pacman.isatedgetunnel())&&Math.diff(pacman.x,(AI.ddS[pacman.dir][5](pacman.x/CELL_SIZE)+AI.ddS[pacman.dir][3])*CELL_SIZE)<=(CELL_SIZE/8*5)){
                    pacman.x = (AI.ddS[pacman.dir][5](pacman.x/CELL_SIZE)+AI.ddS[pacman.dir][3])*CELL_SIZE;
                    pacman.dir = 0;
                }
                break;
            case "ArrowRight":
            case "KeyD":
                this.queued = "right";
                if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)][Math.floor(pacman.x/CELL_SIZE)+1]===1))
                    pacman.dir = 1;
                else if(!((TILEMAP[AI.ddS[pacman.dir][6](pacman.y/CELL_SIZE)+AI.ddS[pacman.dir][4]][Math.floor(pacman.x/CELL_SIZE)+1]===1)||pacman.isatedgetunnel())&&Math.diff(pacman.y,(AI.ddS[pacman.dir][6](pacman.y/CELL_SIZE)+AI.ddS[pacman.dir][4])*CELL_SIZE)<=(CELL_SIZE/8*5)){
                    pacman.y = (AI.ddS[pacman.dir][6](pacman.y/CELL_SIZE)+AI.ddS[pacman.dir][4])*CELL_SIZE;
                    pacman.dir = 1;
                }
                break;
            case "ArrowDown":
            case "KeyS":
                this.queued = "down";
                if(pacman.x === Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1][Math.round(pacman.x/CELL_SIZE)]===1))
                    pacman.dir = 2;
                else if(!((TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1][AI.ddS[pacman.dir][5](pacman.x/CELL_SIZE)+AI.ddS[pacman.dir][3]]===1)||pacman.isatedgetunnel())&&Math.diff(pacman.x,(AI.ddS[pacman.dir][5](pacman.x/CELL_SIZE)+AI.ddS[pacman.dir][3])*CELL_SIZE)<=(CELL_SIZE/8*5)){
                    pacman.x = (AI.ddS[pacman.dir][5](pacman.x/CELL_SIZE)+AI.ddS[pacman.dir][3])*CELL_SIZE;
                    pacman.dir = 2;
                }
                break;
            case "ArrowLeft":
            case "KeyA":
                this.queued = "left";
                if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)][Math.ceil(pacman.x/CELL_SIZE)-1]===1))
                    pacman.dir = 3;
                else if(!((TILEMAP[AI.ddS[pacman.dir][6](pacman.y/CELL_SIZE)+AI.ddS[pacman.dir][4]][Math.ceil(pacman.x/CELL_SIZE)-1]===1)||pacman.isatedgetunnel())&&Math.diff(pacman.y,(AI.ddS[pacman.dir][6](pacman.y/CELL_SIZE)+AI.ddS[pacman.dir][4])*CELL_SIZE)<=(CELL_SIZE/8*5)){
                    pacman.y = (AI.ddS[pacman.dir][6](pacman.y/CELL_SIZE)+AI.ddS[pacman.dir][4])*CELL_SIZE;
                    pacman.dir = 3;
                }
                break;
        }
    },
    keyup: function(e){this.keyspressed[e]=false;}
}
function addGamepadKeyMap(key,map,bool){
    if(map(navigator.getGamepads()[0])&&!eval(bool))
        keys.keydown(key,key);
    else
        keys.keyup(key);
}
addEventListener("keydown",e=>keys.keydown(e.code,e.key));
addEventListener("keyup",e=>keys.keyup(e.code,e.key));