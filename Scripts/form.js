function createObstacleScene(){
    // preview code here
}

function drag(ev) {
    var length = parseInt(document.getElementById("lengthSliderOutput").innerHTML, 10);
    var width = parseInt(document.getElementById("widthSliderOutput").innerHTML, 10);
    var rotation = parseInt(document.getElementById("rotationSliderOutput").innerHTML, 10);

    var params = {
                    length:     length,
                    width:      width,
                    rotation:   rotation};

    ev.dataTransfer.setData("params", JSON.stringify(params));
}

function allowDrop(ev){
    ev.preventDefault();
}

function drop(ev){
    ev.preventDefault();
    var params = ev.dataTransfer.getData("params");
    console.log(params);

    params = JSON.parse(params);

    addCube(params.length, params.width, params.rotation);
}
