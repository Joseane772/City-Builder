import * as THREE from 'three'

const gemoetry = new THREE.BoxGeometry(1, 1, 1);

const assets = {
    'ground': (x,y) => {
        const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
        const cube = new THREE.Mesh(gemoetry, material);
        cube.userData = { id: 'ground', x, y};
        cube.position.set(x, -0.5, y);
        cube.recevieShadow = true;
        return cube;
    },
    'residential': (x,y,data) => {
        const building = new THREE.Mesh(
            gemoetry,
            new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        );
        building.userData = { id: 'residential', x, y};
        building.scale.set(1, data.height, 1);
        building.position.set(x, data.height/2, y);
        building.castShadow = true;
        building.receiveShadow = true;
        return building;
    },
    'comercial': (x,y,data) => {
        const building = new THREE.Mesh(
            gemoetry,
            new THREE.MeshLambertMaterial({ color: 0x0000ff })
        );
        building.userData = { id: 'comercial', x, y};
        building.scale.set(1, data.height, 1);
        building.position.set(x, data.height/2, y);
        return building;
    },
    'industrial': (x,y,data) => {
        const building = new THREE.Mesh(
            gemoetry,
            new THREE.MeshLambertMaterial({ color: 0xffff00 })
        );
        building.userData = { id: 'industrial', x, y};
        building.scale.set(1, data.height, 1);
        building.position.set(x, data.height/2, y);
        return building;
    },
    'road': (x,y) => {
        const building = new THREE.Mesh(
            gemoetry,
            new THREE.MeshLambertMaterial({ color: 0x444440 })
        );
        building.userData = { id: 'road', x, y};
        building.scale.set(1, 0.1, 1);
        building.position.set(x, 0.1/2, y);
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