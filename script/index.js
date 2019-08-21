//Attribute Setting
var thickness = 5;
var canvasHeight = document.documentElement.clientHeight;
var canvasWidth = document.documentElement.clientWidth;
// Init Canvas
var canvas = document.getElementById("mainCanvas");
canvas.setAttribute("height", canvasHeight + "px");
canvas.setAttribute("width", canvasWidth + "px");
var canvasContext = canvas.getContext('2d');

//Main Section
if (canvasContext) {
    var startPoint = {x: undefined, y: undefined};
    var endPoint = {x: undefined, y: undefined};
    var color = "black";
    var onActivation = false; //是否激活相应动作，左键按下激活
    var paintMode = "paint";//paint：绘画模式 eraser：橡皮启动，清除模式
    let eventName = "mouseEvent";// //鼠标事件，若不持支pointer和touch，则使用鼠标。
    if (document.documentElement.ontouchstart) {//支持touch事件，移动设备
        eventName = "pointerEvent";
    } else if (Window.PointerEvent) { //支持pointer事件
        eventName = "touchEvent";
    }
    setEventListener(eventName);
    //按钮事件
    clearButton.onclick = function () {
        clearAll();
    }
    eraserButton.onclick = function () {
        paintMode = "eraser";
        mainCanvas.style = "cursor: crosshair";
        eraserButton.classList.add("iconActive");
        paintButton.classList.remove("iconActive");
    }
    paintButton.onclick = function () {
        paintMode = "paint";
        mainCanvas.style = "cursor: crosshair";
        paintButton.classList.add("iconActive");
        eraserButton.classList.remove("iconActive");
    }
    colorButton.onclick = function () {
        switchColorBar();
    }
    setColorButtonEvent();

    downloadButton.onclick=function () {
        var fileName=prompt("请输入文件名",defaultStatus="MyCanvas");
        downloadLink.download=fileName;
        downloadLink.href=mainCanvas.toDataURL(fileName+".png");
    }

    thicknessButton.onclick=function(){
        if(thicknessPicker.classList.contains("Activation")){
            thicknessPicker.classList.remove("Activation");
        }else {
            thicknessPicker.classList.add("Activation");
        }}
    thicknessRange.onchange=function(){
        thickness=thicknessRange.value;
    }
}


//Function Section
function switchColorBar(){
    if (colorBar.classList.contains("unVisibleClass")) {
        colorBar.classList.add("visibleClass");
        colorButton.classList.add("iconActive");
        colorBar.classList.remove("unVisibleClass");
    } else {
        colorBar.classList.remove("visibleClass");
        colorButton.classList.remove("iconActive");
        colorBar.classList.add("unVisibleClass");
    }
}
function setColorButtonEvent(){
    blackButton.onclick = function () {
        switchColorBar();
        var newColor = "black";
        switchColor(color,newColor);
        color=newColor;
    }
    greenButton.onclick = function () {
        switchColorBar();
        var newColor = "green";
        switchColor(color,newColor);
        color=newColor;
    }
    blueButton.onclick = function () {
        switchColorBar();
        var newColor = "blue";
        switchColor(color,newColor);
        color=newColor;
    }
    redButton.onclick = function () {
        switchColorBar();
        var newColor = "red";
        switchColor(color,newColor);
        color=newColor;
    }
    orangeButton.onclick = function () {
        switchColorBar();
        var newColor = "orange";
        switchColor(color,newColor);
        color=newColor;
    }
    purpleButton.onclick = function () {
        switchColorBar();
        var newColor = "purple";
        switchColor(color,newColor);
        color=newColor;
    }

}
function switchColor(oldColor,newColor){
    var oldColorButton=document.getElementById(oldColor + "Button");
    var newColorButton=document.getElementById(newColor + "Button");
    oldColorButton.classList.remove("colorButtonActivation");
    oldColorButton.classList.add("colorButton");
    newColorButton.classList.remove("colorButton");
    newColorButton.classList.add("colorButtonActivation");
}
/*
设置不同设备的绘画流程监听器
* para: eventName ["mouseEvent"|"pointerEvent"|"touchEvent"]
 */
function setEventListener(eventName) {
    switch (eventName) {
        case "mouseEvent":
            canvas.onmousedown = function (inf) {
                paintStart(inf.clientX, inf.clientY);
            }
            canvas.onmousemove = function (inf) {
                paintOnActivation(inf.clientX, inf.clientY);
            }
            canvas.onmouseup = function () {
                onActivation = false;
            }
        case "pointerEvent":
            canvas.onpointerdown = function (inf) {
                paintStart(inf.clientX, inf.clientY);
            }
            canvas.onpointermove = function (inf) {
                paintOnActivation(inf.clientX, inf.clientY);
            }
            canvas.onpointerup = function () {
                onActivation = false;
            }
        case "touchEvent":
            canvas.ontouchstart = function (inf) {
                paintStart(inf.touches[0].clientX, inf.touches[0].clientY);
                inf.preventDefault();
            }
            canvas.ontouchmove = function (inf) {
                paintOnActivation(inf.touches[0].clientX, inf.touches[0].clientY);
                inf.preventDefault();
            }
            canvas.ontouchend = function (inf) {
                onActivation = false;
                inf.preventDefault();
            }
    }
}

/*
pointer启动后，绘画开始。分为画笔模式和橡皮擦模式。
* para: x/y 坐标
 */
function paintStart(x, y) {
    switch (paintMode) {
        case "paint":
            startPoint = {x: x, y: y};
            drawnDot(x, y, thickness);//在连接处等地方画点会增加柔顺度，更SMOOTH
            onActivation = true;
            canvas.globalCompositeOperation='source-over';
            break;
        case "eraser":
            startPoint = {x: x, y: y};
            drawnDot(x, y, thickness);//在连接处等地方画点会增加柔顺度，更SMOOTH
            onActivation = true;
            canvas.globalCompositeOperation='destination-out';
            break;
    }
}

/*
pointer移动时的主流程。
分为画笔模式和橡皮擦模式。
画笔模式在两个监测点之间画线。
橡皮擦模式在监测点除清除内容。
* para: x/y 坐标
 */
function paintOnActivation(x, y) {
    if (onActivation) {
        switch (paintMode) {
            case "paint":
                drawnDot(x, y, thickness);
                endPoint = {x: x, y: y};
                drawnLine(startPoint, endPoint, thickness);
                startPoint = endPoint;
                break;
            case "eraser":
                clearZone(x, y, thickness * 2);
                break;
        }
    }
}

/*
在坐标为（x,y）处画一个半径为thickness的点.
para: x/y: position
thickness: the thickness of the dot
 */
function drawnDot(x, y, thickness) {
    canvasContext.beginPath();
    canvasContext.arc(x, y, thickness, 0, 2 * Math.PI);
    canvasContext.fillStyle = color;
    canvasContext.fill();
}

/*
在 startPoint 和 endPoint 之间画一条宽为lineWidth的直线.
* para: startPoint={x:x-index,y:y-index}
* endPoint={x:x-index,y:y-index}
* lineWidth: the width of the under-drawing line.
 */
function drawnLine(startPoint, endPoint, lineWidth) {
    canvasContext.beginPath();
    canvasContext.moveTo(startPoint.x, startPoint.y);
    canvasContext.lineTo(endPoint.x, endPoint.y);
    canvasContext.lineWidth = lineWidth * 2;
    canvasContext.strokeStyle = color;
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
* para: x/y: position
* width: 区域长宽
 */
function clearZone(x, y, width) {
    canvasContext.clearRect(x - width / 2, y - width / 2, width, width);
}
