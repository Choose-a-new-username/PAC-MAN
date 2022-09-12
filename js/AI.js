const AI = {
    ddS: [
        [64,-CELL_SIZE,-CELL_SIZE,0,-1,Math.round,Math.ceil],
        [0,CELL_SIZE,0,1,0,Math.floor,Math.round],
        [96,0,CELL_SIZE,0,1,Math.round,Math.floor],
        [32,-CELL_SIZE,0,-1,0,Math.ceil,Math.round],
        [0,0,0,0,0,Math.round,Math.round]
    ],
    ppL: [
        20,
        30,
        40,
        40,
        40,
        50,
        50,
        50,
        60,
        60,
        60,
        80,
        80,
        80,
        100,
        100,
        100,
        100,
        120
    ],
    ppL2: [
        10,
        15,
        20,
        20,
        20,
        25,
        25,
        25,
        30,
        30,
        30,
        40,
        40,
        40,
        50,
        50,
        50,
        50,
        60
    ],
    asdfasdfhajklhajkl: [
        6,
        5,
        4,
        3,
        2,
        5,
        2,
        2,
        1,
        5,
        2,
        1,
        1,
        3,
        1,
        1,
        0,
        1,
        0,
    ],
    speed: {
        gn: [
            0.75,
            0.85,
            0.85,
            0.85,
            0.95,
        ],
        gp: [
            0.50,
            0.55,
            0.55,
            0.55,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
            0.60,
        ],
        pn: [
            0.80,
            0.90,
            0.90,
            0.90,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            1.00,
            0.90,
        ],
        pp: [
            0.90,
            0.95,
            0.95,
            0.95,
            1.00,
        ],  
    },
    lt: [
        [],
        [[7,34,59,84],[27,54,79]],
        [[7,34,59,1714],[27,1713,1715]],
        [[7,34,59,1714],[27,1713,1715]],
        [[7,34,59,1714],[27,173,1715]],
        [[5,30,55,1800],[25,50,1800]]
    ],
    lt2: [
        [],
        [7,27,34],
        [7,27,34],
        [7,27,34],
        [7,27,34],
        [5,25,30],
    ],
    queue: ["up","down","left","right",""],
    random: function (curdir,x,y) {
        let dirs = [0,1,2,3];
        if(dirs.includes((curdir+2)%4))dirs.splice(dirs.indexOf((curdir+2)%4),1);
        for(let i = 0; i <= 3; i++)
            if(dirs.includes(i)&&(TILEMAP[(y/CELL_SIZE-1)+this.ddS[i][4]][x/CELL_SIZE+this.ddS[i][3]]===1))dirs.splice(dirs.indexOf(i),1);
        return dirs[Math.round(Math.random()*dirs.length)]||dirs[0];
    },
    normal: function (tx,ty,curdir,x,y,state) {
        let dirs = [0,1,2,3];
        let dists = {0:0,1:0,2:0,3:0};
        delete dists[(curdir+2)%4];
        dirs.splice(dirs.indexOf((curdir+2)%4),1);
        for(let i = 0; i <= 3; i++){
            if((state==="norm")&&(i===0)&&([13,14].includes(x/CELL_SIZE))&&([14,15].includes(y/CELL_SIZE)))
                continue;
            if(dirs.includes(i))if((TILEMAP[(y/CELL_SIZE-1)+this.ddS[i][4]][x/CELL_SIZE+this.ddS[i][3]]===1)){delete dists[String(i)];dirs.splice(dirs.indexOf(i),1);(i)}
        }
        for(i in dirs)
            dists[String(dirs[i])]=Math.abs(x+(this.ddS[dirs[i]][3])*CELL_SIZE-tx)+Math.abs(y+this.ddS[dirs[i]][4]*CELL_SIZE-ty);
        let min = Math.getMin(dists);
        if(min.includes("0"))
            return 0;
        else if(min.includes("3"))
            return 3;
        else if(min.includes("2"))
           return 2;
        else if(min.includes("1"))
           return 1;
        else
           return (curdir+2)%4;
    },
    corner: function (a,b,c,d,e,f) { return (a >= c && a <= (c+e) && b >= d && b <= (d+f)); },
    corner4: function (a,b,c,d,e,f,g,h) { return this.corner(a,b,e,f,g,h) || this.corner(a+c,b,e,f,g,h) || this.corner(a,b+d,e,f,g,h) || this.corner(a+c,b+d,e,f,g,h); },
    collision2: function (a,b,c,d,e,f,g,h) { return this.corner4(a,b,c,d,e,f,g,h) || this.corner4(e,f,g,h,a,b,c,d); },
}
Number.prototype.rnd = function(p1){
    return Math.round(this / p1) * p1;
}
