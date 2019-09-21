import React, { Component } from "react";
import './test-component.css';
import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

class TestComponent extends Component {

  scene; 
  camera;
  renderer; 
  mesh;
  meshFloor;
  controls;
  mount;
  
  keyboard = new Array(100).fill(false);;
  player;

  componentDidMount() {

    console.log(this.keyboard);

    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('keyup', this.keyUp);

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
    this.renderer.setSize(1280, 720);
    this.mount.appendChild(this.renderer.domElement);

    this.controls = new PointerLockControls(this.camera);
    
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
    if(!this.controls.lock(false)) {
      this.controls.lock(false);
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
        <div ref={ref => (this.mount = ref)} onClick={e => this.canvasClick(e)}></div>

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