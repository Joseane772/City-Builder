import Scene from "./Scene.js";
import Ground from "./Ground.js";
import * as THREE from 'three';


export default class Simulation {
  constructor(canvasId) {
    this.scene = undefined;
    this.ground = undefined;
    this.canvasId = canvasId;

    // NOTE: Ray caster and mouse for interaction
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();


    // NOTE: Initialize the simulation.
    this.init();
  }

  init() {
    this.scene = new Scene(this.canvasId);
    this.scene.init();
    this.ground = new Ground(this.scene.scene, 16, 0, 5);
    this.scene.add(this.ground);
    // NOTE: Event listeners
    window.addEventListener('mousemove', this.onMouseMove, false);
    
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  checkIntersections() {
    this.raycaster.setFromCamera(this.mouse, this.scene.camera);
    const intersects = this.raycaster.intersectObjects(this.ground.cubes);

    this.ground.cubes.forEach(cube => {
        cube.material.color.set(0x00ff00);
    });

    for (let intersect of intersects) {
        intersect.object.material.color.set(0xff0000);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.checkIntersections();
    this.scene.renderer.render(this.scene.scene, this.scene.camera);
  }

}