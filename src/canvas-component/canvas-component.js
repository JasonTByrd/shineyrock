import React, { Component } from "react";
import './canvas-component.css';
import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import PickHelper from "pick-helper";
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions'
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import waternormals from '../assets/textures/water/waternormals.jpg';
//import droidSans from '../assets/fonts/droid/droid_sans_bold.typeface.json'
import helvetica from '../assets/fonts/helvetiker_regular.typeface.json'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
//import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
//import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';


class CanvasComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //crossHair: false,
    }
  }

  scene; 
  camera;
  renderer; 
  mesh;
  meshFloor;
  controls;
  mount;
  pickHelper;
  colorFlashInteval;
  pointerLockedStatus = false;
  payload = 5;
  turningLeft = false;
  turningRight = false;
  cameraOriginalRotation;
  mobile;

  //Water
  waterGeometry;
  water;
  light;
  waterUniforms;

  //skybox
  sky;
  uniforms;
  parameters;
  cubeCamera;
  backgroundOrb;

  //fontLoader
  fontLoader;
  textMesh;
  textGeometry;
  selectedFont;
  textMaterial;
  threeFont;
  textMesh02;
  textMaterial02;
  textGeometry;
  textGeometry02;
  textContainerLogoGeo;
  textContainerLogoMat;
  textContainerLogo;


  textMesh03;
  textMesh04;
  textMaterial03;
  textMaterial04;
  textGeometry03;
  textGeometry04;
  textContainerAboutGeo;
  textContainerAboutMat;
  textContainerAbout;


  textMesh05;
  textMesh06;
  textMaterial05;
  textMaterial06;
  textGeometry05;
  textGeometry06;
  textContainerPortfolioGeo;
  textContainerPortfolioMat;
  textContainerPortfolio;


  textMesh07;
  textMesh08;
  textMaterial07;
  textMaterial08;
  textGeometry07;
  textGeometry08;
  textContainerContactGeo;
  textContainerContactMat;
  textContainerContact;

  //Lights
  pointLight01;
  pointLightOrb01;
  pointLightGroup01;
  pointLight02;
  pointLightOrb02;
  pointLightGroup02;
  pointLight03;
  pointLightOrb03;
  pointLightGroup03;

  pointLightTextGlow;

  //rendering
  renderPass;
  fxaaPass;
  pixelRatio;
  composer1;
  copyPass;
  composer2;
  bloomPass;
  bloomPass02;
  bloomComposer;
  bloomParams;
  bloomParams02;
  ssaaRenderPass;

  //reflection
  cubeCameraTexture;

  
  keyboard = new Array(100).fill(false);
  player;

  componentDidMount() {

    window.addEventListener('mousemove', this.mouseMoveSelection);
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('resize', this.onWindowResize, false );

    this.mobile = 'ontouchstart' in document.documentElement;


    this.useWireframe = false;
    this.player = { height:1.5, speed:0.08, turnSpeed:Math.PI*0.02 }
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1280/720, 1, 20000);

    this.cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
    this.cubeCamera.renderTarget.texture.generateMipmaps = true;
    this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.scene.background = this.cubeCamera.renderTarget;

    this.scene.fog = new THREE.FogExp2( 0x000000, 0.0200 );


    this.light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.scene.add( this.light );

    this.pointLight01 = new THREE.PointLight(0xffffff, 1.55);
    this.pointLightOrb01 = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 25, 25),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe:this.useWireframe})
    );
    this.pointLightGroup01 = new THREE.Group();
    this.pointLightGroup01.add(this.pointLightOrb01);
    this.pointLightGroup01.add(this.pointLight01);
    //this.camera.add(this.pointLightGroup01);
    this.pointLightGroup01.position.set(0,0,0);
    //this.scene.add(this.camera)

    //Lights




    this.pointLight02 = new THREE.PointLight(0xffffff, 0.55);
    this.pointLightOrb02 = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 10, 10),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe:this.useWireframe, fog: false})
    );
    this.pointLightGroup02 = new THREE.Group();
    this.pointLightGroup02.add(this.pointLightOrb02);
    this.pointLightGroup02.add(this.pointLight02);
    this.pointLightOrb02.position.set(1, 0, -7);
    this.pointLightGroup02.position.set(5.9, 2, -9);
    this.scene.add(this.pointLightGroup02)


    this.pointLight03 = new THREE.PointLight(0xffffff, 0.55);
    this.pointLightOrb03 = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 10, 10),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe:this.useWireframe, fog: false})
    );
    this.pointLightGroup03 = new THREE.Group();
    this.pointLightGroup03.add(this.pointLightOrb03);
    this.pointLightGroup03.add(this.pointLight03);
    this.pointLightOrb03.position.set(-1, 0, -7);
    this.pointLightGroup03.position.set(-5.9, 2, -9);
    this.scene.add(this.pointLightGroup03)

    //Lights

    //water

    this.waterGeometry = new THREE.PlaneBufferGeometry( 1000, 1000 );

    //water

    //fontLoader
    this.textContainerLogoGeo = new THREE.BoxGeometry(20, 3, 1);
    this.textContainerLogoMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.0});
    this.textContainerLogo = new THREE.Mesh(this.textContainerLogoGeo, this.textContainerLogoMat);
    this.textContainerLogo.position.set(0, 5.5, -15);
    this.scene.add(this.textContainerLogo);

    this.threeFont = new THREE.Font(helvetica);
    this.textMaterial = new THREE.MeshPhongMaterial({color: 0xBBBBBB});
    this.textGeometry = new THREE.TextGeometry("SHINEYROCK", {
        font: this.threeFont,
        size: 2,
        height: 0.05,
        italic: true
    });
    this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial);
    this.textMesh.position.y += 5;
    this.textMesh.position.x -= 8.45;
    this.textMesh.position.z -= 15;
    this.textMesh.castShadow = true;
    this.scene.add(this.textMesh);

    this.textMaterial02 = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.textGeometry02 = new THREE.TextGeometry("SHINEYROCK", {
        font: this.threeFont,
        size: 2.01,
        height: 0.01,
        italic: true
    });
    this.textMesh02 = new THREE.Mesh(this.textGeometry02, this.textMaterial02);
    this.textMesh02.position.y += 4.95;
    this.textMesh02.position.x -= 8.50;
    this.textMesh02.position.z -= 14.98;
    this.textMesh02.castShadow = true;
    this.scene.add(this.textMesh02);






    //about

    this.textContainerAboutGeo = new THREE.BoxGeometry(10, 3, 1);
    this.textContainerAboutMat = new THREE.MeshBasicMaterial({wireframe: true, color: 0x777777, transparent: true, opacity: 0.0});
    this.textContainerAbout = new THREE.Mesh(this.textContainerAboutGeo, this.textContainerAboutMat);
    this.textContainerAbout.position.set(-14, 2, -17);
    this.textContainerAbout.rotation.y = 0.5;
    this.scene.add(this.textContainerAbout);


    this.textMaterial03 = new THREE.MeshPhongMaterial({color: 0xBBBBBB});
    this.textGeometry03 = new THREE.TextGeometry("ABOUTME", {
        font: this.threeFont,
        size: 1.5,
        height: 0.05
    });
    this.textMesh03 = new THREE.Mesh(this.textGeometry03, this.textMaterial03);
    this.textMesh03.position.y += 0.5;
    this.textMesh03.position.x -= 18.45;
    this.textMesh03.position.z -= 15;
    this.textMesh03.castShadow = true;
    this.textMesh03.rotation.y = 0.5;
    this.scene.add(this.textMesh03);

    this.textMaterial04 = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.textGeometry04 = new THREE.TextGeometry("ABOUTME", {
        font: this.threeFont,
        size: 1.51,
        height: 0.01
    });
    this.textMesh04 = new THREE.Mesh(this.textGeometry04, this.textMaterial04);
    this.textMesh04.position.y += 0.45;
    this.textMesh04.position.x -= 18.50;
    this.textMesh04.position.z -= 14.98;
    this.textMesh04.castShadow = true;
    this.textMesh04.rotation.y = 0.5;
    this.scene.add(this.textMesh04);

    //about

    //portfolio

    this.textContainerPortfolioGeo = new THREE.BoxGeometry(12, 3, 1);
    this.textContainerPortfolioMat = new THREE.MeshBasicMaterial({wireframe: true, color: 0x777777, transparent: true, opacity: 0.0});
    this.textContainerPortfolio = new THREE.Mesh(this.textContainerPortfolioGeo, this.textContainerPortfolioMat);
    this.textContainerPortfolio.position.set(0, 2, -18);
    this.scene.add(this.textContainerPortfolio);


    this.textMaterial05 = new THREE.MeshPhongMaterial({color: 0xBBBBBB});
    this.textGeometry05 = new THREE.TextGeometry("PORTFOLIO", {
        font: this.threeFont,
        size: 1.5,
        height: 0.05
    });
    this.textMesh05 = new THREE.Mesh(this.textGeometry05, this.textMaterial05);
    this.textMesh05.position.y += 0.5;
    this.textMesh05.position.x -= 5.45;
    this.textMesh05.position.z -= 18;
    this.textMesh05.castShadow = true;
    this.scene.add(this.textMesh05);

    this.textMaterial06 = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.textGeometry06 = new THREE.TextGeometry("PORTFOLIO", {
        font: this.threeFont,
        size: 1.51,
        height: 0.01
    });
    this.textMesh06 = new THREE.Mesh(this.textGeometry06, this.textMaterial06);
    this.textMesh06.position.y += 0.45;
    this.textMesh06.position.x -= 5.50;
    this.textMesh06.position.z -= 17.98;
    this.textMesh06.castShadow = true;
    this.scene.add(this.textMesh06);

    //portfolio

    //contact

    this.textContainerContactGeo = new THREE.BoxGeometry(10, 3, 1);
    this.textContainerContactMat = new THREE.MeshBasicMaterial({wireframe: true, color: 0x777777, transparent: true, opacity: 0.0});
    this.textContainerContact = new THREE.Mesh(this.textContainerContactGeo, this.textContainerContactMat);
    this.textContainerContact.position.set(14, 2, -16.5);
    this.textContainerContact.rotation.y = -0.5;
    this.scene.add(this.textContainerContact);


    this.textMaterial07 = new THREE.MeshPhongMaterial({color: 0xBBBBBB});
    this.textGeometry07 = new THREE.TextGeometry("CONTACT", {
        font: this.threeFont,
        size: 1.5,
        height: 0.05
    });
    this.textMesh07 = new THREE.Mesh(this.textGeometry07, this.textMaterial07);
    this.textMesh07.position.y += 0.5;
    this.textMesh07.position.x -= -9.40;
    this.textMesh07.position.z -= 18.98;
    this.textMesh07.castShadow = true;
    this.textMesh07.rotation.y = -0.5;
    this.scene.add(this.textMesh07);

    this.textMaterial08 = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.textGeometry08 = new THREE.TextGeometry("CONTACT", {
        font: this.threeFont,
        size: 1.51,
        height: 0.01
    });
    this.textMesh08 = new THREE.Mesh(this.textGeometry08, this.textMaterial08);
    this.textMesh08.position.y += 0.45;
    this.textMesh08.position.x -= -9.35;
    this.textMesh08.position.z -= 19;
    this.textMesh08.castShadow = true;
    this.textMesh08.rotation.y = -0.5;
    this.scene.add(this.textMesh08);

    //contact

    //fontLoader
    
    this.meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(100,100, 1,1),
      new THREE.MeshPhongMaterial({color:0xffffff, wireframe: false})
    );
    this.meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    this.meshFloor.position.y += -1;
    this.scene.add(this.meshFloor);

    this.backgroundOrb = new THREE.Mesh(
      new THREE.SphereGeometry(50, 25, 15),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe: true})
    );

    this.scene.add(this.backgroundOrb);
    
    //this.camera.lookAt(new THREE.Vector3(0,this.player.height,0));
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(this.renderer.domElement);

    //rendering

    this.bloomParams = {
      exposure: 2,
      bloomStrength: 2,
      bloomThreshold: 0.8,
      bloomRadius: 0.000000,
      scene: "Scene with Glow"
    };

    if(!this.mobile) {
      this.camera.position.set(0, this.player.height, 15);
    }
    else if (this.mobile && window.innerWidth > 1200) {
      this.setState(this.props.onMobile(this.payload));
      this.camera.position.set(0, this.player.height, 15);
      this.bloomParams.bloomThreshold = 0.7;
    }
    else {
      this.camera.position.set(0, this.player.height, 22);
      this.setState(this.props.onMobile(this.payload));
      this.bloomParams.bloomThreshold = 0.5;
    }

    // this.bloomParams02 = {
    //   exposure: 0.2,
    //   bloomStrength: 0.3,
    //   bloomThreshold: 0.1,
    //   bloomRadius: 0.0,
    //   scene: "Scene with Glow"
    // };


    this.composer1 = new EffectComposer( this.renderer )
    //this.fxaaPass = new ShaderPass( FXAAShader );
    //this.pixelRatio = this.renderer.getPixelRatio();

    this.ssaaRenderPass = new SSAARenderPass( this.scene, this.camera );
    this.ssaaRenderPass.unbiased = true;
    this.ssaaRenderPass.sampleLevel = 2;
    this.composer1.addPass( this.ssaaRenderPass );

    //this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.mount.offsetWidth * this.pixelRatio );
    //this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.mount.offsetHeight * this.pixelRatio );

    this.copyPass = new ShaderPass( CopyShader );
    this.composer1.addPass( this.copyPass );

    // this.renderPass = new RenderPass( this.scene, this.camera );
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    this.bloomPass.threshold = this.bloomParams.bloomThreshold;
    this.bloomPass.strength = this.bloomParams.bloomStrength;
    this.bloomPass.radius = this.bloomParams.bloomRadius;

    // this.bloomPass02 = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    // this.bloomPass02.threshold = this.bloomParams02.bloomThreshold;
    // this.bloomPass02.strength = this.bloomParams02.bloomStrength;
    // this.bloomPass02.radius = this.bloomParams02.bloomRadius;

    //this.composer1.addPass( this.renderPass );
    this.composer1.addPass( this.bloomPass );
    //this.composer1.addPass( this.bloomPass02 );

    //rendering

    this.controls = new PointerLockControls(this.camera);

    this.pickHelper = new PickHelper(this.scene, this.camera);
    //console.log(this.scene, this.pickHelper.scene)











    //water
    this.water = new Water(
      this.waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( waternormals, function ( texture ) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        } ),
        alpha: 0.9,
        sunDirection: this.light.position.clone().normalize(),
        sunColor: 0x000000,
        waterColor: 0x000000,
        distortionScale: 0.4,
        fog: this.scene.fog !== undefined
      }
    );

    this.waterUniforms = this.water.material.uniforms;

    this.water.material.uniforms.size.value = 4;

    console.log(this.water);


    this.water.rotation.x = - Math.PI / 2;
    this.scene.add( this.water );

    //water












    //skybox





    this.sky = new Sky();
    this.uniforms = this.sky.material.uniforms;
    this.sky.material.fog = true;

    this.uniforms[ 'turbidity' ].value = 1;
    this.uniforms[ 'rayleigh' ].value = 2;
    this.uniforms[ 'luminance' ].value = 0.2;
    this.uniforms[ 'mieCoefficient' ].value = 0.99;
    this.uniforms[ 'mieDirectionalG' ].value = 0.99;

    this.parameters = {
      distance: 400,
      inclination: 0.49,
      azimuth: 0.205
    };


    //this.updateSun();


    //skybox




    this.cubeCameraTexture = new THREE.CubeCamera( 1, 10000, 128 );
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 25, 25),
      new THREE.MeshPhongMaterial({color:0xffffff, wireframe:this.useWireframe, side: THREE.DoubleSide, flatShading: false, envMap: this.cubeCameraTexture.renderTarget.texture})
    );
    this.cubeCameraTexture.position.copy(this.mesh.position);
    this.mesh.position.y += 2;
    this.mesh.castShadow = true;
    //this.scene.add(this.mesh);




    window.addEventListener('click', this.clickOnObject);

    document.addEventListener('pointerlockchange', this.pointerLocked);

    this.onWindowResize();
    
    this.animate();
  }

  updateSun = () => {
    let theta = Math.PI * ( this.parameters.inclination - 0.5 );
    let phi = 2 * Math.PI * ( this.parameters.azimuth - 0.5 );
    this.light.position.x = this.parameters.distance * Math.cos( phi );
    this.light.position.y = this.parameters.distance * Math.sin( phi ) * Math.sin( theta );
    this.light.position.z = this.parameters.distance * Math.sin( phi ) * Math.cos( theta );
    this.sky.material.uniforms[ 'sunPosition' ].value = this.light.position.copy( this.light.position );
    this.water.material.uniforms[ 'sunDirection' ].value.copy( this.light.position ).normalize();
    this.cubeCamera.update( this.renderer, this.sky );
  }

  animate = () => {

    var time = performance.now() * 0.001;

    requestAnimationFrame(this.animate);

    this.water.material.uniforms[ 'time' ].value += 0.2 / 60.0;

    this.pointLightGroup02.position.y = Math.sin( time ) * 0.1 + 1.2;
    this.pointLightGroup03.position.y = Math.sin( time ) * -0.1 + 1.2;
	
    // this.backgroundOrb.rotation.x += 0.0001;
    this.backgroundOrb.rotation.y += 0.0002;
    // this.backgroundOrb.rotation.z += 0.0002;

    if (this.pointerLockedStatus) {
      let picked = this.pickHelper.pickCenter(this.scene, this.camera, this.mount);

      if (picked === this.textContainerLogo && picked !== false) {
        this.textMesh.hovered = true;
      }
      else {
        this.textMesh.hovered = false;
      }

      if (picked === this.textContainerAbout && picked !== false) {
        this.textMesh03.hovered = true;
      }
      else {
        this.textMesh03.hovered = false;
      }

      if (picked === this.textContainerPortfolio && picked !== false) {
        this.textMesh05.hovered = true;
      }
      else {
        this.textMesh05.hovered = false;
      }

      if (picked === this.textContainerContact && picked !== false) {
        this.textMesh07.hovered = true;
      }
      else {
        this.textMesh07.hovered = false;
      }
      
      if (picked) {
        this.mount.style.cursor = "pointer";
      } else {
        this.mount.style.cursor = "auto";
      }
    
      // Keyboard movement inputs
      if(this.keyboard[87]){ // W key
        this.camera.translateZ( - this.player.speed );
      }
      if(this.keyboard[83]){ // S key
        this.camera.translateZ( + this.player.speed );
      }
      if(this.keyboard[65]){ // A key
        // Redirect motion by 90 degrees
        this.camera.translateX( - this.player.speed );
      }
      if(this.keyboard[68]){ // D key
        this.camera.translateX( + this.player.speed );
      }

    } else {

    }

    if(this.textMesh.hovered === true && (this.textMaterial.color.r < 1 || this.textMaterial.color.g > 0.25 || this.textMaterial.color.b > 0.25)) {
      this.pointLight02.color.r -= 0.00;
      this.pointLight02.color.g -= 0.025;
      this.pointLight02.color.b -= 0.025;
      this.pointLight03.color.r -= 0.00;
      this.pointLight03.color.g -= 0.025;
      this.pointLight03.color.b -= 0.025;
      this.pointLightOrb02.material.color.r -= 0.00;
      this.pointLightOrb02.material.color.g -= 0.01;
      this.pointLightOrb02.material.color.b -= 0.01;
      this.pointLightOrb03.material.color.r -= 0.00;
      this.pointLightOrb03.material.color.g -= 0.01;
      this.pointLightOrb03.material.color.b -= 0.01;

      this.textMaterial.color.r += 0.025
      this.textMaterial.color.g -= 0.025
      this.textMaterial.color.b -= 0.025
    } else if(this.textMesh.hovered === false && (this.textMaterial.color.r > 0.73 || this.textMaterial.color.g < 0.73 || this.textMaterial.color.b < 0.73)) {
      this.pointLight02.color.r += 0.00;
      this.pointLight02.color.g += 0.025;
      this.pointLight02.color.b += 0.025;
      this.pointLight03.color.r += 0.00;
      this.pointLight03.color.g += 0.025;
      this.pointLight03.color.b += 0.025;
      this.pointLightOrb02.material.color.r += 0.00;
      this.pointLightOrb02.material.color.g += 0.01;
      this.pointLightOrb02.material.color.b += 0.01;
      this.pointLightOrb03.material.color.r += 0.00;
      this.pointLightOrb03.material.color.g += 0.01;
      this.pointLightOrb03.material.color.b += 0.01;

      this.textMaterial.color.r -= 0.025
      this.textMaterial.color.g += 0.025
      this.textMaterial.color.b += 0.025
    }

    if((this.textMesh03.hovered === true || (this.mobile && this.camera.rotation.y > 0.15)) && (this.textMaterial03.color.r > 0.35 || this.textMaterial03.color.g > 0.75 || this.textMaterial03.color.b < 1)) {
      this.pointLight02.color.r -= 0.02;
      this.pointLight02.color.g -= 0.01;
      this.pointLight02.color.b -= 0.0;
      this.pointLight03.color.r -= 0.02;
      this.pointLight03.color.g -= 0.01;
      this.pointLight03.color.b -= 0.0;
      this.pointLightOrb02.material.color.r -= 0.02;
      this.pointLightOrb02.material.color.g -= 0.005;
      this.pointLightOrb02.material.color.b -= 0.0;
      this.pointLightOrb03.material.color.r -= 0.02;
      this.pointLightOrb03.material.color.g -= 0.005;
      this.pointLightOrb03.material.color.b -= 0.0;

      this.textMaterial03.color.r -= 0.025
      this.textMaterial03.color.g -= 0.005
      this.textMaterial03.color.b += 0.015
    } else if((this.textMesh03.hovered === false || (this.mobile && this.camera.rotation.y === 0.15)) && (this.textMaterial03.color.r < 0.73 || this.textMaterial03.color.g < 0.73 || this.textMaterial03.color.b > 0.73)) {
      this.pointLight02.color.r += 0.02;
      this.pointLight02.color.g += 0.01;
      this.pointLight02.color.b += 0.0;
      this.pointLight03.color.r += 0.02;
      this.pointLight03.color.g += 0.01;
      this.pointLight03.color.b += 0.0;
      this.pointLightOrb02.material.color.r += 0.02;
      this.pointLightOrb02.material.color.g += 0.005;
      this.pointLightOrb02.material.color.b += 0.0;
      this.pointLightOrb03.material.color.r += 0.02;
      this.pointLightOrb03.material.color.g += 0.005;
      this.pointLightOrb03.material.color.b += 0.0;

      this.textMaterial03.color.r += 0.025
      this.textMaterial03.color.g += 0.005
      this.textMaterial03.color.b -= 0.015
    }

    if((this.textMesh05.hovered === true || (this.mobile && (this.camera.rotation.y < 0.25 && this.camera.rotation.y > -0.25))) && (this.textMaterial05.color.r > 0.75 || this.textMaterial05.color.g < 0.93 || this.textMaterial05.color.b > 0.65)) {

      this.pointLight02.color.r -= 0.01;
      this.pointLight02.color.g -= 0.0;
      this.pointLight02.color.b -= 0.02;
      this.pointLight03.color.r -= 0.01;
      this.pointLight03.color.g -= 0.0;
      this.pointLight03.color.b -= 0.02;
      this.pointLightOrb02.material.color.r -= 0.01;
      this.pointLightOrb02.material.color.g -= 0.0;
      this.pointLightOrb02.material.color.b -= 0.02;
      this.pointLightOrb03.material.color.r -= 0.01;
      this.pointLightOrb03.material.color.g -= 0.0;
      this.pointLightOrb03.material.color.b -= 0.02;

      this.textMaterial05.color.r -= 0.000
      this.textMaterial05.color.g += 0.015
      this.textMaterial05.color.b -= 0.015

    } else if((this.textMesh05.hovered === false || (this.mobile && (this.camera.rotation.y > -0.25 && this.camera.rotation.y < -0.25))) && (this.textMaterial05.color.r < 0.73 || this.textMaterial05.color.g > 0.73 || this.textMaterial05.color.b < 0.73)) {

      this.pointLight02.color.r += 0.01;
      this.pointLight02.color.g += 0.00;
      this.pointLight02.color.b += 0.02;
      this.pointLight03.color.r += 0.01;
      this.pointLight03.color.g += 0.00;
      this.pointLight03.color.b += 0.02;
      this.pointLightOrb02.material.color.r += 0.01;
      this.pointLightOrb02.material.color.g += 0.0;
      this.pointLightOrb02.material.color.b += 0.02;
      this.pointLightOrb03.material.color.r += 0.01;
      this.pointLightOrb03.material.color.g += 0.0;
      this.pointLightOrb03.material.color.b += 0.02;

      this.textMaterial05.color.r += 0.000
      this.textMaterial05.color.g -= 0.015
      this.textMaterial05.color.b += 0.015

    }

    if((this.textMesh07.hovered === true || (this.mobile && this.camera.rotation.y < -0.15)) && (this.textMaterial07.color.r < 0.9 || this.textMaterial07.color.g > 0.45 || this.textMaterial07.color.b > 0.70)) {

      this.pointLight02.color.r -= 0.0;
      this.pointLight02.color.g -= 0.02;
      this.pointLight02.color.b -= 0.01;
      this.pointLight03.color.r -= 0.0;
      this.pointLight03.color.g -= 0.02;
      this.pointLight03.color.b -= 0.01;
      this.pointLightOrb02.material.color.r -= 0.0;
      this.pointLightOrb02.material.color.g -= 0.02;
      this.pointLightOrb02.material.color.b -= 0.01;
      this.pointLightOrb03.material.color.r -= 0.0;
      this.pointLightOrb03.material.color.g -= 0.02;
      this.pointLightOrb03.material.color.b -= 0.01;

      this.textMaterial07.color.r += 0.015
      this.textMaterial07.color.g -= 0.025
      this.textMaterial07.color.b -= 0.004

    } else if((this.textMesh07.hovered === false || (this.mobile && this.camera.rotation.y > -0.15)) && (this.textMaterial07.color.r > 0.73 || this.textMaterial07.color.g < 0.73 || this.textMaterial07.color.b < 0.73)) {

      this.pointLight02.color.r += 0.0;
      this.pointLight02.color.g += 0.02;
      this.pointLight02.color.b += 0.01;
      this.pointLight03.color.r += 0.0;
      this.pointLight03.color.g += 0.02;
      this.pointLight03.color.b += 0.01;
      this.pointLightOrb02.material.color.r += 0.0;
      this.pointLightOrb02.material.color.g += 0.02;
      this.pointLightOrb02.material.color.b += 0.01;
      this.pointLightOrb03.material.color.r += 0.0;
      this.pointLightOrb03.material.color.g += 0.02;
      this.pointLightOrb03.material.color.b += 0.01;

      this.textMaterial07.color.r -= 0.015
      this.textMaterial07.color.g += 0.025
      this.textMaterial07.color.b += 0.004

    }

    if (this.turningLeft === true && this.camera.rotation.y < this.cameraOriginalRotation + 0.330) {
      this.camera.rotation.y += 0.005;
    } else {
      this.turningLeft = false;
    }

    if (this.turningRight === true && this.camera.rotation.y > this.cameraOriginalRotation + -0.330) {
      this.camera.rotation.y += -0.005;
    } else {
      this.turningRight = false;
    }

    this.mesh.visible = false;
    this.cubeCameraTexture.position.copy(this.mesh.position);
    this.cubeCameraTexture.update(this.renderer, this.scene);
    this.mesh.visible = true;

    
    this.camera.position.y = this.player.height;

    this.composer1.render();
  }

  generateRandomNumber(min, max) {
      let highlightedNumber = Math.random() * (max - min) + min;

      return highlightedNumber;
  };

  canvasClick = () => {
    if (!this.props.mobile) {
      this.controls.lock(false);
    }
  }

  clickOnObject = (event) => {
    //console.log('test', event);
    // if (this.pointerLockedStatus) {
    //   let picked = this.pickHelper.pickCenter(this.scene, this.camera, this.mount);
    //   if (picked) {
    //     if (picked.material.wireframe === true) {
    //       picked.material.wireframe = false;
    //     }
    //     else {
    //       picked.material.wireframe = true;
    //     }
    //   }
    //   console.log(this.pickHelper.pickCenter(this.scene, this.camera, this.mount));
    // } else {
    //   let picked = this.pickHelper.pick(event, this.scene, this.camera, this.mount);
    //   if (picked) {
    //     if (picked.material.wireframe === true) {
    //       picked.material.wireframe = false;
    //     }
    //     else {
    //       picked.material.wireframe = true;
    //     }
    //   }
    //   console.log(this.pickHelper.pick(event, this.scene, this.camera, this.mount));
    // }
  }

  mouseMoveSelection = (event) => {
    if (this.pointerLockedStatus) {
    } else {
      let picked = this.pickHelper.pick(event, this.scene, this.camera, this.mount);

      if (picked === this.textContainerLogo && picked !== false) {
        this.textMesh.hovered = true;
      }
      else {
        this.textMesh.hovered = false;
      }

      if (picked === this.textContainerAbout && picked !== false) {
        this.textMesh03.hovered = true;
      }
      else {
        this.textMesh03.hovered = false;
      }

      if (picked === this.textContainerPortfolio && picked !== false) {
        this.textMesh05.hovered = true;
      }
      else {
        this.textMesh05.hovered = false;
      }

      if (picked === this.textContainerContact && picked !== false) {
        this.textMesh07.hovered = true;
      }
      else {
        this.textMesh07.hovered = false;
      }
      
      if (picked && picked !== this.water) {
        this.mount.style.cursor = "pointer";
      } else {
        this.mount.style.cursor = "auto";
      }
    }
  }
  
  keyDown = (event) => {
    this.keyboard[event.keyCode] = true;
  }
  
  keyUp = (event) => {
    this.keyboard[event.keyCode] = false;
  }

  pointerLocked = () => {
    if (!this.props.mobile) {
      this.pointerLockedStatus = !this.pointerLockedStatus;
      this.setState(this.props.onTrueFalse(this.payload));
      console.log(this.pointerLockedStatus, this.props.cross);
    }
  }

  onWindowResize = () => {
    //console.log(this.mount.clientWidth, this.mount.clientHeight);
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    this.composer1.setSize(this.mount.clientWidth, this.mount.clientHeight);
    //this.pixelRatio = this.renderer.getPixelRatio();
    //this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.mount.offsetWidth * this.pixelRatio );
    //this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.mount.offsetHeight * this.pixelRatio );
  }

  turnRight = () => {
    if (this.turningRight === false && this.turningLeft === false) {
      this.turningRight = true;
      this.cameraOriginalRotation = this.camera.rotation.y;
      console.log(this.turningRight);
    }
  }

  turnLeft = () => {
    if (this.turningLeft === false && this.turningRight === false) {
      this.turningLeft = true;
      this.cameraOriginalRotation = this.camera.rotation.y;
    }
  }

  render = () => {
    return (
      <div className="page-container">
        <div className="github-icon">
          <a href="https://www.github.com/jasontbyrd" target="_blank" rel="noopener noreferrer">
            <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="svg-inline--fa fa-github fa-w-16 fa-7x"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" className=""></path></svg>
          </a>
        </div>
        <div className="linked-icon">
          <a href="https://www.linkedin.com/in/jason-byrd/" target="_blank" rel="noopener noreferrer">
            <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="svg-inline--fa fa-linkedin-in fa-w-14 fa-9x"><path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" className=""></path></svg>
          </a>
        </div>
        <div className="pickableCanvas" ref={ref => (this.mount = ref)} onClick={e => this.canvasClick(e)}>
          {this.props.mobile &&
            <div className="right-arrow" onClick={this.turnRight}>
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-alt-circle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-arrow-alt-circle-right fa-w-16 fa-9x"><path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256zm72 20v-40c0-6.6 5.4-12 12-12h116v-67c0-10.7 12.9-16 20.5-8.5l99 99c4.7 4.7 4.7 12.3 0 17l-99 99c-7.6 7.6-20.5 2.2-20.5-8.5v-67H140c-6.6 0-12-5.4-12-12z" className=""></path></svg>
            </div>
          }
          {this.props.cross &&
            <div className="cross-hair"></div>
          }
          {this.props.mobile &&
            <div className="left-arrow" onClick={this.turnLeft}>
              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-alt-circle-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-arrow-alt-circle-left fa-w-16 fa-9x"><path fill="currentColor" d="M8 256c0 137 111 248 248 248s248-111 248-248S393 8 256 8 8 119 8 256zm448 0c0 110.5-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56s200 89.5 200 200zm-72-20v40c0 6.6-5.4 12-12 12H256v67c0 10.7-12.9 16-20.5 8.5l-99-99c-4.7-4.7-4.7-12.3 0-17l99-99c7.6-7.6 20.5-2.2 20.5 8.5v67h116c6.6 0 12 5.4 12 12z" className=""></path></svg>
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    cross: state.crossHair,
    mobile: state.mobile,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrueFalse: (payload) => {
      dispatch({type: actionTypes.TRUE_FALSE, payload: payload});
    },
    onMobile: (payload) => {
      dispatch({type: actionTypes.MOBILE, payload: payload});
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasComponent);