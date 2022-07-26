const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")
ctx.font = "bold 35px pixel-face";
ctx.imageSmoothingEnabled = false;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;

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
HTMLElement.prototype.hide = function() {
    this.style.display = "none";
}
HTMLElement.prototype.show = function() {
    this.style.display = "block";
}

const PACMAN_SPRITE                  = document.getElementById("pacman"),
      GHOST_SPRITE                   = document.getElementById("ghosts"),
      THE_SPRITE_WE_USE_FOR_THE_DOTS = document.getElementById("dots"),
      MAP_SPRITE                     = document.getElementById("map"),
      MAP_SPRITE_2                   = document.getElementById("map2"),
      HP_SPRITE                      = document.getElementById("health"),
      LOGO_SPRITE                    = document.getElementById("logo"),
      SCORE_SPRITE                   = document.getElementById("score"),
      FRUIT_SPRITE                   = document.getElementById("fruit"),
      MUS_INTRO                      = document.getElementById("intro"),
      MUS_MUNCH_1                    = document.getElementById("munch_1"),
      MUS_MUNCH_2                    = document.getElementById("munch_2"),
      MUS_EAT_GHOST                  = document.getElementById("eat_ghost"),
      MUS_EAT_FRUIT                  = document.getElementById("eat_fruit"),
      MUS_DEATH                      = document.getElementById("death_sound"),
      MUS_GHOST_NORM                 = document.getElementById("ghost_sound"),
      MUS_GHOST_RETREAT              = document.getElementById("xX_1h3_sound_th4t_p14ys_wh3n_th3_ghosts_h4v3_b33N_34t3n_Xx"),
      MUS_GHOST_SCARED               = document.getElementById("ghost_sound_scared");