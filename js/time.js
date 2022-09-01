let time = {
    tick: 0,
    wait: secs => {return new Promise(resolve => setTimeout(resolve,secs));},
}