Math.getMin = object => {
    if(Object.keys(object).length==1)
        return Object.keys(object)[0];
    return Object.keys(object).filter(x => {return object[x] == Math.min.apply(null,Object.values(object));});
};

Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max);