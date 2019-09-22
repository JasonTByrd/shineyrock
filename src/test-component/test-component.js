import React, { Component } from "react";
import './test-component.css';
import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';





class PickHelper {

  constructor(scene, camera) {
    this.pickPosition = {x: 0, y: 0};
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
    this.scene = scene;
    this.camera = camera;
  }

  pick(event, scene, camera, mount) {
    this.setPickPosition(event, mount);
    let normalizedPosition = this.pickPosition;
    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object;
    }
    else {
      this.pickedObject = false;
    }
    return this.pickedObject;
  }

  pickOnce(event, scene, camera, mount) {
    this.setPickPosition(event, mount);
    let normalizedPosition = this.pickPosition;
    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      if(intersectedObjects[0].object === this.pickedObject) {
        return false;
      }
      this.pickedObject = intersectedObjects[0].object;
    }
    else {
      this.pickedObject = false;
    }
    return this.pickedObject;
  }

  setPickPosition = (event, mount) => {
    const pos = this.getCanvasRelativePosition(event, mount);
    this.pickPosition.x = (pos.x / mount.clientWidth ) *  2 - 1;
    this.pickPosition.y = (pos.y / mount.clientHeight) * -2 + 1;  // note we flip Y
  }

  getCanvasRelativePosition = (event, mount) => {
    const rect = mount.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  clearPickPosition = () => {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    this.pickPosition.x = -100000;
    this.pickPosition.y = -100000;
  }

}






class TestComponent extends Component {

  scene; 
  camera;
  renderer; 
  mesh;
  meshFloor;
  controls;
  mount;
  pickHelper;
  colorFlashInteval;
  
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
    this.player = { height:1.8, speed:0.1, turnSpeed:Math.PI*0.02 }
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

    this.onWindowResize();
    
    this.animate();
  }

  animate = () => {

    requestAnimationFrame(this.animate);
	
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    
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
    
    this.renderer.render(this.scene, this.camera);
  }

  canvasClick = () => {
    //this.controls.lock(false);
  }

  clickOnObject = (event) => {
    //console.log('test', event);
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

  mouseMoveSelection = (event) => {
    let picked = this.pickHelper.pickOnce(event, this.scene, this.camera, this.mount);
    if (picked) {
      clearInterval(this.colorFlashInteval);
      this.colorFlashInteval = setInterval(() => {
        if(picked.material.wireframe === false) {
          picked.material.wireframe = true;
        } else {
          picked.material.wireframe = false;
        }
      }, 50);
    }
  }
  
  keyDown = (event) => {
    this.keyboard[event.keyCode] = true;
  }
  
  keyUp = (event) => {
    this.keyboard[event.keyCode] = false;
  }

  onWindowResize = () => {
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.mount.clientWidth, this.mount.clientHeight );
  }

  render() {
    return (
      <div className="page-container">
        <div className="pickableCanvas" ref={ref => (this.mount = ref)} onClick={e => this.canvasClick(e)}></div>

        <div className="textbox-popup">
          <p>
          You've clicked(or touched) an orb!{"\n"} 
          Click(or touch) one again to make me go away.{"\n"}
          (Hint: Look behind you.)
          </p>
        </div>
      </div>
    )
  }
}

export default TestComponent;