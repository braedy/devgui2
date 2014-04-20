function createObstacleScene(){
	// set the scene size
	var WIDTH = 240;
    var HEIGHT = 160;
	// set some camera attributes
	var VIEW_ANGLE = 50;
	var ASPECT = WIDTH / HEIGHT;
	var NEAR = 0.1;
	var FAR = 1000;

	// create WebGL renderer, camera and scene
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	// add camera to scene
	scene.add(camera);


	// camera default position
	camera.position.z = 20;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0xFFFFFF);

	// attach the render-supplied DOM element
	var c = document.getElementById("obstacleCanvas");
	c.appendChild(renderer.domElement);

	var paddleWidth = 10;
	var paddleHeight = 30;
	var paddleDepth = 10;
	var paddleQuality = 1;
	var paddle_aMaterial = new THREE.MeshLambertMaterial({color:0x007AFF});

	// paddle a
	var paddle_a = new THREE.Mesh(
		new THREE.CubeGeometry(
			paddleWidth,
			paddleHeight,
			paddleDepth,
			paddleQuality,
			paddleQuality,
			paddleQuality),
		paddle_aMaterial);
	// add to the scene
	scene.add(paddle_a);
	paddle_a.receiveShadow = true;
	paddle_a.castShadow = true;

	// add point light
	var pointLight = new THREE.PointLight(0xFFFFFF);
	// set position
	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);

	draw();
}
