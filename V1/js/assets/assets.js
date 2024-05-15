import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gemoetry = new THREE.BoxGeometry(1, 1, 1);
let loader = new THREE.TextureLoader();
const objLoader = new GLTFLoader();

function loadTexture(url) {
    const tex = loader.load(url)
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1,1);
    return tex; 

}

const textures = {
    'grass': loadTexture('/js/assets/Textures/grass.jpg')
}


const assets = {
    'ground': (x,y) => {
        const cube = new THREE.Mesh(
            gemoetry,
            new THREE.MeshPhongMaterial({map: textures.grass})
        );
        cube.userData = { id: 'ground', x, y};
        cube.position.set(x, -0.5, y);
        cube.receiveShadow = true;
        return cube;
    },
    'residential': (x,y,data) => {

        objLoader.load('/js/assets/Voxel_Buildings/dist/obj/1.glb', (gltf) => {
            const building = gltf.scene;
            
            building.userData = { id: 'residential', x, y}
            building.scale.set(0.1, 0.1, 0.1);
            building.position.set(x, 0, y);
            building.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ color: 0x999999 });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            console.log(building);
            return building;
        });        
    },
    'comercial': (x,y,data) => {
        const building = new THREE.Mesh(
            gemoetry,
            new THREE.MeshPhongMaterial({ color: 0x0000ff })
        );
        building.userData = { id: 'comercial', x, y};
        building.scale.set(1, data.height, 1);
        building.position.set(x, data.height/2, y);
        building.castShadow = true;
        building.receiveShadow = true;
        console.log(building);
        return building;
    },
    'industrial': (x,y,data) => {
        const building = new THREE.Mesh(
            gemoetry,
            new THREE.MeshPhongMaterial({ color: 0xffff00 })
        );
        building.userData = { id: 'industrial', x, y};
        building.scale.set(1, data.height, 1);
        building.position.set(x, data.height/2, y);
        building.castShadow = true;
        building.receiveShadow = true;
        return building;
    },
    'road': (x,y) => {
        const building = new THREE.Mesh(
            gemoetry,
            new THREE.MeshPhongMaterial({ color: 0x444440 })
        );
        building.userData = { id: 'road', x, y};
        building.scale.set(1, 0.1, 1);
        building.position.set(x, 0.1/2, y);
        building.receiveShadow = true;
        return building;
    }
};

export function createAssetsInstance(assetID, x, y, data){
    if (assets[assetID]){
        return assets[assetID](x,y,data);
    } else {
        console.error(`Asset ${assetID} not found`);
        return undefined;
    }
}