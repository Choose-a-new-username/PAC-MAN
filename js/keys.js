var keys = {
    keyspressed: {},
    pressedsequence: [],
    konami: ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","Enter","Enter"],
    konamimode: false,
    queued: "up",
    keydown: function (e) {
        if((this[e.key]===true)||(pacman.dead))
            return;
        this.pressedsequence.push(e.key);
        if(!(e.key === this.konami[this.pressedsequence.length-1]))
            this.pressedsequence = [];
        this[e.key]=true;
        if(!begun)return;
        switch(e.key) {
            case "r":
            case "s":
            case "t":
            case "R":
            case "S":
            case "T":
                if((this.keyspressed["r"]||this.keyspressed["R"])&&(this.keyspressed["s"]||this.keyspressed["S"])&&(this.keyspressed["t"]||this.keyspressed["T"])&&begun)
                    restart(false);
                break;
            case "h":
            case "p":
            case "=":
            case "H":
            case "P":
            case "+":
                if((this.keyspressed["h"]||this.keyspressed["H"])&&(this.keyspressed["p"]||this.keyspressed["P"])&&(this.keyspressed["="]||this.keyspressed["+"])){
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
                if((this.keyspressed["h"]||this.keyspressed["H"])&&(this.keyspressed["p"]||this.keyspressed["P"])&&(this.keyspressed["-"]||this.keyspressed["_"])){
                    pacman.hp -= 1;
                    pacman.max_hp = pacman.hp>3?pacman.hp:3;
                    if(pacman.hp < 0)
                        history.go(0);
                }
                break;
            case "d":
            case "b":
            case "g":
            case "D":
            case "B":
            case "G":
                if((this.keyspressed["d"]||this.keyspressed["D"])&&(this.keyspressed["b"]||this.keyspressed["B"])&&(this.keyspressed["g"]||this.keyspressed["G"]))
                    debug_mode =! debug_mode
                break;
            case "f":
            case "p":
            case "s":
            case "F":
            case "P":
            case "S":
                if((this.keyspressed["f"]||this.keyspressed["F"])&&(this.keyspressed["p"]||this.keyspressed["P"])&&(this.keyspressed["s"]||this.keyspressed["S"]))
                    document.getElementById("fps").style.display = document.getElementById("fps").style.display==="none"?"block":"none";
                break;
            case "ArrowUp":
            case "w":
            case "W":          
                this.queued = "up";
                if(pacman.x === Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE && TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1].at(Math.round(pacman.x/CELL_SIZE))!==1)
                    pacman.dir = 0;
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.queued = "right";
                if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===1||TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===3))
                    pacman.dir = 1;
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.queued = "down";
                if(pacman.x === Math.floor(pacman.x / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1].at(Math.round(pacman.x/CELL_SIZE))===1))
                    pacman.dir = 2;
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.queued = "left";
                if(pacman.y === Math.floor(pacman.y / CELL_SIZE)*CELL_SIZE && !(TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.ceil(pacman.x/CELL_SIZE)-1))===1||TILEMAP[Math.round(pacman.y/CELL_SIZE)].at(Math.floor(pacman.x/CELL_SIZE)+1)===3)
                    pacman.dir = 3;
                break;
            default:
                break;
        }
    },
    keyup: function(e){this[e.key]=false;}
}
