// Fungsi untuk membuat objek koin baru
Coin = function(){
  let geom = new THREE.CylinderGeometry(4, 4, 1, 10)

  let mat = new THREE.MeshPhongMaterial({
    color: 0xFFD700 ,
    shininess: 1,
    specular: 0xffffff,
    flatShading: true,

    shading:THREE.FlatShading
  });

  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

// Fungsi untuk membuat CoinsHolder untuk menyimpan objek - objek koin yang sudah dibuat
CoinsHolder = function (coinCount) {
  this.mesh = new THREE.Object3D();

  this.coinsInUse = [];
  this.coinsPool = [];

  for (let i = 0; i < coinCount; i++){
    this.coinsPool.push(new Coin());
  }
}

// Fungsi untuk membuat koin pada game
function createCoins() {
  coinsHolder = new CoinsHolder(20);
  scene.add(coinsHolder.mesh)
}

// Fungsi untuk membuat koin - koin baru pada game secara acak
CoinsHolder.prototype.spawnCoins = function() {
  let coinCount = 1 + Math.floor(Math.random()*10);
  let d = game.waterRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
  let amplitude = 10 + Math.round(Math.random()*10);

  for (let i=0; i<coinCount; i++){
    let coin;
    if (this.coinsPool.length) {
      coin = this.coinsPool.pop();
    } else {
      coin = new Coin();
    }

    this.mesh.add(coin.mesh);
    this.coinsInUse.push(coin);

    coin.angle = - (i*0.02);
    coin.distance = d + Math.cos(i*.5)*amplitude;

    coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
    coin.mesh.position.y = -game.waterRadius + Math.sin(coin.angle)*coin.distance;
  }
}

// Fungsi untuk memutar objek - objek koin
CoinsHolder.prototype.rotateCoins = function() {
  for (let i = 0; i < this.coinsInUse.length; i++) {
    let coin = this.coinsInUse[i];
    if (coin.exploding) continue; // Jika koin sudah diambil, jangan diupdate

    // Memutar objek koin
    coin.angle += game.speed*deltaTime*game.coinsSpeed;
    if (coin.angle>Math.PI*2) coin.angle -= Math.PI*2;

    // Update posisi dan rotasi koin
    coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
    coin.mesh.position.y = -game.waterRadius + Math.sin(coin.angle)*coin.distance;
    coin.mesh.rotation.z += Math.random()*.1;
    coin.mesh.rotation.y += Math.random()*.1;

    // Mengecek jika koin diambil oleh player
    var diffPos = airplane.rocketGroup.position.clone().sub(coin.mesh.position.clone());
    var d = diffPos.length();

    if (d < game.coinDistanceTolerance) // Jika koin ditabrak oleh player
    {
      this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
      this.mesh.remove(coin.mesh);

      addEnergy();

      i--;
    } else if (coin.angle > Math.PI) { // Jika koin sudah jauh dibelakang player
      this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
      this.mesh.remove(coin.mesh);
      i--;
    }
  }
}