const AI = {
    ddS: [
        [64,-CELL_SIZE,-CELL_SIZE,0,-1,Math.round,Math.ceil],
        [0,CELL_SIZE,0,1,0,Math.floor,Math.round],
        [96,0,CELL_SIZE,0,1,Math.round,Math.floor],
        [32,-CELL_SIZE,0,-1,0,Math.ceil,Math.round]
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
        1,
        1,
        1,
    ],
    random: function (curdir,x,y) {
        let dirs = [0,1,2,3];
        if((x === CELL_SIZE*12 || x === CELL_SIZE*15)&&(y === CELL_SIZE*12))
            if(dirs.includes(0))dirs.splice(dirs.indexOf(0),1);        
        if(dirs.includes((curdir+2)%4))dirs.splice(dirs.indexOf((curdir+2)%4),1);
        for(let i = 0; i <= 3; i++)
            if(dirs.includes(i))if((TILEMAP[(y/CELL_SIZE-1)+this.ddS[i][4]][x/CELL_SIZE+this.ddS[i][3]]===1))dirs.splice(dirs.indexOf(i),1);
        return dirs[Math.round(Math.random()*dirs.length)]||dirs[0];
    },

    normal: function (tx,ty,curdir,x,y,state) {
        let dirs = [0,1,2,3];
        let dists = {0:0,1:0,2:0,3:0};
        if((x === CELL_SIZE*12 || x === CELL_SIZE*15)&&(y === CELL_SIZE*12)){
            delete dists["0"];
            if(dirs.includes(0))dirs.splice(dirs.indexOf(0),1);
        }
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