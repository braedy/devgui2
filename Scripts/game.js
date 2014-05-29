// Scene
var initScene, render, renderer, scene, camera, pointLight, spotLight, lastCube;

// field
var fieldWidth = 400, fieldHeight = 200;
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
var difficulty = 0.10

//slow down effect on the ball
var linear_amount = 0.9;
var angular_amount = 0;

initScene = function() {

    renderer = new THREE.WebGLRenderer({ alpha:true, antialias: true });
    renderer.setSize( 600, 400 );
    document.getElementById( 'gameCanvas' ).appendChild( renderer.domElement );

    scene = new Physijs.Scene;

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set( 0, 250, 410 );
    //camera.position.set(200,500,0);
    //camera.position.set(360, 0, 0);
    camera.lookAt( scene.position );
    scene.add( camera );

	/*====== MATERIALS ======*/
	// set playing surface
	var planeWidth = fieldWidth,
	    planeHeight = fieldHeight,
	    planeQuality = 10;

var paddle_friction = 0;
var paddle_restitution = 0.9;
var plane_fric = 0;
var plane_rest = 0;
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
    new THREE.MeshBasicMaterial({color: 0xFF5E3A}), paddle_friction,  paddle_restitution);

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
    if(other_object._physijs.id == 4) {
      var ball_x_vel = other_object.getLinearVelocity().x;
      var ball_z_vel = other_object.getLinearVelocity().z;
      other_object.applyCentralForce(new THREE.Vector3(-ball_x_vel*4e4, 0, 0));
    }
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
    if(other_object._physijs.id == 4) {
      var ball_x_vel = other_object.getLinearVelocity().x;
      var ball_z_vel = other_object.getLinearVelocity().z;
      other_object.applyCentralForce(new THREE.Vector3(-ball_x_vel*4e4, 0, 0));
    }
    });

    scene.add(bound_left);

/*====== BALL ======*/
	var radius = 5, segments = 6, rings = 6;

  var ball_restitution = 1.0;
  var ball_friction = 0;
	// create the sphere textures
	var sphereMaterial = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({color: 0xD43001}), 0, ball_restitution);
/*
	// create ball with sphere geometry
	ball = new Physijs.SphereMesh(
		new THREE.SphereGeometry(
			radius, segments, rings), sphereMaterial);
*/
  ball = new Physijs.BoxMesh(
    new THREE.CubeGeometry(
      10,
      10,
      10,
      paddleQuality,
      paddleQuality,
      paddleQuality),
    sphereMaterial);

  // place ball in centre
	ball.position.x = 0;
	ball.position.y = radius;

	// place ball on surface
	//ball.position.z = radius;
	ball.receiveShadow = true;
	ball.castShadow = true;
  // add to scene
  scene.add(ball);

  ball.setAngularFactor(new THREE.Vector3( 0, 0, 0 )); // don't rotate
  ball.setLinearFactor(new THREE.Vector3( 1, 0, 1 )); // only move on X and Z axis
  ball.setCcdMotionThreshold(10);
  //ball.setCcdMotionThreshold(5);
    	/*====== PADDLES =======*/
  	paddleWidth = 50;
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
  		paddle_bMaterial);

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
    var paddle_x_vel = paddle_a.getLinearVelocity().x;
    var ball_x_vel = other_object.getLinearVelocity().x;
    if(Math.abs(paddle_x_vel) > Math.abs(ball_x_vel)){
      other_object.applyCentralForce(new THREE.Vector3(paddle_a.getLinearVelocity().x *1e5, 0, 0));
    }else if(Math.abs(paddle_x_vel) < Math.abs(ball_x_vel)) {
      other_object.applyCentralForce(new THREE.Vector3(ball.getLinearVelocity().x *1e5, 0, 0));
    }
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
  		paddle_aMaterial);

    // set paddle location
    paddle_b.position.x = 0;
    paddle_b.position.y = paddleHeight/2;
    paddle_b.position.z = -fieldHeight+paddleHeight+5;

  	// add to the scene
  	scene.add(paddle_b);
  	paddle_b.receiveShadow = true;
  	paddle_b.castShadow = true;

    //Lock movement
    paddle_b.setAngularFactor(new THREE.Vector3( 0, 0, 0 )); // don't rotate
    paddle_b.setLinearFactor(new THREE.Vector3( 1, 0, 0 )); // only move on X and Y axis

    paddle_b.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    if(other_object._physijs.id == 4) {
      var paddle_x_vel = paddle_b.getLinearVelocity().x;
      var ball_x_vel = other_object.getLinearVelocity().x;
      other_object.applyCentralForce(new THREE.Vector3(ball.getLinearVelocity().x *1e5, 0, 0));
    }
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

    ball.applyCentralForce(new THREE.Vector3(0, 0, -1e7));
    requestAnimationFrame( render );
};

/*====== MOVE PADDLE =======*/
function playerMovement(){
	// move right
  if(Key.isDown(Key.D)){
			//paddle_aDirX = paddleSpeed * 0.5;
      paddle_a.applyCentralImpulse(new THREE.Vector3(4e4, 0, 0));
	}
	// move left
	else if(Key.isDown(Key.A)){
			//paddle_aDirX = -paddleSpeed * 0.5;
      paddle_a.applyCentralImpulse(new THREE.Vector3(-4e4, 0, 0));
}else{
paddle_a.setDamping( linear_amount, angular_amount );
}
}

/*====== OPPONENT AI ======*/
function opponentAI(){
	// linear interpolation
  paddle_b.__dirtyPosition = true;

	paddle_bDirY = (ball.position.x - paddle_b.position.x) * difficulty;
  // limit max paddle speed
	if(Math.abs(paddle_bDirY) <= paddleSpeed){
    paddle_b.position.x += paddle_bDirY;
	}
	else{
		if(paddle_bDirY > paddleSpeed){
			paddle_b.position.x += paddleSpeed;
		}
		else if(paddle_bDirY < -paddleSpeed){
			paddle_b.position.x -= paddleSpeed;
		}
	}
}

/*====== RESET BALL ======*/
function newRound(loser){

  // Change the object's position
  ball.mass = 0;
  ball.position.set(0,5,0);
  ball.__dirtyPosition = true;
  ball.mass = 1000;
  // if player won last point, sent ball to player
	if(loser != 1){
    ball.setLinearVelocity(new THREE.Vector3(0,0,-170));
  }
	// if player lost the last point, send ball to opponent
	else{
    ball.setLinearVelocity(new THREE.Vector3(0,0,170));
	}
	// test Y axis
	ballDirY = 0;
}

/*====== CHECK SCORE ======*/
function checkScore(){
	// check against max score
	if(player_a >= maxScore){
		// stop ball
		//ballSpeed = 0;
		// update display
		document.getElementById("scores").innerHTML = "CPU wins!";
		document.getElementById("info").innerHTML = "Refresh to play again or stay and practice.";
	}
	else if(player_b >= maxScore){
		// stop ball
		//ballSpeed = 0;
		// update display
		document.getElementById("scores").innerHTML = "Player wins!";
		document.getElementById("info").innerHTML = "Refresh to play again or stay and practice.";
	}
}

/*====== BALL MOVEMENT ======*/
function ballMovement(){
	// player scores
  if (ball.position.z >= fieldWidth/2){
		player_a++;
  	// update scoreboard
		document.getElementById("scores").innerHTML = "Player "+player_b + "-" + player_a+ " CPU";
		// reset ball
		newRound(1);
		checkScore();
    return 1;
	}

	// cpu scores
	if (ball.position.z <= -fieldWidth/2){
		player_b++;
  	// update scoreboard
		document.getElementById("scores").innerHTML = "Player " + player_b + "-" + player_a + " CPU";
		// reset ball
		newRound(2);
		checkScore();
    return 1;
	}
}

/*============= DRAG AND DROP ===========*/
function addCube(len, wid, rot){//cubeWidth, cubeHeight, cubeRotation) {
    // adds a cube (in a random position) to the playing field
    var plane_fric = 0;
    var plane_rest = 1;
       // Materials
       /*NOTE : the parameter after the color sets the material friction
               and the other parameter sets the restitution.*/
       // create surface material
        var cubeMaterial = Physijs.createMaterial(
         new THREE.MeshLambertMaterial({color: 0xCC0000, transparent: true, opacity: 0.5}),plane_fric,plane_rest);
    var cubeDepth = 40;
    var i = 1;
    // create the cube
    cube = new Physijs.BoxMesh(
    new THREE.CubeGeometry(
        wid,//cubeWidth,
        len,//cubeHeight,
        cubeDepth),
    cubeMaterial, 0//mass
  );
    // rotate it
    cube.rotation.y = rot;

cube.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
if(other_object._physijs.id == 4) {
  var ball_x_vel = other_object.getLinearVelocity().x;
  var ball_z_vel = other_object.getLinearVelocity().z;
  other_object.applyCentralForce(new THREE.Vector3(-ball_x_vel*4e4, 0, 0));
}
});

    cube.receiveShadow = true;
    cube.castShadow = true;

    // place the cube somewhere random
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    cube.position.x = plusOrMinus * Math.random() * (fieldHeight - wid)/2;
    plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    cube.position.z = plusOrMinus * Math.random() * (fieldWidth - len)/2;
    cube.position.y = 0;
    lastCube = cube;


scene.add(cube);
}

function undo_cube(cube) {
  if(lastCube)
    scene.remove(lastCube);
}

function redo_cube(){
  scene.add(lastCube);
}

//var start = false

render = function() {
//  if(start) {
    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    playerMovement();
    ballMovement();
    opponentAI();
    requestAnimationFrame( render );
//  }else {
//      renderer.render( scene, camera); // render the scene

//  }
};

//window.onload = initScene;
