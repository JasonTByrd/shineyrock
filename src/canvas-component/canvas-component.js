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
import droidSans from '../assets/fonts/droid/droid_sans_bold.typeface.json'
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
  textContainerLogoGeo;
  textContainerLogoMat;
  textContainerLogo;

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
      new THREE.SphereGeometry(0.55, 25, 25),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe:this.useWireframe, fog: false})
    );
    this.pointLightGroup02 = new THREE.Group();
    this.pointLightGroup02.add(this.pointLightOrb02);
    this.pointLightGroup02.add(this.pointLight02);
    this.pointLightGroup02.position.set(7, 1, -5);
    this.scene.add(this.pointLightGroup02)


    this.pointLight03 = new THREE.PointLight(0xffffff, 0.55);
    this.pointLightOrb03 = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 25, 25),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe:this.useWireframe, fog: false})
    );
    this.pointLightGroup03 = new THREE.Group();
    this.pointLightGroup03.add(this.pointLightOrb03);
    this.pointLightGroup03.add(this.pointLight03);
    this.pointLightGroup03.position.set(-7, 1, -5);
    this.scene.add(this.pointLightGroup03)

    //Lights

    //water

    this.waterGeometry = new THREE.PlaneBufferGeometry( 1000, 1000 );

    //water

    //fontLoader
    this.textContainerLogoGeo = new THREE.BoxGeometry(20, 3, 1);
    this.textContainerLogoMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.01});
    this.textContainerLogo = new THREE.Mesh(this.textContainerLogoGeo, this.textContainerLogoMat);
    this.textContainerLogo.position.set(0, 5.5, -15);
    this.scene.add(this.textContainerLogo);

    this.threeFont = new THREE.Font(droidSans);
    this.textMaterial = new THREE.MeshPhongMaterial({color: 0xBBBBBB});
    this.textGeometry = new THREE.TextGeometry("ShineyRock.org", {
        font: this.threeFont,
        size: 2,
        height: 0.05
    });
    this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial);
    this.textMesh.position.y += 5;
    this.textMesh.position.x -= 10.25;
    this.textMesh.position.z -= 15;
    this.textMesh.castShadow = true;
    this.scene.add(this.textMesh);

    this.textMaterial02 = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.textGeometry02 = new THREE.TextGeometry("ShineyRock.org", {
        font: this.threeFont,
        size: 2.01,
        height: 0.01
    });
    this.textMesh02 = new THREE.Mesh(this.textGeometry02, this.textMaterial02);
    this.textMesh02.position.y += 4.95;
    this.textMesh02.position.x -= 10.30;
    this.textMesh02.position.z -= 14.98;
    this.textMesh02.castShadow = true;
    this.scene.add(this.textMesh02);

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
    
    if(window.innerWidth > 800) {
      this.camera.position.set(0, this.player.height, 5);
    }
    else {
      this.camera.position.set(0, this.player.height, 25);
    }
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
        textureWidth: 1024,
        textureHeight: 1024,
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

    this.pointLightGroup02.position.y = Math.sin( time ) * 0.1 + 1;
    this.pointLightGroup03.position.y = Math.sin( time ) * -0.1 + 1;
	
    // this.backgroundOrb.rotation.x += 0.0001;
    this.backgroundOrb.rotation.y += 0.0002;
    // this.backgroundOrb.rotation.z += 0.0002;

    if (this.pointerLockedStatus) {
      let picked = this.pickHelper.pickCenter(this.scene, this.camera, this.mount);

      if (picked === this.textContainerLogo && picked !== false) {
        this.textMesh.hovered = true;
        this.mount.style.cursor = "pointer";
      }
      else {
        this.textMesh.hovered = false;
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
      this.textMaterial.color.r += 0.025
      this.textMaterial.color.g -= 0.025
      this.textMaterial.color.b -= 0.025
    } else if(this.textMesh.hovered === false && (this.textMaterial.color.r > 0.73 || this.textMaterial.color.g < 0.73 || this.textMaterial.color.b < 0.73)) {
      this.textMaterial.color.r -= 0.025
      this.textMaterial.color.g += 0.025
      this.textMaterial.color.b += 0.025
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
    this.controls.lock(false);
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
        this.mount.style.cursor = "pointer";
      }
      else {
        this.textMesh.hovered = false;
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
    this.pointerLockedStatus = !this.pointerLockedStatus;
    this.setState(this.props.onTrueFalse(this.payload));
    console.log(this.pointerLockedStatus, this.props.cross);
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

  render = () => {
    return (
      <div className="page-container">
        <div className="pickableCanvas" ref={ref => (this.mount = ref)} onClick={e => this.canvasClick(e)}>
          {this.props.cross &&
            <div className="cross-hair"></div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    cross: state.crossHair
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTrueFalse: (payload) => {
      dispatch({type: actionTypes.TRUE_FALSE, payload: payload});
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasComponent);