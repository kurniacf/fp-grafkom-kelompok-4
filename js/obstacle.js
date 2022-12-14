function createObstacles() {
  for (let i = 0; i < 10; i++) {
    let obstacle = new Obstacle();
    obstaclesPool.push(obstacle);
  }
  obstaclesHolder = new ObstaclesHolder();
  scene.add(obstaclesHolder.mesh);
}

function createLandObstacles() {
  for (let i = 0; i < 10; i++) {
    let landObstacle = new LandObstacle();
    landObstaclesPool.push(landObstacle);
  }
  landObstaclesHolder = new LandObstacleHolder();
  scene.add(landObstaclesHolder.mesh);
}

Obstacle = function () {
  let geom = new THREE.DodecahedronGeometry(8, 0);
  let mat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0xc7bca1),
    shininess: 0,
    specular: 0x252525,
    shading: THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.angle = 0.25;
  this.dist = 0;
};

LandObstacle = function () {
  let geom = new THREE.BoxGeometry(20, 70, 20);
  let mat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0x8b7e74),
    shininess: 0,
    specular: 0x252525,
    shading: THREE.FlatShading,
  });
  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.castShadow = true;
  this.angle = 0.25;
  this.dist = 0;
};

ObstaclesHolder = function () {
  this.mesh = new THREE.Object3D();
  this.obstaclesInUse = [];
};

LandObstacleHolder = function () {
  this.mesh = new THREE.Object3D();
  this.landObstaclesInUse = [];
};

ObstaclesHolder.prototype.spawnObstacles = function () {
  let nObstacles = game.level;

  for (let i = 0; i < nObstacles; i++) {
    let obstacle;
    if (obstaclesPool.length) {
      obstacle = obstaclesPool.pop();
    } else {
      obstacle = new Obstacle();
    }

    obstacle.angle = -(i * 0.1);
    obstacle.distance =
      game.waterRadius +
      game.planeDefaultHeight +
      (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
    obstacle.mesh.position.y = -game.waterRadius + Math.sin(obstacle.angle) * obstacle.distance;
    obstacle.mesh.position.x = Math.cos(obstacle.angle) * obstacle.distance;

    this.mesh.add(obstacle.mesh);
    this.obstaclesInUse.push(obstacle);
  }
};

ObstaclesHolder.prototype.rotateObstacles = function () {
  for (let i = 0; i < this.obstaclesInUse.length; i++) {
    let obstacle = this.obstaclesInUse[i];
    obstacle.angle += game.speed * deltaTime * game.obstaclesSpeed;

    if (obstacle.angle > Math.PI * 2) obstacle.angle -= Math.PI * 2;

    obstacle.mesh.position.y =
      -game.waterRadius + Math.sin(obstacle.angle) * obstacle.distance + 30;
    obstacle.mesh.position.x = Math.cos(obstacle.angle) * obstacle.distance;
    obstacle.mesh.rotation.z += Math.random() * 0.1;
    obstacle.mesh.rotation.y += Math.random() * 0.1;

    var diffPos = airplane.rocketGroup.position.clone().sub(obstacle.mesh.position.clone());
    var d = diffPos.length();
    if (d < game.obstacleDistanceTolerance) {
      obstaclesPool.unshift(this.obstaclesInUse.splice(i, 1)[0]);
      this.mesh.remove(obstacle.mesh);
      game.planeCollisionSpeedX = (100 * diffPos.x) / d;
      game.planeCollisionSpeedY = (100 * diffPos.y) / d;
      ambientLight.intensity = 2;

      removeEnergy();
      i--;
    } else if (obstacle.angle > Math.PI) {
      obstaclesPool.unshift(this.obstaclesInUse.splice(i, 1)[0]);
      this.mesh.remove(obstacle.mesh);
      i--;
    }
  }
};

LandObstacleHolder.prototype.rotateObstacles = function () {
  for (let i = 0; i < this.landObstaclesInUse.length; i++) {
    let obstacle = this.landObstaclesInUse[i];
    obstacle.angle += game.speed * deltaTime * game.obstaclesSpeed;

    if (obstacle.angle > Math.PI * 2) obstacle.angle -= Math.PI * 2;

    obstacle.mesh.position.y =
      -game.waterRadius + Math.sin(obstacle.angle) * (obstacle.distance - 2) + 10;
    obstacle.mesh.position.x = Math.cos(obstacle.angle) * obstacle.distance;

    var diffPos = airplane.rocketGroup.position.clone().sub(obstacle.mesh.position.clone());
    var d = diffPos.length();
    if (d < game.landObstacleDistanceTolerance) {
      landObstaclesPool.unshift(this.landObstaclesInUse.splice(i, 1)[0]);
      game.planeCollisionSpeedX = (100 * diffPos.x) / d;
      game.planeCollisionSpeedY = (100 * diffPos.y) / d;
      this.mesh.remove(obstacle.mesh);
      ambientLight.intensity = 2;
      removeEnergy();
      i--;
    } else if (obstacle.angle > Math.PI) {
      landObstaclesPool.unshift(this.landObstaclesInUse.splice(i, 1)[0]);
      this.mesh.remove(obstacle.mesh);
      i--;
    }
  }
};

LandObstacleHolder.prototype.spawnObstacles = function () {
  let nObstacles = game.level;

  for (let i = 0; i < nObstacles; i++) {
    let landObstacle;
    if (landObstaclesPool.length) {
      console.log("Posisi Land Obstacle y = " + landObstaclesPool[0].mesh.position.y);
      landObstacle = landObstaclesPool.pop();
    } else {
      landObstacle = new LandObstacle();
    }

    landObstacle.angle = -(i * 0.8);
    landObstacle.distance =
      game.waterRadius + game.planeDefaultHeight + (-2 + Math.random()) * (game.planeAmpHeight - 5);
    landObstacle.mesh.position.y =
      -game.waterRadius + Math.sin(landObstacle.angle) * (landObstacle.distance - 2);
    landObstacle.mesh.position.x = Math.cos(landObstacle.angle) * landObstacle.distance;

    this.mesh.add(landObstacle.mesh);
    this.landObstaclesInUse.push(landObstacle);
  }
};
