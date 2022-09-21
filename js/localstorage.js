let username = "";
if (localStorage.length === 0)
    localStorage.setItem("items","{}"),
    setLocalStorage("highscores",{"john doe": 1000});
function usernameNaughty(){
    return ["","69","420","john doe","69420","34"].includes(username.trim());
}
function getLocalStorage(ii=""){
    return ii==""?JSON.parse(localStorage.getItem("items")):JSON.parse(localStorage.getItem("items"))[ii];
}
function setLocalStorage(a,b){
    let c = getLocalStorage();
    c[a] = b;
    localStorage.setItem("items",JSON.stringify(c));
}
function updateHighScore(){
    if(username==="nonc")
        return;
    let a = getLocalStorage("highscores");
    a[username] = pacman.score;
    setLocalStorage("highscores",a);
}
pacman.score = 0;