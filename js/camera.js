import * as THREE from 'three'

export function createCamera(gameWindow) {

    // Constants
    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;

    const MIN_CAMERA_RADIUS = 5;
    const MAX_CAMERA_RADIUS = 25;

    const MIN_ELEVATION = 10;
    const MAX_ELEVATION = 90;

    const ROTATION_SENSITIVITY = 0.25;
    const ZOOM_SENSITIVITY = 0.025;
    const PAN_SENSITIVITY = -0.01;

    const DGETORAD = Math.PI / 180;

    const Y_AXIS = new THREE.Vector3(0, 1, 0);

    const camera = new THREE.PerspectiveCamera(75, gameWindow.clientWidth / gameWindow.clientHeight, 0.1, 1000);
    let cameraOrigin = new THREE.Vector3(0, 0, 0);
    let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
    let cameraAzimuth = 136;
    let cameraElevation = 45;
    let isLeftMouseDown = false;
    let isRightMouseDown = false;
    let isMiddleMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    updateCameraPosition();
    
    function onMouseDown(event) {
        
        if (event.button === LEFT_MOUSE_BUTTON) {
            //console.log('left mouse down');
            isLeftMouseDown = true;
        }
        if (event.button === RIGHT_MOUSE_BUTTON) {
            //console.log('right mouse down');
            isRightMouseDown = true;
        }
        if (event.button === MIDDLE_MOUSE_BUTTON) {
            //console.log('middle mouse down');
            isMiddleMouseDown = true;
        }
    }
    
    function onMouseUp(event) {
        if (event.button === LEFT_MOUSE_BUTTON) {
            //console.log('left mouse up');
            isLeftMouseDown = false;
        }
        if (event.button === RIGHT_MOUSE_BUTTON) {
            //console.log('right mouse up');
            isRightMouseDown = false;
        }
        if (event.button === MIDDLE_MOUSE_BUTTON) {
            //console.log('middle mouse up');
            isMiddleMouseDown = false;
        }
    }
    
    function onMouseMove(event) {
        //console.log('mouse move');
    
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;

        // rotation
        if (isLeftMouseDown) {
            cameraAzimuth += -(deltaX) * ROTATION_SENSITIVITY;
            cameraElevation += (deltaY) * ROTATION_SENSITIVITY;
            cameraElevation = Math.min(MAX_ELEVATION, Math.max(MIN_ELEVATION, cameraElevation));
            updateCameraPosition();
        }
    
        // zoom
        if (isRightMouseDown) {
            cameraRadius += (deltaY) * ZOOM_SENSITIVITY;
            cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
            updateCameraPosition();
        }

        // pan
        if (isMiddleMouseDown) {
            const foward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DGETORAD);
            const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DGETORAD);

            cameraOrigin.add(foward.multiplyScalar(deltaY * PAN_SENSITIVITY));
            cameraOrigin.add(left.multiplyScalar(deltaX * PAN_SENSITIVITY));

            updateCameraPosition();

        }
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
    
    function updateCameraPosition() {
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DGETORAD) * Math.cos(cameraElevation * DGETORAD);
        camera.position.y = cameraRadius * Math.sin(cameraElevation * DGETORAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DGETORAD) * Math.cos(cameraElevation * DGETORAD);
        camera.position.add(cameraOrigin);
        camera.lookAt(cameraOrigin);
        camera.updateMatrix();
    }

    function onResize() {
        camera.aspect = gameWindow.clientWidth / gameWindow.clientHeight;
        camera.updateProjectionMatrix();
    }

    return {
        camera,
        onMouseDown,
        onMouseUp,
        onResize,
        onMouseMove
    };
}