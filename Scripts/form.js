var obstacleCanvasRenderer;
var obstacleCanvasCamera;
var obstacleCanvasScene;
var previewCube;

function createObstacleCanvas(){
    // set the scene size
    var WIDTH = 300,
        HEIGHT = 150;

    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var container = $('#obstacleCanvas');

    // create a WebGL renderer, camera and a scene
    obstacleCanvasRenderer = new THREE.WebGLRenderer( { alpha: true } );
    obstacleCanvasCamera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                    ASPECT,
                                    NEAR,
                                    FAR);

    obstacleCanvasCamera.position.z = 100;

    obstacleCanvasScene = new THREE.Scene();

    // start the renderer
    obstacleCanvasRenderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    container.append(obstacleCanvasRenderer.domElement);

    // create the sphere's material
    var cubeMaterial    = new THREE.MeshLambertMaterial({color: 0xCC0000});

    // Create an almost unit box ((1,1,10) dimensions) since Three.JS only allows to scale the cube after creation
    // I couldn't find a solution to set the width/height values explicitly and rendering it again.
    previewCube = new THREE.Mesh( new THREE.CubeGeometry(1, 1, 10, 1, 1, 1),cubeMaterial);
    previewCube.scale.x = parseInt(document.getElementById("widthSliderOutput").innerHTML, 10);
    previewCube.scale.y = parseInt(document.getElementById("lengthSliderOutput").innerHTML, 10);
    previewCube.receiveShadow = true;
    previewCube.castShadow = true;
    previewCube.rotation.x = - 1;


    // add the sphere to the obstacleCanvasScene
    obstacleCanvasScene.add(previewCube);

    // and the obstacleCanvasCamera
    obstacleCanvasScene.add(obstacleCanvasCamera);

    // create a point light
    var pointLight = new THREE.PointLight( 0xFFFFFF );

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the obstacleCanvasScene
    obstacleCanvasScene.add(pointLight);

    // draw!
    obstacleCanvasRenderer.render(obstacleCanvasScene, obstacleCanvasCamera);
}

function drag(ev) {
    var length = parseInt(document.getElementById("lengthSliderOutput").innerHTML, 10);
    var width = parseInt(document.getElementById("widthSliderOutput").innerHTML, 10);
    var rotation = parseInt(document.getElementById("rotationSliderOutput").innerHTML, 10) * Math.PI / 180;

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
    // to capture drop
    ev.preventDefault();

    // get parameters from the draged canvas
    var params = ev.dataTransfer.getData("params");
    params = JSON.parse(params);
    // add a new box to the scene
    addCube(params.length, params.width, params.rotation);

    // Set up an alert box to inform the player
    var alertBox = document.getElementById("alert");
    alertBox.innerHTML = "Added a new box to the scene! Do you want to <a id='undo' href='#'>undo this action</a>?";
    alertBox.style.display = 'block';

    // Add the undo functionality to the link inside the alert
    $('#undo').click(function(){
        undo();
        return false;
    });
}

function undo() {
    undo_cube();

    // Set up an alert box to inform the player
    var alertBox = document.getElementById("alert");
    alertBox.innerHTML = "Removed the last box from the scene. If that was a mistake, you can <a id='redo' href='#'>redo it here</a>."

    $('#redo').click(function(){
        redo();
        return false;
    });
}

function redo() {
    redo_cube();

    // Set up an alert box to inform the player
    var alertBox = document.getElementById("alert");
    alertBox.innerHTML = "You re-added the cube. Is this fun? You can always <a id='undo' href='#'>undo this action</a>.";

    $('#undo').click(function(){
        undo();
        return false;
    });
}

$(document).foundation({
  slider: {
    on_change: function(){

      // scale the cube to meet the new sizes
      previewCube.scale.x = parseInt(document.getElementById("widthSliderOutput").innerHTML, 10);
      previewCube.scale.y = parseInt(document.getElementById("lengthSliderOutput").innerHTML, 10);

      // rotate the cube
      var radians = parseInt(document.getElementById("rotationSliderOutput").innerHTML, 10) * Math.PI / 180;
      previewCube.rotation.z = radians;

      // render the new preview!
      obstacleCanvasRenderer.render(obstacleCanvasScene, obstacleCanvasCamera);
    }
  }
});

function dropExternal(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
  return false;
}

function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /image.*/;

    if (!file.type.match(imageType)) {
      continue;
    }

    var gameCanvas = document.getElementById("gameCanvas").childNodes[0];

    var img = document.createElement("img");
    img.src = window.URL.createObjectURL(files[i]);
    img.height = 60;
    img.onload = function(e) {
    window.URL.revokeObjectURL(this.src);
    }

    gameCanvas.style.backgroundImage="url("+img.src+")";
  }
}
