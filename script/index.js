//Attribute Setting
var radius = 5;
var canvasHeight = document.documentElement.clientHeight;
var canvasWidth = document.documentElement.clientWidth;
// init canvas
var canvas = document.getElementById("mainCanvas");
canvas.setAttribute("height", canvasHeight + "px");
canvas.setAttribute("width", canvasWidth + "px");
var canvasContext = canvas.getContext('2d');

//main section
if (canvasContext) {
    var startPoint = {x: undefined, y: undefined};
    var endPoint = {x: undefined, y: undefined};
    let onActivation = false; //是否激活相应动作，左键按下激活
    let paintMode = "paint";//paint：绘画模式 eraser：橡皮启动，清除模式
    //鼠标事件
    canvas.onmousedown = function (inf) {
        switch (paintMode) {
            case "paint":
                startPoint = {x: inf.clientX, y: inf.clientY};
                drawnDot(inf.clientX, inf.clientY, radius);
                onActivation = true;
                break;
            case "eraser":
                clearZone(inf.clientX-radius, inf.clientY-radius, radius*2);
                onActivation = true;
                break;
        }
    }

    canvas.onmousemove = function (inf) {
        if (onActivation) {
            switch (paintMode) {
                case "paint":
                    drawnDot(inf.clientX, inf.clientY, radius);
                    endPoint = {x: inf.clientX, y: inf.clientY};
                    drawnLine(startPoint, endPoint, radius);
                    startPoint = endPoint;
                    break;
                case "eraser":
                    clearZone(inf.clientX-radius, inf.clientY-radius, radius*2);
                    break;
            }
        }
    }
    canvas.onmouseup = function () {
        onActivation = false;
    }
    clearButton.onclick = function () {
        clearAll();
    }
    eraserButton.onclick = function () {
        paintMode = "eraser";
        mainCanvas.style="cursor: url(\"../img/eraser-cursor.cur\"),auto;";
        paintButton.style="display:block";
        eraserButton.style="display:none";
    }
    paintButton.onclick = function () {
        paintMode = "paint";
        mainCanvas.style="cursor: crosshair";
        eraserButton.style="display:block";
        paintButton.style="display:none"
    }

}

/*
在坐标为（x,y）处画一个半径为radius的点.
para: x/y: position
radius: the radius of the dot
 */
function drawnDot(x, y, radius) {
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
    canvasContext.fill();
}

/*
在 startPoint 和 endPoint 之间画一条宽为lineWidth的直线.
para: startPoint={x:x-index,y:y-index}
endPoint={x:x-index,y:y-index}
lineWidth: the width of the under-drawing line.
 */
function drawnLine(startPoint, endPoint, lineWidth) {
    canvasContext.beginPath();
    canvasContext.moveTo(startPoint.x, startPoint.y);
    canvasContext.lineTo(endPoint.x, endPoint.y);
    canvasContext.lineWidth = lineWidth * 2;
    canvasContext.stroke();
}

/*
清空绘画区域.
 */
function clearAll() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

/*
清空指定区域.
para: x/y: position
width: 区域长宽
 */
function clearZone(x, y, width) {
    canvasContext.clearRect(x, y, width, width);
}
