let time = {
    tick: 0,
    secrettick: 0,
    wait: secs => {return new Promise(resolve => setTimeout(resolve,secs));},
    waitbool: b => 
        new Promise(r =>
            (async function isbool(){
                if(eval(b))
                    r();
                else
                    requestAnimationFrame(isbool);
            })()
        ),
    calcfps: () => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        return times.length;
    }
}
