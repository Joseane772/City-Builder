import * as THREE from 'three';

export default class Ground {
  constructor(scene, gridSize = 10, spacing = 0, cubeSize = 1) {
    this.scene = scene;
    this.cubeSize = cubeSize;
    this.spacing = spacing;
    this.gridSize = gridSize; // 10x10 grid
    this.material = undefined;
    this.geometry = undefined;
    this.cubes = [];
    this.init()
  }

  init() {
    this.material = new THREE.MeshBasicMaterial({ color: 0x005555 });
    this.geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);


    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
          const cube = new THREE.Mesh(this.geometry, this.material);
          const wireframe = new THREE.WireframeGeometry(this.geometry);
          const line = new THREE.LineSegments(wireframe);
          line.material.depthTest = false;
          line.material.transparent = true;
          line.position.x = i * (this.cubeSize + this.spacing);
          line.position.z = j * (this.cubeSize + this.spacing);
          cube.position.x = i * (this.cubeSize + this.spacing);
          cube.position.z = j * (this.cubeSize + this.spacing);
          cube.receiveShadow = true;
          cube.castShadow = true;
          this.cubes.push(cube);
          this.scene.add(cube);
          this.scene.add(line);


      }
    }
  }

}