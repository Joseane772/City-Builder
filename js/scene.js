import * as THREE from 'three'
import { createCamera } from './camera.js';
import { createAssetsInstance } from './assets/assets.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createScene() {
  
  const gameWindow = document.getElementById("render-target");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);

  const camera = createCamera(gameWindow);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.clientWidth, gameWindow.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  gameWindow.appendChild(renderer.domElement);

  


  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject = undefined;

  let ground = [];
  let buildings = [];

  let onObjectSelected = undefined;

  function initialize(city){
    scene.clear();
    ground = [];
    buildings = [];
    for (let x = 0; x < city.size; x++) {
      const colunm =[];
      for (let y = 0; y < city.size; y++) {
        const tile = city.data[x][y];
        const terrain = city.data[x][y].terrain;
        const cube = createAssetsInstance(terrain, tile.x, tile.y);
        colunm.push(cube);
        scene.add(cube);
      }
      ground.push(colunm);
      buildings.push([...Array(city.size)]);
    }

    setupLights();

    // add a house to the scene
    
    const loader = new GLTFLoader();
    loader.load('/js/assets/Voxel_Buildings/dist/obj/2.glb', (gltf) => {
      const object = gltf.scene;
      object.scale.set(0.1, 0.1, 0.1);
      object.position.set(2, 0, 2);
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({color: 0x999999});
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(object);
    
    }, undefined, function (error) {
      console.error(error);
    });
  }

  function update(city) {
    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
      const tile = city.data[x][y];
      const currentBuilding = buildings[x][y];

        // if the player removes a building remove it from the scene
        if (!tile.building && currentBuilding) {
          scene.remove(currentBuilding);
          buildings[x][y] = undefined;
        }

        // if the data model has chagend update the mesh
        if (tile.building && tile.building.updated) {
          scene.remove(currentBuilding);
          buildings[x][y] = createAssetsInstance(tile.building.id, x, y, tile.building);
          scene.add(buildings[x][y]);
          tile.building.updated = false;
        }
      }
    }
  }

  function setupLights() {
    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(20, 15, 20);
    sun.castShadow = true;
    sun.shadow.camera.left = -100;
    sun.shadow.camera.right = 100;
    sun.shadow.camera.top = 100;
    sun.shadow.camera.bottom = -100;
    sun.shadow.mapSize.width = 4069;
    sun.shadow.mapSize.height = 4069;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffffff,0.4));
    //const helper = new THREE.CameraHelper( sun.shadow.camera );
    //scene.add( helper );
  }

  // fog
  function setupFog() {
    scene.fog = new THREE.Fog(0x333333, 0.0, 150);
    
  }

  function draw() {
    renderer.render(scene, camera.camera);
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  function onMouseDown(event) {
    camera.onMouseDown(event);

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.camera);

    let intersetions = raycaster.intersectObjects(scene.children, false);

    if (intersetions.length > 0) {
      if (selectedObject) {
        selectedObject.material.emissive.setHex(0x000000);
      }
      selectedObject = intersetions[0].object;
      selectedObject.material.emissive.setHex(0x999999);
      //console.log(selectedObject.userData);

      if (this.onObjectSelected) {
        this.onObjectSelected(selectedObject);
      }
    }
  }

  function onMouseUp(event) {
    camera.onMouseUp(event);
  }

  function onMouseMove(event) {
    camera.onMouseMove(event);


    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.camera);

    let intersetions = raycaster.intersectObjects(scene.children, false);

    // if the mouse is over an object make it glow
    if (intersetions.length > 0) {
      if (selectedObject) {
        selectedObject.material.emissive.setHex(0x000000);
      }
      selectedObject = intersetions[0].object;
      selectedObject.material.emissive.setHex(0x555555);
    } else {
      if (selectedObject) {
        selectedObject.material.emissive.setHex(0x000000);
      }
      selectedObject = undefined;
    }

  }

  function resize() {
    camera.onResize(gameWindow);
    renderer.setSize(gameWindow.clientWidth, gameWindow.clientHeight);
  }


  return {
    onObjectSelected,
    initialize,
    update,
    start,
    stop,
    resize,
    onMouseDown,
    onMouseUp,
    onMouseMove
  }
}