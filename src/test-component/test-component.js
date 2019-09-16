import React, { Component } from "react";
import './test-component.css';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }
 
    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
    }
  }
}

class TestComponent extends Component {

  pickPosition = {x: 0, y: 0};

  mount;

  renderer;

  fov = 60;
  aspect = 2;  // the canvas default
  near = 0.1;
  far = 200;
  camera;

  color = 0xFFFFFF;
  intensity = 1;

  pickHelper;
   
  scene;
   
  light;
  // put the camera on a pole (parent it to an object)
  // so we can spin the pole to move the camera around the scene
  cameraPole;

  canvas;

  componentDidMount() {
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    this.scene = new THREE.Scene();
    this.cameraPole = new THREE.Object3D();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.appendChild( this.renderer.domElement );

    this.canvas = this.renderer.domElement;

    this.camera.position.z = 30;
    this.light = new THREE.DirectionalLight(this.color, this.intensity);
    this.camera.add(this.light);
    this.scene.background = new THREE.Color('white');
    this.scene.add(this.cameraPole);
    this.cameraPole.add(this.camera);

    this.pickHelper = new PickHelper();

    window.addEventListener( 'resize', this.onWindowResize, false );

    // window.addEventListener('mousedown', this.setPickPosition);
    // window.addEventListener('mouseup', this.clearPickPosition);
    // window.addEventListener('mouseleave', this.clearPickPosition);

    this.generateBoxes();
    this.clearPickPosition();

    this.animate();
  }

  generateBoxes = () => {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    
    function rand(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + (max - min) * Math.random();
    }
    
    function randomColor() {
      return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
    }
    
    const numObjects = 100;
    for (let i = 0; i < numObjects; ++i) {
      const material = new THREE.MeshPhongMaterial({
        color: randomColor(),
      });
    
      const cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
    
      cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
      cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
      cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
    }
  }

  animate = () => {  
    this.cameraPole.rotation.y += 0.001;
    requestAnimationFrame( this.animate );

    this.renderer.render( this.scene, this.camera );
    this.clearPickPosition();
  };

  getCanvasRelativePosition = (event) => {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
   
  setPickPosition = (event) => {
    const pos = this.getCanvasRelativePosition(event);
    this.pickPosition.x = (pos.x / this.canvas.clientWidth ) *  2 - 1;
    this.pickPosition.y = (pos.y / this.canvas.clientHeight) * -2 + 1;  // note we flip Y
  }
   
  canvasClick = (event) => {
    this.setPickPosition(event);
    this.pickHelper.pick(this.pickPosition, this.scene, this.camera, this.time);
  }

  clearPickPosition = () => {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    this.pickPosition.x = -100000;
    this.pickPosition.y = -100000;
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  render() {
    return (
      <div>
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
