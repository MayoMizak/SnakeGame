var width = window.innerWidth;
var height = window.innerHeight;
var row = 0;
var timer;
var highScore;
var paused = false;
var started = false;
var snake = {posX:2, posY:2, dirX:0, dirY:0, pointArray:["2,2"]};
function pageLoad() {
    var cook = document.cookie;
    var cookieArray = cook.split(";");
    var firstElement = cookieArray[0].split("=");
    if (firstElement[0] != "highScore") {
        console.log("New Cookie");
        var d = new Date();
        var nextYear = d.getFullYear() + 1;
        d.setFullYear(nextYear);
        document.cookie = "highScore=0;expires=" + String(d);
        document.getElementById("hs").innerHTML = "High Score: 0";
    } else {
        console.log("Old Cookie");
        highScore = firstElement[1];
        document.getElementById("hs").innerHTML = "High Score: " + String(highScore);
    }
}
function buildGame() {
    document.getElementById("intro").style.display = "none";
    buildTable();
    startSnake();
    makeFood();
    document.addEventListener("keydown", keyInput);
}
function buildTable() {
    document.getElementById("board").style.display = "table";
    makeEdgeRow(row);
    makeCols(0,width);
    height = height - 20;
    row++;
    while (height >= 40) {
        var tmp = document.createElement("tr");
        var tmpAtt = document.createAttribute("id");
        tmpAtt.value = String(row);
        tmp.setAttributeNode(tmpAtt);
        tmp.style.backgroundColor = "black";
        document.getElementById("board").appendChild(tmp);
        makeCols(row,width);
        height = height - 20;
        row++;
    }
    makeEdgeRow(row);
    makeCols(row,width);
}
function makeEdgeRow(id) {
    var tmp = document.createElement("tr");
    var tmpAtt = document.createAttribute("class");
    tmpAtt.value = "edge";
    tmp.setAttributeNode(tmpAtt);
    var tmpAtt = document.createAttribute("id");
    tmpAtt.value = String(id);
    tmp.setAttributeNode(tmpAtt);
    tmp.style.backgroundColor = "white";
    document.getElementById("board").appendChild(tmp);
}
function makeCols(rowId,rowWidth) {
    var col = 0;
    for (i = rowWidth; i >= 40; i = i - 20) {
        var tmp = document.createElement("td");
        var tmpAtt = document.createAttribute("class");
        if (col == 0||document.getElementById(String(rowId)).getAttribute("class") == "edge") {
            tmpAtt.value = "edge";
        } else {
            tmpAtt.value = "open";
        }
        tmp.setAttributeNode(tmpAtt);
        var tmpAtt = document.createAttribute("id");
        tmpAtt.value = rowId + "," + String(col);
        tmp.setAttributeNode(tmpAtt);
        document.getElementById(String(rowId)).appendChild(tmp);
        col++;
    }
    var tmp = document.createElement("td");
    var tmpAtt = document.createAttribute("class");
    tmpAtt.value = "edge";
    tmp.setAttributeNode(tmpAtt);
    var tmpAtt = document.createAttribute("id");
    tmpAtt.value = rowId + "," + String(col);
    tmp.setAttributeNode(tmpAtt);
    document.getElementById(String(rowId)).appendChild(tmp);
}
function startSnake() {
    pos = String(snake.posX) + "," + String(snake.posY);
    var tmpAtt = document.createAttribute("class");
    tmpAtt.value = "snake";
    document.getElementById(pos).setAttributeNode(tmpAtt);
}
function makeFood() {
    openSpace = document.getElementsByClassName("open");
    foodSpot = Math.floor(Math.random() * openSpace.length);
    var tmpAtt = document.createAttribute("class");
    tmpAtt.value = "food";
    openSpace[foodSpot].setAttributeNode(tmpAtt);
}
function keyInput(e) {
    keyCode = e.keyCode;
    switch(keyCode) {
        case 37:
            if (paused == false && snake.dirY != 1) {
                snake.dirX = 0;
                snake.dirY = -1;
            }
            if (started == false) {
                started = true;
                timer = setInterval(gameTick,100);
            }
            break;
        case 38:
            if (paused == false && snake.dirX != 1) {
                snake.dirX = -1;
                snake.dirY = 0;
            }
            if (started == false) {
                started = true;
                timer = setInterval(gameTick,100);
            }
            break;
        case 39:
            if (paused == false && snake.dirY != -1) {
                snake.dirX = 0;
                snake.dirY = 1;
            }
            if (started == false) {
                started = true;
                timer = setInterval(gameTick,100);
            }
            break;
        case 40:
            if (paused == false && snake.dirX != -1) {
                snake.dirX = 1;
                snake.dirY = 0;
            }
            if (started == false) {
                started = true;
                timer = setInterval(gameTick,100);
            }
            break;
        case 32:
            if (paused == false && started != false) {
                clearInterval(timer);
                paused = true;
            } else if (paused == true) {
                timer = setInterval(gameTick,100);
                paused = false;
            }
    }
}
function gameTick() {
    var needFood = false
    var newPosX = snake.posX + snake.dirX;
    var newPosY = snake.posY + snake.dirY;
    var newPos = String(newPosX) + "," + String(newPosY);
    var nextPos = document.getElementById(newPos);
    var nextPosState = nextPos.getAttribute("class");
    if (nextPosState == "edge"||nextPosState == "snake") {
        clearInterval(timer);
        var score = snake.pointArray.length;
        if (score > highScore) {
            console.log("NEW HIGH SCORE");
            highScore = score;
            var d = new Date();
            var nextYear = d.getFullYear() + 1;
            d.setFullYear(nextYear);
            document.cookie = "highScore=" + String(highScore) + ";expires=" + String(d);
            document.getElementById("hs").innerHTML = "High Score: " + String(highScore);
        }
        window.alert("GAME OVER!  Final Score: " + String(score));
        snake = {posX:2, posY:2, dirX:0, dirY:0, pointArray:["2,2"]};
        width = window.innerWidth;
        height = window.innerHeight;
        row = 0;
        started = false;
        paused = false;
        var tblNodes = document.getElementById("board");
        while (tblNodes.hasChildNodes()) {
            tblNodes.removeChild(tblNodes.firstChild);
        }
        tblNodes.style.display = "none";
        document.getElementById("intro").style.display = "block";
    } else {
        if (nextPosState == "food") {
            needFood = true;
            for (i = 0; i < 5; i++) {
                snake.pointArray.push("0,0");
            }
        }
        var tmpAtt = document.createAttribute("class");
        tmpAtt.value = "snake";
        nextPos.setAttributeNode(tmpAtt);
        snake.pointArray.unshift(newPos);
        lastPos = snake.pointArray.pop();
        if (lastPos != "0,0") {
            var tmpAtt = document.createAttribute("class");
            tmpAtt.value = "open";
            document.getElementById(lastPos).setAttributeNode(tmpAtt);
        }
        snake.posX = newPosX;
        snake.posY = newPosY;
        if (needFood) {
            makeFood();
        }
    }
}
