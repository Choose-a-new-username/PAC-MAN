let time = {
    tick: 0,
    secrettick: 0,
    wait: secs => {return new Promise(resolve => setTimeout(resolve,secs));},
    waitbool: b => 
        new Promise(r =>
            (function isbool(){
                if(eval(b))
                    r();
                else
                    requestAnimationFrame(isbool);
            })()
        )
}