var AirPlane = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // Kabin pesawat

  var geomCabin = new THREE.BoxGeometry(80,50,50,1,1,1);
  var matCabin = new THREE.MeshPhongMaterial({color:colorList.blue, shading:THREE.FlatShading});

  geomCabin.vertices[4].y-=10;
  geomCabin.vertices[4].z+=20;
  geomCabin.vertices[5].y-=10;
  geomCabin.vertices[5].z-=20;
  geomCabin.vertices[6].y+=30;
  geomCabin.vertices[6].z+=20;
  geomCabin.vertices[7].y+=30;
  geomCabin.vertices[7].z-=20;

  var cabin = new THREE.Mesh(geomCabin, matCabin);
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  this.mesh.add(cabin);

  // Mesin pesawat

  var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:colorList.white, shading:THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 50;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  // Ekor pesawat

  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:colorList.blue, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-40,20,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
  this.mesh.add(tailPlane);

  // Sayap pesawat

  var geomSideWing = new THREE.BoxGeometry(30,5,120,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:colorList.blue, shading:THREE.FlatShading});
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0,15,0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
  this.mesh.add(sideWing);

  // Baling - baling pesawat

  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  geomPropeller.vertices[4].y-=5;
  geomPropeller.vertices[4].z+=5;
  geomPropeller.vertices[5].y-=5;
  geomPropeller.vertices[5].z-=5;
  geomPropeller.vertices[6].y+=5;
  geomPropeller.vertices[6].z+=5;
  geomPropeller.vertices[7].y+=5;
  geomPropeller.vertices[7].z-=5;
  var matPropeller = new THREE.MeshPhongMaterial({color:colorList.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);

  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  var geomBlade = new THREE.BoxGeometry(1,80,10,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:colorList.brownDark, shading:THREE.FlatShading});
  var blade1 = new THREE.Mesh(geomBlade, matBlade);
  blade1.position.set(8,0,0);

  blade1.castShadow = true;
  blade1.receiveShadow = true;

  var blade2 = blade1.clone();
  blade2.rotation.x = Math.PI/2;

  blade2.castShadow = true;
  blade2.receiveShadow = true;

  this.propeller.add(blade1);
  this.propeller.add(blade2);
  this.propeller.position.set(60,0,0);
  this.mesh.add(this.propeller);

  // Ban pesawat

  var wheelProtecGeom = new THREE.BoxGeometry(30,15,10,1,1,1);
  var wheelProtecMat = new THREE.MeshPhongMaterial({color:colorList.blue, shading:THREE.FlatShading});
  var wheelProtecR = new THREE.Mesh(wheelProtecGeom,wheelProtecMat);
  wheelProtecR.position.set(25,-20,25);
  this.mesh.add(wheelProtecR);

  var wheelTireGeom = new THREE.BoxGeometry(24,24,4);
  var wheelTireMat = new THREE.MeshPhongMaterial({color:colorList.brownDark, shading:THREE.FlatShading});
  var wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
  wheelTireR.position.set(25,-28,25);

  var wheelAxisGeom = new THREE.BoxGeometry(10,10,6);
  var wheelAxisMat = new THREE.MeshPhongMaterial({color:colorList.brown, shading:THREE.FlatShading});
  var wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);
  wheelTireR.add(wheelAxis);

  this.mesh.add(wheelTireR);

  // Ban kiri

  var wheelProtecL = wheelProtecR.clone();
  wheelProtecL.position.z = -wheelProtecR.position.z ;
  this.mesh.add(wheelProtecL);

  var wheelTireL = wheelTireR.clone();
  wheelTireL.position.z = -wheelTireR.position.z;
  this.mesh.add(wheelTireL);

  var wheelTireB = wheelTireR.clone();
  wheelTireB.scale.set(.5,.5,.5);
  wheelTireB.position.set(-35,-5,0);
  this.mesh.add(wheelTireB);

  // Suspensi ban belakang pesawat

  var suspensionGeom = new THREE.BoxGeometry(4,20,4);
  suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0))
  var suspensionMat = new THREE.MeshPhongMaterial({color:colorList.blue, shading:THREE.FlatShading});
  var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
  suspension.position.set(-35,-5,0);
  suspension.rotation.z = -.3;
  this.mesh.add(suspension);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;

};

var Rocket = function(){
  this.rocketGroup = new THREE.Group();
  var rocket = new THREE.Group();


  var OutlineShader = {

    uniforms: {
      offset: { type: 'f', value: 0.3 },
      color: { type: 'v3', value: new THREE.Color('#000000') },
      alpha: { type: 'f', value: 1.0 }
    },
  
    vertexShader: [
  
      "uniform float offset;",
  
      "void main() {",
      "  vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );",
      "  gl_Position = projectionMatrix * pos;",
      "}"
  
    ].join('\n'),
  
    fragmentShader: [
  
      "uniform vec3 color;",
      "uniform float alpha;",
  
      "void main() {",
      "  gl_FragColor = vec4( color, alpha );",
      "}"
  
    ].join('\n')
  
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

  // var rocketMat = new THREE.MeshToonMaterial({
  //   color: 0xcccccc,
  //   shininess: 1
  // });
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
  // var portalMat = new THREE.MeshToonMaterial({ color: 0x90dcff });
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
  // var tubeMat = new THREE.MeshToonMaterial({
  //   color: 0xff0000,
  //   shininess: 1
  // });
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
  // var wingMat = new THREE.MeshToonMaterial({
  //   color: 0xff0000,
  //   shininess: 1,
  // });
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
      color1: { value: new THREE.Color('blue') },
      color2: { value: new THREE.Color(0xff7b00) } // orange
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

  // var fireLightHelper = new THREE.PointLightHelper( fireLight, 0.5 );
  // scene.add( fireLightHelper );

}


function createPlane(){
  // airplane = new AirPlane();
  airplane = new Rocket();
  airplane.rocketGroup.scale.set(5.25,5.25,5.25);
  airplane.rocketGroup.position.y = game.planeDefaultHeight + 10;
  airplane.rocketGroup.rotation.z = 3*Math.PI / 2;
  scene.add(airplane.rocketGroup);
}

function updatePlane()
{
  // Kontrol pesawat
  game.planeSpeed = normalize(mousePos.x,-.5,.5,game.planeMinSpeed, game.planeMaxSpeed);
  var targetY = normalize(mousePos.y,-.75,.75,game.planeDefaultHeight-game.planeAmpHeight, game.planeDefaultHeight+game.planeAmpHeight);
  var targetX = normalize(mousePos.x,-1,1,-game.planeAmpWidth*.7, -game.planeAmpWidth);

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
  var targetCameraZ = normalize(game.planeSpeed, game.planeMinSpeed, game.planeMaxSpeed, game.cameraNearPos, game.cameraFarPos);
  camera.fov = normalize(mousePos.x,-1,1,40, 80);
  camera.updateProjectionMatrix ()
  camera.position.y += (airplane.rocketGroup.position.y - camera.position.y)*deltaTime*game.cameraSensivity;

  // Kecepatan pesawat setelah tabrakan
  game.planeCollisionSpeedX += (0-game.planeCollisionSpeedX)*deltaTime * 0.03;
  game.planeCollisionDisplacementX += (0-game.planeCollisionDisplacementX)*deltaTime *0.01;
  game.planeCollisionSpeedY += (0-game.planeCollisionSpeedY)*deltaTime * 0.03;
  game.planeCollisionDisplacementY += (0-game.planeCollisionDisplacementY)*deltaTime *0.01;
}