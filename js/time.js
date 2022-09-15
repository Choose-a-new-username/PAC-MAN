let time = {
    tick: 0,
    secrettick: 0,
    times: [],
    fps: 0,
    wait: secs => {return new Promise(resolve => setTimeout(resolve,secs));},
    waitbool: (b, b2=()=>{}) => 
        new Promise(r =>
            (async function isbool(){
                if(eval(b))
                    r();
                else
                    b2(),
                    requestAnimationFrame(isbool);
            })()
        ),
    calcfps: () => {
        const now = performance.now();
        while (time.times.length > 0 && time.times[0] <= now - 1000) {
            time.times.shift();
        }
        time.times.push(now);
        return time.times.length;
    }
}
