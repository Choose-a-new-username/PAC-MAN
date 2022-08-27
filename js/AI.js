const AI = {
    ddS: [
        [64,-cellsize,-cellsize,0,-1],
        [0,cellsize,0,1,0],
        [96,0,cellsize,0,1],
        [32,-cellsize,0,-1,0]
    ],
    random: function (curdir,x,y) {
        let dirs = [0,1,2,3];
        if((x === cellsize*12 || x === cellsize*15)&&(y === cellsize*12)){
            if(dirs.includes(0))dirs.splice(dirs.indexOf(0),1);
        }
        if(dirs.includes((curdir+2)%4))dirs.splice(dirs.indexOf((curdir+2)%4),1);
        for(let i = 0; i <= 3; i++){
            if(dirs.includes(i))if((tilemap[(y/cellsize-1)+this.ddS[i][4]][x/cellsize+this.ddS[i][3]]===1)){dirs.splice(dirs.indexOf(i),1);console.log(i)}
        }
        console.log(dirs);
        return dirs[Math.round(Math.random()*dirs.length)]||dirs[0];
    },

    normal: function (tx,ty,curdir,x,y,state) {
        let dirs = [0,1,2,3];
        let dists = {0:0,1:0,2:0,3:0};
        if((x === cellsize*12 || x === cellsize*15)&&(y === cellsize*12)){
            delete dists["0"];
            if(dirs.includes(0))dirs.splice(dirs.indexOf(0),1);
        }
        delete dists[(curdir+2)%4];    
        dirs.splice(dirs.indexOf((curdir+2)%4),1);
        if(dirs.includes(0))if((tilemap[y/cellsize-2].at(x/cellsize)===1)&&!((y/cellsize==15||y/cellsize==14)&&x/cellsize>=14&&x/cellsize<=15&&(state!="trapped"))){delete dists["0"];dirs.splice(dirs.indexOf(0),1);}
        if(dirs.includes(2))if((tilemap[y/cellsize].at(x/cellsize)===1)){delete dists["2"];dirs.splice(dirs.indexOf(2),1);}
        if(dirs.includes(3))if((tilemap[y/cellsize-1].at(x/cellsize-1)===1)){delete dists["3"];dirs.splice(dirs.indexOf(3),1);}
        if(dirs.includes(1))if((tilemap[y/cellsize-1].at(x/cellsize+1)===1)){delete dists["1"];dirs.splice(dirs.indexOf(1),1);}
        for(i in dirs) {
            switch(dirs[i]){
                case 0:
                    dists["0"]=Math.abs(x-tx)+Math.abs(y-cellsize-ty);
                    break;
                case 1:
                    dists["1"]=Math.abs(x+cellsize-tx)+Math.abs(y-ty);
                    break;
                case 2:
                    dists["2"]=Math.abs(x-tx)+Math.abs(y+cellsize-ty);
                    break;
                case 3:
                    dists["3"]=Math.abs(x-cellsize-tx)+Math.abs(y-ty);
                    break;
            }
        }
        let min = getMin(dists);
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
    }
}