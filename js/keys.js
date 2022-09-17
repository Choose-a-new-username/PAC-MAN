var keys = {
    keyspressed: {},
    pressedsequence: [],
    konami: ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","Enter","Enter"],
    konamimode: false,
    queued: "up",
    keydown: function (e) {
        if(!game_begun){
            if(e.key === "Backspace")
                username = username.slice(0,-1);
            else if(!["Enter","Shift"].includes(e.key))
                username += e.key;
        }
        if((this.keyspressed[e.code]===true)||(pacman.dead))
            return;
        this.pressedsequence.push(e.code);
        if(!(e.code === this.konami[this.pressedsequence.length-1]))
            this.pressedsequence = [];
        this.keyspressed[e.code]=true;
        switch(e.code) {
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
                break;
            case "ArrowRight":
            case "KeyD":
                this.queued = "right";
                if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)][Math.floor(pacman.x/CELL_SIZE)+1]===1))
                    pacman.dir = 1;
                break;
            case "ArrowDown":
            case "KeyS":
                this.queued = "down";
                if(pacman.x === Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1][Math.round(pacman.x/CELL_SIZE)]===1))
                    pacman.dir = 2;
                break;
            case "ArrowLeft":
            case "KeyA":
                this.queued = "left";
                if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)][Math.ceil(pacman.x/CELL_SIZE)-1]===1))
                    pacman.dir = 3;
                break;
            default:
                break;
        }
    },
    keyup: function(e){this.keyspressed[e.code]=false;}
}
