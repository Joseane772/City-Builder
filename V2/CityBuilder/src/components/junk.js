// Listen for mouse move events
document.addEventListener('mousemove', onMouseMove, false);

// Function to update the mouse variable with normalized position
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Function to check for cube intersections
function checkIntersections() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubes);

    cubes.forEach(cube => {
        // Reset color if not intersected
        cube.material.color.set(0x00ff00);
    });

    for (let intersect of intersects) {
        // Change color of the intersected cube
        intersect.object.material.color.set(0xff0000);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    checkIntersections(); // Check for and handle intersections in each frame
    renderer.render(scene, camera);
}

animate();