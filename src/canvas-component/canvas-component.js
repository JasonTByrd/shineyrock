import React, { Component } from "react";
import './canvas-component.css';
import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import PickHelper from "pick-helper"


class CanvasComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      crossHair: false,
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
    this.camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
    
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshBasicMaterial({color:0xff4444, wireframe:this.useWireframe})
    );
    this.mesh.position.y += 1; // Move the mesh up 1 meter
    this.scene.add(this.mesh);
    
    this.meshFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(10,10, 10,10),
      new THREE.MeshBasicMaterial({color:0xffffff, wireframe:this.useWireframe})
    );
    this.meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    this.scene.add(this.meshFloor);
    
    this.camera.position.set(0, this.player.height, -5);
    this.camera.lookAt(new THREE.Vector3(0,this.player.height,0));
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(this.renderer.domElement);

    this.controls = new PointerLockControls(this.camera);

    this.pickHelper = new PickHelper(this.scene, this.camera);
    console.log(this.scene, this.pickHelper.scene)

    window.addEventListener('click', this.clickOnObject);

    document.addEventListener('pointerlockchange', this.pointerLocked);

    this.onWindowResize();
    
    this.animate();
  }

  animate = () => {

    requestAnimationFrame(this.animate);
	
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

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
    this.setState({crossHair: !this.state.crossHair});
    console.log(this.pointerLockedStatus, this.state.crossHair);
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
          {this.state.crossHair &&
            <div className="cross-hair"></div>
          }
        </div>
      </div>
    )
  }
}

export default CanvasComponent;