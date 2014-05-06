// ==================================== //
// ==================================== //
// PONGPONGPONGPONGPONGPONGPONGPONGPONG //
// ==================================== //
// ==================================== //

// globals

// scene
var scene, renderer, camera, pointLight, spotLight;

// field
var fieldWidth = 400, fieldHeight = 200;

// paddle
var paddle_a, paddle_b;
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle_aDirY = 0, paddle_bDirY = 0, paddleSpeed = 3;

// ball
var ball;
var ballDirX = 1, ballDirY = 0, ballSpeed = 2.55;

// score
var player_a = 0, player_b = 0;
var maxScore = 7;

// speed of AI
var difficulty = 0.18

function setup(){
	// set max score HTML
	document.getElementById("winCondition").innerHTML = "First to " + maxScore + " wins!";

	// reset scores
	player_a = 0;
	player_b = 0;

	// set up all objects in scene	
	createScene();

	// draw everything
	draw();
}

/*====== SCENE CREATION ======*/
function createScene(){
	// set the scene size
	var WIDTH = 640, HEIGHT = 360;
	// set some camera attributes
	var VIEW_ANGLE = 50,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 1000;

	// create WebGL renderer, camera and scene
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	// add camera to scene
	scene.add(camera);


	// camera default position
	camera.position.z = 320;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0xFFFFFF);

	// attach the render-supplied DOM element (game canvas)
	var c = document.getElementById("gameCanvas");
	c.appendChild(renderer.domElement);

	/*====== MATERIALS ======*/
	// set playing surface
	var planeWidth = fieldWidth,
	planeHeight = fieldHeight,
	planeQuality = 10;

	// create surface material
	var planeMaterial = new THREE.MeshLambertMaterial({color:0x1F1F21});

	// create paddle materials
	var paddle_aMaterial = new THREE.MeshLambertMaterial({color:0x007AFF});
	var paddle_bMaterial = new THREE.MeshLambertMaterial({color:0xFF5E3A});

	/*====== SURFACE PLANE =======*/
	// create playing surface plane
	var plane = new THREE.Mesh(
		new THREE.PlaneGeometry(
			planeWidth * 0.95, // 95% with to show ball entering goal
			planeHeight,
			planeQuality,
			planeQuality),
		planeMaterial);
	// add to the scene
	scene.add(plane);
	// add shadow
	plane.receiveShadow = true;

	/*====== BALL ======*/
	var radius = 5, segments = 6, rings = 6;

	// create the sphere textures
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xD43001});

	// create ball with sphere geometry
	ball = new THREE.Mesh(
		new THREE.SphereGeometry(
			radius, segments, rings), sphereMaterial);
	// add to scene
	scene.add(ball);

	// place ball in centre
	ball.position.x = 0;
	ball.position.y = 0;

	// place ball on surface
	ball.position.z = radius;
	ball.receiveShadow = true;
	ball.castShadow = true;


	/*====== PADDLES =======*/
	paddleWidth = 10;
	paddleHeight = 30;
	paddleDepth = 10;
	paddleQuality = 1;

	// paddle a
	paddle_a = new THREE.Mesh(
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

	// paddle b
	paddle_b = new THREE.Mesh(
		new THREE.CubeGeometry(
			paddleWidth,
			paddleHeight,
			paddleDepth,
			paddleQuality,
			paddleQuality,
			paddleQuality),
		paddle_bMaterial);
	// add to the scene
	scene.add(paddle_b);
	paddle_b.receiveShadow = true;
	paddle_b.castShadow = true;

	// set paddle location
	paddle_a.position.x = -fieldWidth/2 + paddleWidth;
	paddle_b.position.x = fieldWidth/2 - paddleWidth;

	// place on playing surface
	paddle_a.position.z = paddleDepth;
	paddle_b.position.z = paddleDepth;

	/*====== LIGHTING ======*/
	// add point light
	pointLight = new THREE.PointLight(0xF8D898);
	// set position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);

	// add spot light for shadow casts
	spotLight = new THREE.SpotLight(0xF8D898);
	spotLight.position.set(0,0,460);
	spotLight.intensity = 1.5;
	spotLight.castShadow = true;
	scene.add(spotLight);

}

/*====== BALL MOVEMENT ======*/
function ballMovement(){
	// player scores
	if (ball.position.x >= fieldWidth/2){
		player_a++;
		// update scoreboard
		document.getElementById("scores").innerHTML = player_a + "-" + player_b;
		// reset ball
		newRound(1);
		checkScore();
	}

	// cpu scores
	if (ball.position.x <= -fieldWidth/2){
		player_b++;
		// update scoreboard
		document.getElementById("scores").innerHTML = player_a + "-" + player_b;
		// reset ball
		newRound(2);
		checkScore();
	}

	// bounce from wall
	if (ball.position.y <= -fieldHeight/2){
		ballDirY = -ballDirY;
	}
	if (ball.position.y >= fieldHeight/2){
		ballDirY = -ballDirY;
	}

	// update ball position over time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;

	// limit y speed to double x speed
	if (ballDirY > ballSpeed*2){
		ballDirY = ballSpeed*2;
	}
	else if (ballDirY < -ballSpeed*2){
		ballDirY = -ballSpeed*2;
	}
}

/*====== MOVE PADDLE =======*/
function playerMovement(){
	// move right
	if(Key.isDown(Key.D)){
		// if paddle is not at edge
		if(paddle_a.position.y > -fieldHeight * 0.45){
			paddle_aDirY = -paddleSpeed * 0.5;
		}
		// else don't move
		else{
			paddle_aDirY = 0;
		}
	}
	// move left
	else if(Key.isDown(Key.A)){
		// if paddle is not at edge
		if(paddle_a.position.y < fieldHeight * 0.45){
			paddle_aDirY = paddleSpeed * 0.5;
		}
		// else don't move
		else{
			paddle_aDirY = 0;
		}
	}
	// don't move
	else{
		paddle_aDirY = 0;
	}

	paddle_a.scale.y += (1 - paddle_a.scale.y) * 0.2;
	paddle_a.scale.z += (1 - paddle_a.scale.y) * 0.2;
	paddle_a.position.y += paddle_aDirY;
}

/*====== OPPONENT AI ======*/
function opponentAI(){
	// linear interpolation
	paddle_bDirY = (ball.position.y - paddle_b.position.y) * difficulty;
	// limit max paddle speed
	if(Math.abs(paddle_bDirY) <= paddleSpeed){
		paddle_b.position.y += paddle_bDirY;
	}
	else{
		if(paddle_bDirY > paddleSpeed){
			paddle_b.position.y += paddleSpeed;
		}
		else if(paddle_bDirY < -paddleSpeed){
			paddle_b.position.y -= paddleSpeed;
		}
	}
}

/*====== CAMERA ========*/
function setCamera(){
	// dynamically move light over ball
	spotLight.position.x = ball.position.x * 2;
	spotLight.position.y = ball.position.y * 2;

	// camera behind player's paddle
	camera.position.x = -fieldWidth/2 + paddleWidth - 100;
	camera.position.z = paddle_a.position.z + 100 + 0.04;

	// point at opponent 
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

/*====== COLLISION ======*/
function collision(){
	// player logic
	// if ball is aligned with paddle_a on x plane
	// remember the position is object center
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle_a.position.x + paddleWidth
		&& ball.position.x >= paddle_a.position.x) {
		// and if ball is aligned with paddle_a on y plane
		if (ball.position.y <= paddle_a.position.y + paddleHeight/2
			&& ball.position.y >= paddle_a.position.y - paddleHeight/2){
			// if ball travelling toward player
			if(ballDirX < 0){
				// stretch the paddle to indicate a hit
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, but adds slice
				ballDirY -= paddle_aDirY * 0.7;
			}
		}
	}

	// opponent logic
	// if ball is aligned with paddle_b on x plane
	// remember the position is object center
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle_b.position.x + paddleWidth
		&& ball.position.x >= paddle_b.position.x) {
		// and if ball is aligned with paddle_b on y plane
		if (ball.position.y <= paddle_b.position.y + paddleHeight/2
			&& ball.position.y >= paddle_b.position.y - paddleHeight/2){
			// if ball travelling toward opponent
			if(ballDirX > 0){
				// stretch the paddle to indicate a hit
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, but adds slice
				ballDirY -= paddle_bDirY * 0.7;
			}
		}
	}
}


/*====== RESET BALL ======*/
function newRound(loser){
	// position ball in the centre
	ball.position.x = 0;
	ball.position.y = 0;

	// if player won last point, sent ball to player
	if(loser != 1){
		ballDirX = 1;
	}
	// if player lost the last point, send ball to opponent
	else{
		ballDirX = -1;
	}
	// test Y axis
	ballDirY = 0; 
}

/*====== CHECK SCORE ======*/
function checkScore(){
	// check against max score
	if(player_a >= maxScore){
		// stop ball
		ballSpeed = 0;
		// update display
		document.getElementById("scores").innerHTML = "Player wins!";		
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
	}
	else if(player_b >= maxScore){
		// stop ball
		ballSpeed = 0;
		// update display
		document.getElementById("scores").innerHTML = "CPU wins!";		
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
	}
}

/*====== DRAW =======*/
function draw(){
	// draw scene
	renderer.render(scene, camera);

	// loop draw()
	requestAnimationFrame(draw);
	ballMovement();
	collision();
	setCamera();
	playerMovement();
	opponentAI();

	//process game logic
}


/*====== ADD CUBE ======*/
function addCube(cubeWidth, cubeHeight, cubeRotation) {
    // adds a cube (in a random position) to the playing field

    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000, transparent: true, opacity: 0.5});
    var cubeDepth = 10;

    // create the cube
    cube = new THREE.Mesh(
    new THREE.CubeGeometry(
        cubeWidth,
        cubeHeight,
        cubeDepth,
        1,
        1,
        1),
    cubeMaterial);

    // rotate it
    cube.rotation.z = cubeRotation;

    // add to the scene
    scene.add(cube);

    cube.receiveShadow = true;
    cube.castShadow = true;

    // place the cube somewhere random
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    cube.position.x = plusOrMinus * Math.random() * (fieldWidth - cubeWidth)/2;
    plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    cube.position.y = plusOrMinus * Math.random() * (fieldHeight - cubeHeight)/2;
    cube.position.z = cubeDepth;

}
