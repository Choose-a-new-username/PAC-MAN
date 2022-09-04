var level = 1;
var debug_mode = false;

async function restart(from=true) {
    time.tick=0;
    if(pacman.hp < 1){
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
    MUS_INTRO.currentTime = 0;
    MUS_INTRO.play();
}