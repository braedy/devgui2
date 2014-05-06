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
    obstacleCanvasRenderer = new THREE.WebGLRenderer();
    obstacleCanvasCamera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                    ASPECT,
                                    NEAR,
                                    FAR);

    obstacleCanvasCamera.position.z = 100;

    obstacleCanvasScene = new THREE.Scene();

    // start the renderer
    obstacleCanvasRenderer.setSize(WIDTH, HEIGHT);
    obstacleCanvasRenderer.setClearColor(0xFFFFFF);


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
    ev.preventDefault();
    var params = ev.dataTransfer.getData("params");

    params = JSON.parse(params);

    addCube(params.length, params.width, params.rotation);
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