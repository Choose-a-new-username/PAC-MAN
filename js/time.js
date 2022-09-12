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
        )
}