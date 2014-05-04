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

function createObstacleScene(){
    // preview code here
    var length = parseInt(document.getElementById("lengthSliderOutput").innerHTML, 10);
    var width = parseInt(document.getElementById("widthSliderOutput").innerHTML, 10);
    var rotation = parseInt(document.getElementById("rotationSliderOutput").innerHTML, 10);

      // set the scene size
      var oWIDTH = 320, oHEIGHT = 140;
      // set some camera attributes
      var oVIEW_ANGLE = 50,
        oASPECT = oWIDTH / oHEIGHT,
        oNEAR = 0.1,
        oFAR = 300;

      // create WebGL renderer, camera and scene
      oscene = new THREE.Scene();
      orenderer = new THREE.WebGLRenderer();
      ocamera = new THREE.PerspectiveCamera(
        oVIEW_ANGLE,
        oASPECT,
        oNEAR,
        oFAR);

      // add camera to scene
      scene.add(ocamera);


      // camera default position
      ocamera.position.z = 320;

      // start the renderer
      orenderer.setSize(oWIDTH, oHEIGHT);
      orenderer.setClearColor(0xFFFFFF);

      // attach the render-supplied DOM element (obstacle canvas)
      var p = document.getElementById("obstacleCanvas");
      p.appendChild(orenderer.domElement);

      // create cube
      var geometry = new THREE.BoxGeometry(length,25,width);
      var material = new THREE.MeshBasicMaterial({color: 0xD43001});
      var cube = new THREE.Mesh(geometry, material);
      cube.receiveShadow = true;
      cube.castShadow = true;
      cube.rotation.x = 1;
      oscene.add(cube);

      ocamera.position.z = 100;

      odraw();
}

function odraw(){
  // draw scene
  orenderer.render(oscene, ocamera);

  // loop draw()
  requestAnimationFrame(odraw);

  // TODO: write updates for cube dimensions

}
