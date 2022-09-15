let username = "";
if (localStorage.length === 0)
    localStorage.setItem("items","{}"),
    setLocalStorage("highscores",{});
function usernameNaughty(){
    return ["","69","420"].includes(username.trim());
}
function getLocalStorage(ii=""){
    return ii==""?JSON.parse(localStorage.getItem("items")):JSON.parse(localStorage.getItem("items"))[ii];
}
function setLocalStorage(a,b){
    let c = getLocalStorage("");
    c[a] = b;
    localStorage.setItem("items",JSON.stringify(c));
}
function updateHighScore(){
    let a = getLocalStorage("highscores");
    a[username] = pacman.score;
    setLocalStorage("highscores",a);
}
function getHighestScore(){
    const a = getLocalStorage("highscores");
    const b = Math.getMax(a,1)[0];
    return [b,a[b]];
}