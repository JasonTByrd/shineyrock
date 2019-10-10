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

  //skybox
  sky;
  uniforms;
  parameters;
  cubeCamera;

  
  keyboard = new Array(100).fill(false);
  player;

  componentDidMount() {

    console.log(this.keyboard);

    window.addEventListener('mousemove', this.mouseMoveSelection);
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('resize', this.onWindowResize, false );


    this.useWireframe = false;
    this.player = { height:1.0, speed:0.08, turnSpeed:Math.PI*0.02 }
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1280/720, 1, 20000);



    this.light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    this.scene.add( this.light );

    //water

    this.waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );

    //water



    
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshBasicMaterial({color:0xff4444, wireframe:this.useWireframe})
    );
    this.mesh.position.y += 2;
    this.scene.add(this.mesh);
    
    this.meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(10,10, 10,10),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe:this.useWireframe})
    );
    this.meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    this.meshFloor.position.y += 2;
    this.scene.add(this.meshFloor);
    
    this.camera.position.set(-1, this.player.height, 5);
    this.camera.lookAt(new THREE.Vector3(0,this.player.height,0));
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(this.renderer.domElement);

    this.controls = new PointerLockControls(this.camera);

    this.pickHelper = new PickHelper(this.scene, this.camera);
    console.log(this.scene, this.pickHelper.scene)











    //water
    this.water = new Water(
      this.waterGeometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load( waternormals, function ( texture ) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        } ),
        alpha: 1.0,
        sunDirection: this.light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 1.7,
        fog: this.scene.fog !== undefined
      }
    );



    this.water.rotation.x = - Math.PI / 2;
    this.scene.add( this.water );

    //water












    //skybox





    this.sky = new Sky();
    this.uniforms = this.sky.material.uniforms;

    this.uniforms[ 'turbidity' ].value = 10;
    this.uniforms[ 'rayleigh' ].value = 2;
    this.uniforms[ 'luminance' ].value = 1;
    this.uniforms[ 'mieCoefficient' ].value = 0.010;
    this.uniforms[ 'mieDirectionalG' ].value = 0.8;

    this.parameters = {
      distance: 400,
      inclination: 0.49,
      azimuth: 0.205
    };

    this.cubeCamera = new THREE.CubeCamera( 0.1, 1, 512 );
    this.cubeCamera.renderTarget.texture.generateMipmaps = true;
    this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.scene.background = this.cubeCamera.renderTarget;


    this.updateSun();


    //skybox









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

    this.mesh.position.y = Math.sin( time ) * 1 + 0.5;
		this.mesh.rotation.x = time * 0.5;
		this.mesh.rotation.z = time * 0.51;
	
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;

    if (this.pointerLockedStatus) {
      let picked = this.pickHelper.pickCenter(this.scene, this.camera, this.mount);
      if (picked === this.mesh && picked !== false) {
        this.mesh.material.wireframe = true;
      }
      else {
        this.mesh.material.wireframe = false;
      }

      if (picked === this.meshFloor && picked !== false) {
        this.meshFloor.material.wireframe = true;
      }
      else {
        this.meshFloor.material.wireframe = false;
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
    
    this.camera.position.y = this.player.height;
    this.renderer.render(this.scene, this.camera);
  }

  canvasClick = () => {
    this.controls.lock(false);
  }

  clickOnObject = (event) => {
    //console.log('test', event);
    if (this.pointerLockedStatus) {
      let picked = this.pickHelper.pickCenter(this.scene, this.camera, this.mount);
      if (picked) {
        if (picked.material.wireframe === true) {
          picked.material.wireframe = false;
        }
        else {
          picked.material.wireframe = true;
        }
      }
      console.log(this.pickHelper.pickCenter(this.scene, this.camera, this.mount));
    } else {
      let picked = this.pickHelper.pick(event, this.scene, this.camera, this.mount);
      if (picked) {
        if (picked.material.wireframe === true) {
          picked.material.wireframe = false;
        }
        else {
          picked.material.wireframe = true;
        }
      }
      console.log(this.pickHelper.pick(event, this.scene, this.camera, this.mount));
    }
  }

  mouseMoveSelection = (event) => {
    if (this.pointerLockedStatus) {
    } else {
      let picked = this.pickHelper.pick(event, this.scene, this.camera, this.mount);
      if (picked === this.mesh && picked !== false) {
        this.mesh.material.wireframe = true;
      }
      else {
        this.mesh.material.wireframe = false;
      }

      if (picked === this.meshFloor && picked !== false) {
        this.meshFloor.material.wireframe = true;
      }
      else {
        this.meshFloor.material.wireframe = false;
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
    console.log(this.mount.clientWidth, this.mount.clientHeight);
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.mount.clientWidth, this.mount.clientHeight );
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