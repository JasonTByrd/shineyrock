import React, { Component } from "react";
import ReactDOM from "react-dom";
import './test-component.css';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';
import "threex.domevents/threex.domevents.js";



class TestComponent extends Component {


  componentDidMount() {

    var touching = false;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.appendChild( renderer.domElement );
  
    var geometry = new THREE.SphereGeometry( 555, 50, 50 );
    var material = new THREE.MeshLambertMaterial( { wireframe: true, color: 0x009900 } );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
  
    var geometry4 = new THREE.SphereGeometry( 5, 10, 10 );
    var mirrorSphereCamera = new THREE.CubeCamera( 0.1, 1000, 512 );
    scene.add( mirrorSphereCamera );
    var material4 = new THREE.MeshBasicMaterial( { wireframe: false, color: 0x000000 } );
    var sphere4 = new THREE.Mesh( geometry4, material4 );
    sphere4.position.set(0, 0, 0);
    mirrorSphereCamera.position.set(0, 0, 0);
  
    var geometry2 = new THREE.SphereGeometry( 5, 64, 64 );
    var mirrorSphereCamera2 = new THREE.CubeCamera( 0.1, 1000, 512 );
    scene.add( mirrorSphereCamera );
    var material2 = new THREE.MeshLambertMaterial( { wireframe: false, envMap: mirrorSphereCamera2.renderTarget.texture } );
    var sphere2 = new THREE.Mesh( geometry2, material2 );
    sphere2.position.x = 10;
    mirrorSphereCamera2.position.set(10, 0, 0);
    scene.add( sphere2 );
  
    var geometry3 = new THREE.SphereGeometry( 5, 64, 64 );
    var mirrorSphereCamera3 = new THREE.CubeCamera( 0.1, 1000, 512 );
    scene.add( mirrorSphereCamera );
    var material3 = new THREE.MeshLambertMaterial( { wireframe: false, envMap: mirrorSphereCamera3.renderTarget.texture } );
    var sphere3 = new THREE.Mesh( geometry3, material3 );
    sphere3.position.x = -10;
    mirrorSphereCamera3.position.set(-10, 0, 0);
    scene.add( sphere3 );
  
    var light = new THREE.AmbientLight( 0x707070 ); // soft white light
    scene.add( light );
  
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
    scene.add( directionalLight );
  
    // var loader = new THREE.FontLoader();
  
    // loader.load( `https://xfl.jp/yip5jX`, function ( font ) {
  
    // 	var geometry = new THREE.TextGeometry( 'Hello three.js!', {
    // 		font: font,
    // 		size: 80,
    // 		height: 5,
    // 		curveSegments: 12,
    // 		bevelEnabled: true,
    // 		bevelThickness: 10,
    // 		bevelSize: 8,
    // 		bevelOffset: 0,
    // 		bevelSegments: 5
    // 	} );
    // } );
  
    camera.position.z = 0.1;
  
    var domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  
    sphere3.addEventListener('mousedown', event => {
      touching = true;
    })
  
    sphere3.addEventListener('mouseout', event => {
      touching = false;
    })
  
    sphere3.addEventListener('mouseup', event => {
      if (touching === true) {
        material3.wireframe = !material3.wireframe;
        if(document.querySelector('.textbox-popup').classList.contains('clicked')) {
          document.querySelector('.textbox-popup').classList.remove('clicked');
        } else {
          document.querySelector('.textbox-popup').classList.add('clicked');
        }
      };
      touching = false;
    })
  
    sphere2.addEventListener('mousedown', event => {
      touching = true;
    })
  
    sphere2.addEventListener('mouseout', event => {
      touching = false;
    })
  
    sphere2.addEventListener('mouseup', event => {
      if (touching === true) {
        if (material2.wireframe !== false) {
          material2.wireframe = false
        }
        else {
          material2.wireframe = true
        };
        if(document.querySelector('.textbox-popup').classList.contains('clicked')) {
          document.querySelector('.textbox-popup').classList.remove('clicked');
        } else {
          document.querySelector('.textbox-popup').classList.add('clicked');
        }
      };
      touching = false;
    })
  
    sphere3.addEventListener('touchstart', event => {
      material3.wireframe = !material3.wireframe;
      if(document.querySelector('.textbox-popup').classList.contains('clicked')) {
        document.querySelector('.textbox-popup').classList.remove('clicked');
      } else {
        document.querySelector('.textbox-popup').classList.add('clicked');
      }
    });
  
    sphere2.addEventListener('touchstart', event => {
      material2.wireframe = !material2.wireframe;
      if(document.querySelector('.textbox-popup').classList.contains('clicked')) {
        document.querySelector('.textbox-popup').classList.remove('clicked');
      } else {
        document.querySelector('.textbox-popup').classList.add('clicked');
      }
    });

    var controls

    if ("ontouchstart" in document.documentElement)
    {
      controls = new DeviceOrientationControls( camera, renderer.domElement );
      controls.minDistance = 0.1;
      controls.maxDistance = 0.1;
    }
    else
    {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 0.1;
      controls.maxDistance = 0.1;
    }
  
    window.addEventListener( 'resize', onWindowResize, false );
  
    var animate = function () {
      sphere4.visible = false;
      mirrorSphereCamera.update( renderer, scene );
      sphere4.visible = true;
      
      sphere2.visible = false;
      mirrorSphereCamera2.update( renderer, scene );
      sphere2.visible = true;
      
      sphere3.visible = false;
      mirrorSphereCamera3.update( renderer, scene );
      sphere3.visible = true;
      
      requestAnimationFrame( animate );
  
      sphere.rotation.x += 0.00;
      sphere.rotation.y += 0.001;
      
      controls.update();
      renderer.render( scene, camera );
    };
  
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }
  
    animate();
      
  }
  render() {
    return (
      <div>
        <div ref={ref => (this.mount = ref)}></div>

        <div className="textbox-popup">
          <p>
          You've clicked(or touched) an orb!{"\n"} 
          Click(or touch) one again to make me go away.{"\n"}
          (Hint: Look behind you.)
          </p>
        </div>

        <script src="https://www.shineyrock.org/jslibrariestosave/three.min.js"></script>
        <script src="https://www.shineyrock.org/jslibrariestosave/threex.domevents.js"></script>
        <script src="https://www.shineyrock.org/jslibrariestosave/DeviceOrientationControls.js"></script>
        <script src="https://www.shineyrock.org/jslibrariestosave/OrbitControls.js"></script>
        <script src="https://www.shineyrock.org/js/shineyRock.js"></script>
      </div>
    )
  }
}

export default TestComponent;
