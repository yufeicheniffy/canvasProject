var canvas = document.getElementById("mainCanvas");
canvas.style="background-color: greenyellow;height:100vh;";
var onPainting=false;
canvas.onmousedown=function(inf){
    xIndex=inf.clientX;
    yIndex=inf.clientY;
    drawnDot(xIndex,yIndex);
    onPainting=true;
}
canvas.onmousemove=function(inf){
    if(onPainting){
    xIndex=inf.clientX;
    yIndex=inf.clientY;
    drawnDot(xIndex,yIndex);}
}
canvas.onmouseup=function () {
    onPainting=false;
}

function drawnDot(x,y){
    dot=document.createElement("div");
        dot.style="height:10px;width:10px;border-radius:10px;background-color: black;" +
            "position:absolute;top:"+(yIndex-3)+"px;left:"+(xIndex-3)+"px;";
    canvas.appendChild(dot);
}