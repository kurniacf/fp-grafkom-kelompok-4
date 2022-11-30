function createWater(){
  water = new Water();
  water.mesh.position.y = -game.waterRadius;
  scene.add(water.mesh);
}

Water = function(){
  let geom = new THREE.CylinderGeometry(game.waterRadius,game.waterRadius,game.waterLength,40,10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  geom.mergeVertices();
  let l = geom.vertices.length;

  this.waves = [];

  for (let i=0;i<l;i++){
    let v = geom.vertices[i];
    //v.y = Math.random()*30;
    this.waves.push(
      {
        y:v.y,
        x:v.x,
        z:v.z,
        ang:Math.random()*Math.PI*2,
        amp:game.wavesMinAmp + Math.random()*(game.wavesMaxAmp-game.wavesMinAmp),
        speed:game.wavesMinSpeed + Math.random()*(game.wavesMaxSpeed - game.wavesMinSpeed)
      }
    );
  };
  let mat = new THREE.MeshPhongMaterial({
    // color:colorList.blue,
    color: 0x0072a0,
    transparent:true,
    opacity:.8,
    shading:THREE.FlatShading,
  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.name = "waves";
  this.mesh.receiveShadow = true;
}

Water.prototype.moveWaves = function (){
  let verts = this.mesh.geometry.vertices;
  let l = verts.length;
  for (let i=0; i<l; i++){
    let v = verts[i];
    let vprops = this.waves[i];
    v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
    vprops.ang += vprops.speed*deltaTime;
    this.mesh.geometry.verticesNeedUpdate=true;
  }
}