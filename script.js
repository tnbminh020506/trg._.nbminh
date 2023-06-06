const tabDef = {
    row: 6,
    col: 6,
};

const body = document.body;
const dr = [-1, 0, 1, 0];
const dc = [0, 1, 0, -1];



//..............................................................................................................
//..............................................................................................................
//..............................................................................................................
//create variables..............................................................................................
//..............................................................................................................
//..............................................................................................................
//..............................................................................................................



var x = new Array(tabDef.row + 1)
var arr = new Array(tabDef.row + 1)
var countclick = new Array(tabDef.row + 1)
var shape = new Array(tabDef.row + 1) 
var area = new Array(tabDef.row + 1)
//
var sumrow = new Array(tabDef.row + 1);
var sumcol = new Array(tabDef.col + 1);
var wrongrow = new Array(tabDef.row + 1);
var wrongcolumn = new Array(tabDef.col + 1);
//
var fill = 0;
var error = 0;

for(let i = 0; i <= tabDef.row; i++) { 
    x[i] = new Array(tabDef.col + 1);
    arr[i] = new Array(tabDef.col + 1);
    shape[i] = new Array(tabDef.col + 1);
    countclick[i] = new Array(tabDef.col + 1);
    area[i] = new Array(tabDef.col + 1);
}

for(let i = 0; i < tabDef.row; i++) {
    for(let j = 0; j < tabDef.col; j++) {
        arr[i][j] = 0;
        countclick[i][j] = 0;
        area[i][j] = 0;
    }
}

for(let i = 0; i <= tabDef.row; i++) {
    sumrow[i] = 0;
    wrongrow[i] = 0;
}
for(let i = 0; i <= tabDef.col; i++) {
    sumcol[i] = 0;
    wrongcolumn[i] = 0;
}



//..............................................................................................................
//..............................................................................................................
//..............................................................................................................
//create database for each game phase...........................................................................
//..............................................................................................................
//..............................................................................................................
//..............................................................................................................



function getInt(num) { // return randon number from 0 to (num - 1)
    return Math.floor(Math.random() * num)
}

function inside(x, y) { // return if the coordination is inside the board
    if(x >= tabDef.row)
        return 0;
    if(x < 0)
        return 0;
    if(y >= tabDef.col)
        return 0;
    if(y < 0)
        return 0;
    return 1;
}

function fillsur(r, c) { // fill the surrounding area
    for(let i = 0; i < 4; i++) {
        var rr = r + dr[i];
        var cc = c + dc[i];
        if(inside(rr, cc) == 1) {
            if(area[rr][cc] == 0) {
                area[rr][cc] = 10;
            }
        }
    }
}

function largeship() { // create the large ship
    var r = 0
    var c = 0
    while(r == 0 || c == 0 || r == tabDef.row - 1 || c == tabDef.col - 1) {
        r = getInt(6)
        c = getInt(6)
    }
    // x[r][c].style.backgroundColor = "gray";
    area[r][c] = 3;
    var chose = getInt(2);
    //verticle direction
    if(chose == 0) {
        area[r - 1][c] = 3;
        area[r + 1][c] = 3;
        // x[r - 1][c].style.backgroundColor = "gray";
        // x[r + 1][c].style.backgroundColor = "gray";
        fillsur(r, c);
        fillsur(r - 1, c);
        fillsur(r + 1, c);
    }
    //horizontal direction
    else if(chose == 1) {
        area[r][c - 1] = 3;
        area[r][c + 1] = 3;
        // x[r][c - 1].style.backgroundColor = "gray";
        // x[r][c + 1].style.backgroundColor = "gray";
        fillsur(r, c);
        fillsur(r, c - 1);
        fillsur(r, c + 1);
    }    
}

var avoid = 9; // avoid the second ship to have the same direction as the first one
function facenoblock(r, c, sur) { // return face not blocked by other ships and the bound
    if(inside(r, c) == 0)
        return 999;
    for(let i = 0; i < 4; i++) {
        if(i % 2 == sur) {
            continue;
        }
        var rr = r + dr[i];
        var cc = c + dc[i];
        if(inside(rr, cc) == 1 && area[rr][cc] == 0) {
            area[r][c] = 2;
            area[rr][cc] = 2;
            // x[r][c].style.backgroundColor = "gray";
            // x[rr][cc].style.backgroundColor = "gray";
            fillsur(rr, cc);
            fillsur(r, c);
            avoid = i % 2;
            return i % 2;
        }
    }
    return 999;
}

function norship() { // create the smaller ship
    var r1 = 10;
    var c1 = 10;
    var r2 = 10;
    var c2 = 10;
    // first ship
    while(inside(r1, c1) == 0 || area[r1][c1] != 0 || facenoblock(r1, c1, 2) == 999) {
        r1 = getInt(6);
        c1 = getInt(6);
    }
    // second ship 
    while(inside(r2, c2) == 0 || area[r2][c2] != 0 || facenoblock(r2, c2, avoid) == 999) {
        r2 = getInt(6);
        c2 = getInt(6);
    }
}

function floating() {
    for(let k = 0; k < 3; k++) {
        var r = 10; var c = 10;
        while(inside(r, c) == 0 || area[r][c] != 0) {
            r = getInt(6);
            c = getInt(6);
        }
        area[r][c] = 1;
        // x[r][c].style.backgroundColor = "gray";
        fillsur(r, c);
    }
}

function data() { // gather all object
    largeship();
    norship();
    floating();
    for(let i = 0; i < tabDef.row; i++) {
        for(let j = 0; j < tabDef.col; j++) {
            if(area[i][j] >= 1 && area[i][j] <= 3) {
                sumrow[i]++;
                sumcol[j]++;
            }
        }
    }
    for(let i = 0; i < tabDef.row; i++) {
        x[i][tabDef.col].innerHTML = sumrow[i];
    }
    for(let j = 0; j < tabDef.col; j++) {
        x[tabDef.row][j].innerHTML = sumcol[j];
    }
}

function checkError(i, j) {
    var obrow = 0;
    var obcol = 0;
    var blrow = 0;
    var blcol = 0;

    for(let k = 0; k < tabDef.col; k++) {
        if(arr[i][k] == 2) obrow++;
        if(arr[i][k] == 0) blrow++;
    }
    for(let k = 0; k < tabDef.row; k++) {
        if(arr[k][j] == 2) obcol++;
        if(arr[k][j] == 0) blcol++;
    }

    if(arr[i][j] == 2) {
        if(obrow > sumrow[i]) { // redundant object or insufficient space
            x[i][tabDef.col].style.color = "red";
            wrongrow[i]++;
            error++;
        }
        else if(obrow <= sumrow[i]) {
            if(wrongrow[i] > 0) {
                wrongrow[i]--; 
                error--;
            }
            if(wrongrow[i] == 0) x[i][tabDef.col].style.color = "black";
        }
        if(obcol > sumcol[j]) { // redundant object or insufficient space
            x[tabDef.row][j].style.color = "red";
            wrongcolumn[j]++;
            error++;
        }
        else if(obcol <= sumcol[j]) {
            if(wrongcolumn[j] > 0) {
                wrongcolumn[j]--;
                error--;
            }
            if(wrongcolumn[j] == 0) x[tabDef.row][j].style.color = "black";
        }        
    }

    else if(arr[i][j] == 0) {
        if(blrow + obrow < sumrow[i]) { // redundant object or insufficient space
            x[i][tabDef.col].style.color = "red";
            wrongrow[i]++;
            error++;
        }
        else if(blrow + obrow >= sumrow[i]) {
            if(wrongrow[i] > 0) {
                wrongrow[i]--; 
                error--;
            }
            if(wrongrow[i] == 0) x[i][tabDef.col].style.color = "black";  
        }
        if(blcol + obcol < sumcol[j]) { // redundant object or insufficient space
            x[tabDef.row][j].style.color = "red";
            wrongcolumn[j]++;
            error++;
        }
        else if(blcol + obcol >= sumcol[j]) {
            if(wrongcolumn[j] > 0) {
                wrongcolumn[j]--;
                error--;
            }
            if(wrongcolumn[j] == 0) x[tabDef.row][j].style.color = "black";
        }  
    }
    console.log(error);
}



//..............................................................................................................
//..............................................................................................................
//..............................................................................................................
//create the objects for the game...............................................................................
//..............................................................................................................
//..............................................................................................................
//..............................................................................................................



function lastdir(r, c) { // return whether the object is fully covered by the sea
    var sea = 0;
    var out = 0;
    for(let i = 0; i < 4; i++) {
        var rr = r + dr[i];
        var cc = c + dc[i];
        if(inside(rr, cc) == 0) out++;
        else if(inside(rr, cc) == 1 && arr[rr][cc] == 1) sea++;
    }
    if(out + sea == 4)
        return 10;
}

function headship(r, c) { // return the direction of the ship
    for(let i = 0; i < 4; i++) {
        var rr = r + dr[i];
        var cc = c + dc[i];
        var ur = r + dr[(i + 2) % 4];
        var uc = c + dc[(i + 2) % 4];
        if(inside(ur, uc) == 1 && arr[ur][uc] == 2) {
            if(inside(rr, cc) == 0)
                return i;
            else if(arr[rr][cc] == 1)
                return i;
        }
    }
    return 100;
}

function midship(i, j) { // return if the object is the middle of the large ship
    if(inside(i - 1, j) == 1 && inside(i + 1, j) == 1)
        if(arr[i - 1][j] == 2 && arr[i + 1][j] == 2)
            return 1;
    if(inside(i, j - 1) == 1 && inside(i, j + 1) == 1)
        if(arr[i][j - 1] == 2 && arr[i][j + 1] == 2)
            return 1;
    return 0;
}
function done(i, j, tempp) { // choose the proper head of the ship
    remove(i, j);
    if(tempp == 0) shape[i][j].classList.add("card-up");
    else if(tempp == 1) shape[i][j].classList.add("card-right");
    else if(tempp == 2) shape[i][j].classList.add("card-down");
    else if(tempp == 3) shape[i][j].classList.add("card-left");
}

function remove(i, j) { // clear all types of shape in the button
    shape[i][j].classList.remove("square");
    shape[i][j].classList.remove("square-rad");
    shape[i][j].classList.remove("card-up");
    shape[i][j].classList.remove("card-down");
    shape[i][j].classList.remove("card-left");
    shape[i][j].classList.remove("card-right");  
    shape[i][j].classList.remove("circle"); 
}

function firstclick(i, j) {
    fill++;
    x[i][j].style.backgroundColor = "rgb(0, 191, 255)";
    arr[i][j] = 1;
    
    for(let k = 0; k < 4; k++) {
        var ii = i + dr[k];
        var jj = j + dc[k];
        // check if the clicked button creates an object fully covered by sea 
        if(inside(ii, jj) == 1 && arr[ii][jj] == 2 && lastdir(ii, jj) == 10) 
            shape[ii][jj].classList.add("circle");
        // otherwise it creates the head of the ship
        var tempp =  headship(ii, jj);
        if(inside(ii, jj) == 1 && arr[ii][jj] == 2 && tempp <= 3) {    
            done(ii, jj, tempp)
        }
    }
    checkError(i, j);    
}

function secondclick(i, j) {
    arr[i][j] = 2;

    // check if the button is surrounded by sea
    if(lastdir(i, j) == 10)
        shape[i][j].classList.add("circle");
    shape[i][j].classList.add("square-rad");
    // check if the button is the head of the ship
    var tempp = headship(i, j);
    if(tempp <= 3) {
        done(i, j, tempp)
    }
    // check if the button is the mid of the ship
    if(midship(i, j) == 1) {
        remove(i, j);
        shape[i][j].classList.add("square");
    }
    for(let k = 0; k < 4; k++) {
        var ii = i + dr[k];
        var jj = j + dc[k];
        var temp = headship(ii, jj);
        if(inside(ii, jj) == 1 && arr[ii][jj] == 2) {
            // check for the mid ship first
            if(midship(ii, jj) == 1) {
                remove(ii, jj);
                shape[ii][jj].classList.add("square");
            }
            // then check for the head ship
            else if(temp <= 3)
                done(ii, jj, temp)
        }
    }
    checkError(i, j);    
}

function thirdclick(i, j) {
    x[i][j].style.backgroundColor = "white";
    arr[i][j] = 0;
    fill--;

    for(let k = 0; k < 4; k++) {
        var ii = i + dr[k];
        var jj = j + dc[k];
        if(inside(ii, jj) == 1 && arr[ii][jj] == 2) {
            var temp = headship(ii, jj)
            //redo
            if(midship(ii, jj) == 1) {
                remove(ii, jj);
                shape[ii][jj].classList.add("square");
            }
            else if(temp <= 3)
                done(ii, jj, temp)
            else {
                remove(ii, jj);
                shape[ii][jj].classList.add("square-rad");
            }
        }
    }
    checkError(i, j);    
}

function combine(i, j) {
    remove(i, j)
    if(countclick[i][j] == 0) { 
        firstclick(i, j);
    }
    else if(countclick[i][j] == 1) { 
        secondclick(i, j);
    }
    else if(countclick[i][j] == 2) {
        thirdclick(i, j);
    }
    countclick[i][j] = (countclick[i][j] + 1) % 3; 
}



//..............................................................................................................
//..............................................................................................................
//..............................................................................................................
//initiate the game.............................................................................................
//..............................................................................................................
//..............................................................................................................
//..............................................................................................................



function createTable() {
    var tbl = document.createElement("table");
    for(let i = 0; i <= tabDef.row; i++) {
        const tr = tbl.insertRow()
        for(let j = 0; j <= tabDef.col; j++) {
            const td = tr.insertCell();
            if(i == tabDef.row || j == tabDef.col) { // hint numbers
                x[i][j] = document.createElement("article");
                x[i][j].classList.add("p");
                td.appendChild(x[i][j]);
                continue;                
            }
            x[i][j] = document.createElement("button")
            x[i][j].classList.add("a")
            shape[i][j] = document.createElement("div")
            x[i][j].appendChild(shape[i][j]);          
            td.appendChild(x[i][j]);    
            x[i][j].addEventListener("mouseup", (e) => { // the event when the button is clicked
                switch(e.button) {
                    case 0:
                        combine(i, j);
                        gameState();
                        break;
                    case 1:
                        break;
                    case 2:
                        console.log("right");
                        break;
                }
            });            
        }
    }
    tbl.align = "center";
    tbl.style.marginTop = "50px";
    body.appendChild(tbl);
}

function gameState() {
    if(fill == tabDef.row * tabDef.col) {
        document.getElementById("win").style.display = "block";
    }
}

createTable();

data();

function win() {
    location.reload();
}



