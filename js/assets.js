const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')
ctx.font = "bold 30px pixel-face";
ctx.imageSmoothingEnabled = false;

CanvasRenderingContext2D.prototype.drawImag = function
(
    img,
    x,
    y,
    width,
    height,
    dx=0,
    dy=0,
    dw=img.width,
    dh=img.height,
    angle=0,
)
{
    this.save();
    this.translate(x + width/2, y + height/2);
    this.rotate(angle);
    this.translate(-x - width/2, -y - height/2);
    this.drawImage(img, dx, dy, dw, dh, x, y, width, height);
    this.restore();
}
HTMLAudioElement.prototype.pla = function() {
    document.querySelectorAll("audio[loop]").forEach(i=>{i.pause();if(i.currentTime === i.duration)i.currentTime = 0;});
    this.play();
}

const PACMAN_SPRITE                    = document.getElementById("pacman"),
      GHOST_SPRITE                     = document.getElementById("ghosts"),
      THE_SPRITE_WE_USE_FOR_THE_DOTS   = document.getElementById("dots"),
      MAP_SPRITE                       = document.getElementById("map"),
      HP_SPRITE                        = document.getElementById("health"),
      MUS_INTRO                        = document.getElementById("intro"),
      MUS_MUNCH_1                      = document.getElementById("munch_1"),
      MUS_MUNCH_2                      = document.getElementById("munch_2"),
      MUS_DEATH                        = document.getElementById("death_sound"),
      MUS_GHOST_NORM                   = document.getElementById("ghost_sound"),
      MUS_GHOST_SCARED                 = document.getElementById("ghost_sound_scared");