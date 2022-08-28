let time = {
    tick: 0,
    Now: Date.now(),

    wait: secs => {return new Promise(resolve => setTimeout(resolve,secs));},
}