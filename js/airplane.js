// Referensi https://codepen.io/davidlyons/pen/GOzQyG
var Rocket = function(){
  this.rocketGroup = new THREE.Group();
  var rocket = new THREE.Group();

  var OutlineShader = {
    uniforms: {
      offset: { type: 'f', value: 0.3 },
      color: { type: 'c', value: new THREE.Color('#000000') },
      alpha: { type: 'f', value: 1.0 },
    },
  
    vertexShader:`
      uniform float offset;
      void main() {
        vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );
        gl_Position = projectionMatrix * pos;
      }
    `,
  
    fragmentShader:`
      uniform vec3 color;
      uniform float alpha;
      void main() {
        gl_FragColor = vec4( color, alpha );
      }
    `
  };

  rocket.position.y = -1.5; // vertically center
  this.rocketGroup.add( rocket );

  var points = [];
  points.push( new THREE.Vector2( 0, 0 ) ); // bottom

  for ( var i = 0; i < 11; i ++ ) {
    var point = new THREE.Vector2(
      Math.cos( i * 0.227 - 0.75 ) * 8,
      i * 4.0
    );
    points.push( point );
  }
  points.push( new THREE.Vector2( 0, 40 ) ); // tip


  var rocketGeo = new THREE.LatheGeometry( points, 32 );

  var rocketMat = new THREE.MeshPhongMaterial({
    color: 0xcccccc,
    shininess: 1
  });

  var rocketOutlineMat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone( OutlineShader.uniforms ),
    vertexShader: OutlineShader.vertexShader,
    fragmentShader: OutlineShader.fragmentShader,
    side: THREE.BackSide,
  });

  var rocketObj = THREE.SceneUtils.createMultiMaterialObject(
    rocketGeo, [ rocketMat, rocketOutlineMat ]
  );
  rocketObj.scale.setScalar( 0.1 );
  rocket.add( rocketObj );

  // window
  var portalGeo = new THREE.CylinderBufferGeometry( 0.26, 0.26, 1.6, 32 );

  var portalMat = new THREE.MeshPhongMaterial({ color: 0x90dcff });

  var portalOutlineMat = rocketOutlineMat.clone();
  portalOutlineMat.uniforms.offset.value = 0.03;
  var portal = THREE.SceneUtils.createMultiMaterialObject(
    portalGeo, [ portalMat, portalOutlineMat ]
  );
  portal.position.y = 2;
  portal.rotation.x = Math.PI / 2;
  rocket.add( portal );

  // ------------
  var circle = new THREE.Shape();
  circle.absarc( 0, 0, 3.5, 0, Math.PI * 2 );

  var hole = new THREE.Path();
  hole.absarc( 0, 0, 3, 0, Math.PI * 2 );
  circle.holes.push( hole );

  var tubeExtrudeSettings = {
    amount: 17,
    steps: 1,
    bevelEnabled: false
  };
  var tubeGeo = new THREE.ExtrudeGeometry( circle, tubeExtrudeSettings );
  tubeGeo.computeVertexNormals();
  tubeGeo.center();
  
  var tubeMat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 1
  });
  var tubeOutlineMat = rocketOutlineMat.clone();
  tubeOutlineMat.uniforms.offset.value = 0.2;
  var tube = THREE.SceneUtils.createMultiMaterialObject(
    tubeGeo, [ tubeMat, tubeOutlineMat ]
  );
  tube.position.y = 2;
  tube.scale.setScalar( 0.1 );
  rocket.add( tube );

  // wing
  var shape = new THREE.Shape();

  shape.moveTo( 3, 0 );
  shape.quadraticCurveTo( 25, -8, 15, -37 );
  shape.quadraticCurveTo( 13, -21, 0, -20 );
  shape.lineTo( 3, 0 );

  var extrudeSettings = {
    steps: 1,
    amount: 4,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 2,
    bevelSegments: 5
  };

  var wingGroup = new THREE.Group();
  rocket.add( wingGroup );

  var wingGeo = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  wingGeo.computeVertexNormals();
  
  var wingMat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 1,
  });
  var wingOutlineMat = rocketOutlineMat.clone();
  wingOutlineMat.uniforms.offset.value = 1;
  var wing = THREE.SceneUtils.createMultiMaterialObject(
    wingGeo, [ wingMat, wingOutlineMat ]
  );
  wing.scale.setScalar( 0.03 );
  wing.position.set( .6, 0.9, 0 );
  wingGroup.add( wing );

  var wing2 = wingGroup.clone();
  wing2.rotation.y = Math.PI;
  rocket.add( wing2 );

  var wing3 = wingGroup.clone();
  wing3.rotation.y = Math.PI / 2;
  rocket.add( wing3 );

  var wing4 = wingGroup.clone();
  wing4.rotation.y = - Math.PI / 2;
  rocket.add( wing4 );
  
  // fire
  var firePoints = [];
  for ( var i = 0; i <= 10; i ++ ) {
    var point = new THREE.Vector2(
      Math.sin( i * 0.18 ) * 8,
      (-10 + i) * 2.5
    );

    firePoints.push( point );
  }

  var fireGeo = new THREE.LatheGeometry( firePoints, 32 );
  var fireMat = new THREE.ShaderMaterial({
    uniforms: {
      color1: { type: 'c', value: new THREE.Color('blue') },
      color2: { type: 'c', value: new THREE.Color(0xff7b00)}
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
      }
    `,
  });

  this.fire = new THREE.Mesh(fireGeo, fireMat);
  this.fire.scale.setScalar( 0.06 );
  rocket.add( this.fire );

  var fireLight = new THREE.PointLight( 0xff7b00, 1, 9 );
  fireLight.position.set( 0, -1, 0 );
  rocket.add( fireLight );
}


function createPlane(){
  airplane = new Rocket();
  airplane.rocketGroup.scale.set(5.25,5.25,5.25);
  airplane.rocketGroup.position.y = game.planeDefaultHeight + 10;
  airplane.rocketGroup.rotation.z = 3*Math.PI / 2;
  scene.add(airplane.rocketGroup);
}

function updatePlane() {
  // Kontrol pesawat
  game.planeSpeed = normalize(mousePos.x, -0.5, 0.5, game.planeMinSpeed, game.planeMaxSpeed);
  let targetY = normalize(
    mousePos.y,
    -0.75,
    0.75,
    game.planeDefaultHeight - game.planeAmpHeight,
    game.planeDefaultHeight + game.planeAmpHeight
  );
  let targetX = normalize(mousePos.x, -1, 1, -game.planeAmpWidth * 0.7, -game.planeAmpWidth);

  // Jika pesawat menabrak obstacle
  game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
  targetX += game.planeCollisionDisplacementX;

  game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
  targetY += game.planeCollisionDisplacementY;

  // Update posisi pesawat
  airplane.rocketGroup.position.y += (targetY-airplane.rocketGroup.position.y)*deltaTime*game.planeMoveSensivity;
  airplane.rocketGroup.position.x += (targetX-airplane.rocketGroup.position.x)*deltaTime*game.planeMoveSensivity;
  // Update rotasi pesawat
  // airplane.rocketGroup.rotation.z = (targetY-airplane.rocketGroup.position.y)*deltaTime*game.planeRotXSensivity;
  airplane.rocketGroup.rotation.z = 3*Math.PI/2;
  airplane.rocketGroup.rotation.x = (airplane.rocketGroup.position.y-targetY)*deltaTime*game.planeRotZSensivity;
  //update rotasi api
  airplane.fire.scale.y = THREE.Math.randFloat(0.04, 0.08);

  // Zoom in / out kamera
  camera.fov = normalize(mousePos.x, -1, 1, 40, 80);
  camera.updateProjectionMatrix();
  camera.position.y +=
    (airplane.rocketGroup.position.y - camera.position.y) * deltaTime * game.cameraSensivity;

  // Kecepatan roket setelah tabrakan
  game.planeCollisionSpeedX += (0 - game.planeCollisionSpeedX) * deltaTime * 0.03;
  game.planeCollisionDisplacementX += (0 - game.planeCollisionDisplacementX) * deltaTime * 0.01;
  game.planeCollisionSpeedY += (0 - game.planeCollisionSpeedY) * deltaTime * 0.03;
  game.planeCollisionDisplacementY += (0 - game.planeCollisionDisplacementY) * deltaTime * 0.01;
}
