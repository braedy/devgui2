// Scene
var initScene, render, renderer, scene, camera, pointLight, spotLight;

// field
var fieldWidth = 400, fieldHeight = 200;
var boundwidth = fieldWidth, boundHeight = 200;
// paddle
var paddle_a, paddle_b;
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle_aDirX = 0, paddle_bDirY = 0, paddleSpeed = 3;

// ball
var ball;
var ballDirX = 1, ballDirY = 0, ballSpeed = 2.55;

// score
var player_a = 0, player_b = 0;
var maxScore = 7;

// speed of AI
var difficulty = 0.18

initScene = function() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById( 'viewport' ).appendChild( renderer.domElement );

    scene = new Physijs.Scene;

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set( 0, 360, 450 );
    //camera.position.set(360, 0, 0);
    camera.lookAt( scene.position );
    scene.add( camera );

	/*====== MATERIALS ======*/
	// set playing surface
	var planeWidth = fieldWidth,
	    planeHeight = fieldHeight,
	    planeQuality = 10;

var paddle_friction = 0.2; // high friction
var paddle_restitution = 1.0; // low restitution
var plane_fric = .9;
var plane_rest = .3;
    // Materials
    /*NOTE : the parameter after the color sets the material friction
            and the other parameter sets the restitution.*/
    // create surface material
  	var planeMaterial = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({color:0x1F1F21}),plane_fric,plane_rest);
		// create paddle materials
    var paddle_aMaterial = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({color:0x007AFF}), paddle_friction, paddle_restitution);

    var paddle_bMaterial = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({ color: 0xFF5E3A }),paddle_friction ,paddle_restitution );

// plane
		plane = new Physijs.BoxMesh(
			new THREE.CubeGeometry(planeHeight, 1, planeWidth * 0.95),
			planeMaterial,
			0 // mass
		);
		plane.position.y = -.5;
		plane.receiveShadow = true;
		scene.add( plane );

/*====== ADD BOUNDARIES =======*/
    bound_right = new Physijs.BoxMesh(
      new THREE.CubeGeometry(5,10,planeWidth*0.95),
      planeMaterial,
      0);
    //bound_right.position.x = planeWith
    bound_right.position.y = 5;
    bound_right.position.x = planeHeight/2;

    //Add collision detection
    bound_right.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    console.log("RIGHT BOUND HIT");
    });

    scene.add(bound_right);

    bound_left = new Physijs.BoxMesh(
      new THREE.CubeGeometry(5,10,planeWidth*0.95),
      planeMaterial,
      0);
    //bound_right.position.x = planeWith
    bound_left.position.y = 5;
    bound_left.position.x = -planeHeight/2;

    //Add collision detection
    bound_left.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    console.log("LEFT BOUND HIT");
    });

    scene.add(bound_left);

/*====== BALL ======*/
	var radius = 5, segments = 6, rings = 6;

	// create the sphere textures
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xD43001});

	// create ball with sphere geometry
	ball = new Physijs.SphereMesh(
		new THREE.SphereGeometry(
			radius, segments, rings), sphereMaterial);

	// place ball in centre
	ball.position.x = 0;
	ball.position.y = radius;

	// place ball on surface
	//ball.position.z = radius;
	ball.receiveShadow = true;
	ball.castShadow = true;
  // add to scene
  scene.add(ball);

  ball.setLinearFactor(new THREE.Vector3( 1, 0, 1 )); // only move on X and Y axis

    	/*====== PADDLES =======*/
  	paddleWidth = 30;
  	paddleHeight = 10;
  	paddleDepth = 10;
  	paddleQuality = 1;

	// paddle a
  	paddle_a = new Physijs.BoxMesh(
  		new THREE.CubeGeometry(
  			paddleWidth,
  			paddleHeight,
  			paddleDepth,
  			paddleQuality,
  			paddleQuality,
  			paddleQuality),
  		paddle_aMaterial);

    // set paddle_a location
	  paddle_a.position.x = 0;
    paddle_a.position.y = paddleHeight/2;
    paddle_a.position.z = fieldHeight-paddleDepth-5;

    // add to the scene
    scene.add(paddle_a);
  	paddle_a.receiveShadow = true;
  	paddle_a.castShadow = true;

    //Lock paddle movement
    paddle_a.setAngularFactor(new THREE.Vector3( 0, 0, 0 )); // don't rotate
    paddle_a.setLinearFactor(new THREE.Vector3( 1, 0, 0 )); // only move on X and Y axis

    paddle_a.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    if(other_object._physijs.id == 4)
      console.log("BALL HIT");
      console.log("cpu ball hit"+relative_velocity._physijs.id);
      other_object.applyCentralForce(new THREE.Vector3(0, 0, 1e7));
    });
    // paddle b
  	paddle_b = new Physijs.BoxMesh(
  		new THREE.CubeGeometry(
  			paddleWidth,
  			paddleHeight,
  			paddleDepth,
  			paddleQuality,
  			paddleQuality,
  			paddleQuality),
  		paddle_bMaterial);

    // set paddle location
    paddle_b.position.x = 0;
    paddle_b.position.y = paddleHeight/2;
    paddle_b.position.z = -fieldHeight+paddleHeight;

  	// add to the scene
  	scene.add(paddle_b);
  	paddle_b.receiveShadow = true;
  	paddle_b.castShadow = true;

    //Lock movement
    paddle_b.setAngularFactor(new THREE.Vector3( 0, 0, 0 )); // don't rotate
    paddle_b.setLinearFactor(new THREE.Vector3( 1, 0, 0 )); // only move on X and Y axis

    paddle_b.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    if(other_object._physijs.id == 4)
      console.log("cpu ball hit"+relative_velocity);
      other_object.applyCentralForce(new THREE.Vector3(0, 0, 1e7));
    });

    // ambient light
		am_light = new THREE.AmbientLight( 0x444444 );
		scene.add( am_light );

		// directional light
		dir_light = new THREE.DirectionalLight( 0xFFFFFF );
		dir_light.position.set( 20, 30, -5 );
		dir_light.target.position.copy( scene.position );
		dir_light.castShadow = true;
		dir_light.shadowCameraLeft = -30;
		dir_light.shadowCameraTop = -30;
		dir_light.shadowCameraRight = 30;
		dir_light.shadowCameraBottom = 30;
		dir_light.shadowCameraNear = 20;
		dir_light.shadowCameraFar = 200;
		dir_light.shadowBias = -.001
		dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
		dir_light.shadowDarkness = .5;
		scene.add( dir_light );

    ball.applyCentralForce(new THREE.Vector3(0, 0, 1e7));

    requestAnimationFrame( render );
};

/*====== MOVE PADDLE =======*/
function playerMovement(){
	// move right
  if(Key.isDown(Key.D)){
			//paddle_aDirX = paddleSpeed * 0.5;
      paddle_a.applyCentralForce(new THREE.Vector3(1e6, 0, 0));
	}
	// move left
	else if(Key.isDown(Key.A)){
			//paddle_aDirX = -paddleSpeed * 0.5;
      paddle_a.applyCentralForce(new THREE.Vector3(-1e6, 0, 0));
	}
}

/*====== RESET BALL ======*/
function newRound(loser){
	// position ball in the centre
	ball.position.x = 0;
	ball.position.y = 0;

  // Change the object's position
    ball.position.set( 0, 0, 0 );
    ball.__dirtyPosition = true;

	// if player won last point, sent ball to player
	if(loser != 1){
    ball.applyCentralForce(new THREE.Vector3(-1e5, 0, 0));
	}
	// if player lost the last point, send ball to opponent
	else{
    paddle_a.applyCentralForce(new THREE.Vector3(1e5, 0, 0));
	}
	// test Y axis
	ballDirY = 0;
}

/*====== BALL MOVEMENT ======*/
function ballMovement(){
	// player scores
  if (ball.position.x >= fieldWidth/2){
		player_a++;
    console.log("player scores!");
		// update scoreboard
		//document.getElementById("scores").innerHTML = player_a + "-" + player_b;
		// reset ball
		newRound(1);
		//checkScore();
	}

	// cpu scores
	if (ball.position.x <= -fieldWidth/2){
		player_b++;
    console.log("CPU scores!");
		// update scoreboard
		//document.getElementById("scores").innerHTML = player_a + "-" + player_b;
		// reset ball
		newRound(2);
		//checkScore();
	}
}


render = function() {
    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    //ballMovement();
    playerMovement();
    requestAnimationFrame( render );
};

window.onload = initScene;
