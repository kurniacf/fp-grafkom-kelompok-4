// Game colors
let colorList = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  brownDark: 0x23190f,
  pink: 0xf5986e,
  yellow: 0xf4ce93,
  blue: 0x68c3c0,
};

// Game variables
let game;
let is3D = false;
let deltaTime = 0;
let newTime = new Date().getTime();
let oldTime = new Date().getTime();
let obstaclesPool = [];
let landObstaclesPool = [];
let particlesPool = [];
let particlesInUse = [];

// Lights

let ambientLight, hemisphereLight, shadowLight;

// Objects
let water;
let airplane;

//flag heart
let heart_init = 0;
// ThreeJs variables
let scene;
let camera;
let fieldOfView;
let aspectRatio;
let nearPlane;
let farPlane;
let renderer;
let container;
let controls;

//SCREEN & MOUSE VARIABLES
let HEIGHT, WIDTH;
let mousePos = { x: 0, y: 0 };

// SOUND EFFECTS
let pickupSound, hurtSound;
let music,
  musicPlaying = 0;

// Fungsi untuk reset game
function resetGame(){
  game = {
    speed                         :0,
    initSpeed                     :.00035,
    baseSpeed                     :.00035,
    targetBaseSpeed               :.00035,
    incrementSpeedByTime          :0,//.0000025,
    incrementSpeedByLevel         :.000005,
    distanceForSpeedUpdate        :100,
    speedLastUpdate               :0,
    score                         :0,
    distance                      :0,
    ratioSpeedDistance            :50,
    energy                        :100,
    ratioSpeedEnergy              :3,
    // energy:100,
    heart:5,
    heart_point:0,
    level                         :1,
    levelLastUpdate               :0,
    distanceForLevelUpdate        :1000,
    planeDefaultHeight            :100,
    planeAmpHeight                :80,
    planeAmpWidth                 :75,
    planeMoveSensivity            :0.005,
    planeRotXSensivity            :0.0008,
    planeRotZSensivity            :0.0004,
    planeFallSpeed                :.001,
    planeMinSpeed                 :1.2,
    planeMaxSpeed                 :1.6,
    planeSpeed                    :0,
    planeCollisionDisplacementX   :0,
    planeCollisionSpeedX          :0,
    planeCollisionDisplacementY   :0,
    planeCollisionSpeedY          :0,
    waterRadius                   :600,
    waterLength                   :800,
    //seaRotationSpeed:0.006,
    wavesMinAmp                   :5,
    wavesMaxAmp                   :20,
    wavesMinSpeed                 :0.001,
    wavesMaxSpeed                 :0.003,
    cameraFarPos                  :500,
    cameraNearPos                 :150,
    cameraSensivity               :0.002,
    coinDistanceTolerance         :15,
    coinValue                     :10,
    coinsSpeed                    :.5,
    coinLastSpawn                 :0,
    distanceForCoinsSpawn         :100,
    obstacleDistanceTolerance     :10,
    obstacleValue                 :10,
    obstaclesSpeed                :.6,
    obstacleLastSpawn             :0,
    distanceForObstaclesSpawn     :50,
    status                        : "playing",
    landObstacleDistanceTolerance :20,
    landObstacleValue             :10,
    landObstaclesSpeed            :.1,
    landObstacleLastSpawn         :0,
    // distanceForLandObstaclesSpawn :50
  };
  coinsCounter.innerHTML = game.score;
  
  // healthCounter.innerHTML = 'Health = '+ game.energy;
  for(var i=0; i<game.heart; i++){
    if(!heart_init){
      var heart_icon = document.createElement('img');
      heart_icon.src = "./assets/photo/heart_icon.png"
      heart_icon.setAttribute("alt", "heart");
      heart_icon.classList.add('heart')
      heart_icon.classList.add('visible')
      healthCounter.appendChild(heart_icon)
    }
    else{
      healthCounter.childNodes[i].classList.remove('invisible')
      healthCounter.childNodes[i].classList.add('visible')
    }
  }
}
// Fungsi untuk menginisialisasi scene
function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 0.1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

  scene.fog = new THREE.Fog(0x855988, 100, 950);

  // Setting posisi kamera
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = game.planeDefaultHeight;

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);
  window.addEventListener("resize", handleWindowResize, false);
}

// Fungsi untuk menghandle resize window dan gerakan mouse
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH) * 2;
  var ty = 1 - (event.clientY / HEIGHT) * 2;
  mousePos = { x: tx, y: ty };
}

function handleTouchMove(event) {
  event.preventDefault();
  var tx = -1 + (event.touches[0].pageX / WIDTH) * 2;
  var ty = 1 - (event.touches[0].pageY / HEIGHT) * 2;
  mousePos = { x: tx, y: ty };
}

function handleMouseUp(event) {
  if (game.status == "waitingReplay") {
    resetGame();
    // heart_init = 0;
    hideReplay();
    console.log(is3D);
    if (is3D) camera.position.set(-200, 100, 20);
  }
}

function handleTouchEnd(event) {
  if (game.status == "waitingReplay") {
    resetGame();
    // heart_init = 0;
    hideReplay();
  }
}

function handleKeyDown(event) {
  console.log(event.keyCode);
  switch (event.keyCode) {
    // jika menekan 2
    case 50:
      if (game.status != "playing") {
        console.log("2");
        is3D = false;
      }
      break;
    // jika menekan 3
    case 51:
      if (game.status != "playing") {
        console.log("3");
        is3D = true;
      }
      break;
  }
  console.log(is3D);
}

function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 4096;
  shadowLight.shadow.mapSize.height = 4096;
  var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

  //scene.add(ch);
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}

let save;
function loop() {
  newTime = new Date().getTime();
  deltaTime = newTime - oldTime;
  oldTime = newTime;
  if (game.status=="playing"){
    // Play music
    if (!musicPlaying) music.play();
    if (is3D) {
      camera.lookAt(
        new THREE.Vector3(
          airplane.rocketGroup.position.x,
          airplane.rocketGroup.position.y,
          airplane.rocketGroup.position.z
        )
      );
    }
    // Add energy coins every 100m;
    if (
      Math.floor(game.distance) % game.distanceForCoinsSpawn == 0 &&
      Math.floor(game.distance) > game.coinLastSpawn
    ) {
      game.coinLastSpawn = Math.floor(game.distance);
      coinsHolder.spawnCoins();
    }

    if (
      Math.floor(game.distance) % game.distanceForSpeedUpdate == 0 &&
      Math.floor(game.distance) > game.speedLastUpdate
    ) {
      game.speedLastUpdate = Math.floor(game.distance);
      game.targetBaseSpeed += game.incrementSpeedByTime * deltaTime;
    }

    if (
      Math.floor(game.distance) % game.distanceForObstaclesSpawn == 0 &&
      Math.floor(game.distance) > game.obstacleLastSpawn
    ) {
      game.obstacleLastSpawn = Math.floor(game.distance);
      game.landObstacleLastSpawn = Math.floor(game.distance);
      obstaclesHolder.spawnObstacles();
      landObstaclesHolder.spawnObstacles();
    }

    // if (Math.floor(game.distance)%game.distanceForEnemiesSpawn == 0 && Math.floor(game.distance) > game.landObstacleLastSpawn){
    //   game.landObstacleLastSpawn = Math.floor(game.distance);
    //   landObstaclesHolder.spawnObstacles();
    // }

    // if (Math.floor(game.distance)%game.distanceForLandObstaclesSpawn == 0 && Math.floor(game.distance) > game.landObstacleLastSpawn){
    //   game.landObstacleLastSpawn = Math.floor(game.distance);
    //   landObstaclesHolder.spawnLandObstacles();
    // }

    if (
      Math.floor(game.distance) % game.distanceForLevelUpdate == 0 &&
      Math.floor(game.distance) > game.levelLastUpdate
    ) {
      game.levelLastUpdate = Math.floor(game.distance);
      game.level++;
      game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel * game.level;
    }

    updatePlane();
    updateDistance();
    updateEnergy();
    game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
    game.speed = game.baseSpeed * game.planeSpeed;
  } else if (game.status == "gameover") {
    game.speed *= 0.99;
    // airplane.mesh.rotation.z += (-Math.PI/2 - airplane.mesh.rotation.z)*.0002*deltaTime;
    // airplane.mesh.rotation.x += 0.0003*deltaTime;
    game.planeFallSpeed *= 1.05;
    airplane.rocketGroup.position.y -= game.planeFallSpeed*deltaTime;

    if (airplane.rocketGroup.position.y <-200){
      showReplay();
      game.status = "waitingReplay";
    }
  } else if (game.status == "waitingReplay") {
    // Stop music
    music.pause();
  }

  // airplane.propeller.rotation.x +=.2 + game.planeSpeed * deltaTime*.005;
  water.mesh.rotation.z += game.speed*deltaTime;//*game.seaRotationSpeed;

  if (water.mesh.rotation.z > 2 * Math.PI) water.mesh.rotation.z -= 2 * Math.PI;

  ambientLight.intensity += (0.5 - ambientLight.intensity) * deltaTime * 0.005;

  coinsHolder.rotateCoins();
  obstaclesHolder.rotateObstacles();
  landObstaclesHolder.rotateObstacles();
  sky.moveClouds();
  water.moveWaves();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updateDistance() {
  game.distance += game.speed * deltaTime * game.ratioSpeedDistance;
  var d = 502 * (1 - (game.distance % game.distanceForLevelUpdate) / game.distanceForLevelUpdate);
}

var blinkEnergy = false;

function updateEnergy(){
  // game.energy = Math.max(0, game.energy);
  game.heart = Math.max(0, game.heart);

  // if (game.energy <1){
  //   game.status = "gameover";
  // }
  if (game.heart <1){
    game.status = "gameover";
  }
}

function addEnergy(){
  if (game.status == 'gameover') return;
  // game.energy += 2;
  // game.energy = Math.min(game.energy, 100);

  game.heart = Math.min(game.heart, 6);

  game.score += game.coinValue;
  game.heart_point += 2;
  coinsCounter.innerHTML =  game.score;
  // healthCounter.innerHTML = 'Health = ' + game.energy;
  let invisible = healthCounter.getElementsByClassName('invisible')
  if(game.heart_point >=10 && game.heart < 5){
    // var heart_icon = document.createElement('img');
    // heart_icon.src = "./assets/photo/heart_icon.png"
    // heart_icon.setAttribute("width", "50");
    // heart_icon.setAttribute("height", "50");
    // heart_icon.setAttribute("alt", "heart");
    // heart_icon.classList.add('heart');
    // healthCounter.appendChild(heart_icon);
    healthCounter.childNodes[healthCounter.childNodes.length - invisible.length].classList.add('visible')
    healthCounter.childNodes[healthCounter.childNodes.length - invisible.length].classList.remove('invisible')
    game.heart +=1;
    game.heart_point = 0;
  }

  // Play pickup sound
  var asd = pickupSound.play();
}

function removeEnergy(){
  if (game.status == 'gameover') return;
  game.heart -= 1;
  game.heart = Math.max(0, game.heart)

  // if(healthCounter.children.length > 0)
  // healthCounter.removeChild(healthCounter.childNodes[0])

  let visible = healthCounter.getElementsByClassName('visible')

  if(visible.length){
    healthCounter.childNodes[visible.length-1].classList.add('invisible')
    healthCounter.childNodes[visible.length-1].classList.remove('visible')
  }
  // Play hurt sound
  hurtSound.play();
}

function showReplay() {
  replayMessage.style.display = "block";
}

function hideReplay() {
  replayMessage.style.display = "none";
}

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + pc * dt;
  return tv;
}

var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle, coinsCounter, healthCounter;

function init(event) {
  // UI
  fieldDistance = document.getElementById("distValue");
  energyBar = document.getElementById("energyBar");
  replayMessage = document.getElementById("replayMessage");
  fieldLevel = document.getElementById("levelValue");
  levelCircle = document.getElementById("levelCircleStroke");
  coinsCounter = document.getElementById('coinsValue');
  healthCounter = document.getElementById('healthCounter');

  resetGame();
  heart_init = 1;
  game.status = 'waitingReplay';
  replayMessage.style.display = 'block';
  
  createScene();
  createLights();
  createPlane();
  createWater();
  createSky();
  createCoins();
  createObstacles();
  createLandObstacles();

  document.addEventListener("mousemove", handleMouseMove, false);
  document.addEventListener("touchmove", handleTouchMove, false);
  document.addEventListener("mouseup", handleMouseUp, false);
  document.addEventListener("touchend", handleTouchEnd, false);
  document.addEventListener("keydown", handleKeyDown, false);

  // SOUND EFFECTS
  pickupSound = new Audio("assets/pickup.mp3");
  hurtSound = new Audio("assets/explosion.mp3");
  music = new Audio("assets/bgm.mp3");
  pickupSound.volume = 0.75;
  hurtSound.volume = 0.5;
  music.volume = 0.25;
  music.loop = true;
  loop();
}

window.addEventListener("load", init, false);
