import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// #Guide
// creating a scene requires four elements
// 1. Scene   2. Objects   3. Camera   4. Renderer
// -----------------------------------------

// #Scene
const scene = new THREE.Scene();
// -----------------------------------------

// #Object
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 'yellow',
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
// mesh.position.normalize() => camera and obj distance = 1

// #Scale
// mesh.scale.set(2, 0.75, 0.25)

// #Rotation
// mesh.rotation.reorder('YXZ'); which side rotates first - use before changing the rotation
// mesh.rotation.set(1,2,3) // Euler - not vec3

// #Group
// const group = new THREE.Group()
// scene.add(group)
// group.add(obj1)

scene.add(mesh);
// -----------------------------------------

// #Camera
// 1. array => multiple render of the scene
// 2. stereo => vr like effect
// 3. cube => do 6 renders 
// 4. orthographic => render scene without perspective (left, right, top, buttom, near, far ) * multiply left and right with aspect ratio 
// 5. perspective => natural camera with perspective (fov, aspect ratio, near, far)



const sizes = { width: 600, height: 800 };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 5;


// *camera methods
// camera.position.set()
// camera.lookAt(mesh.position) // can accept object.position or vec3

scene.add(camera);
// -----------------------------------------

// #Renderer
const canvas = document.createElement('canvas');
canvas.classList.add('webgl');
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// #Orbit controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



let time = Date.now();

// -----------------------------------------

// #Animations
// gsap.to(mesh.position, { x: 2, duration: 2 })
// gsap.to(mesh.position, { x: 0, duration: 2, delay: 3 })

// #Cursor 
const cursor = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5 // => fix value between -0.5 & 0.5
  cursor.y = event.clientY / sizes.height - 0.5 // => fix value between -0.5 & 0.5
  console.log(event.clientX, event.clientY)
})

const tick = () => {
  // get delta time
  const current_time = Date.now();
  const delta_time = current_time - time;
  time = current_time;

  // camera looks at the obj
  // camera.position.x = cursor.x * -5
  // camera.position.y = cursor.y * 5
  // camera.lookAt(mesh.position)

  // mesh.rotation.y += 0.001 * delta_time;

  // update orbit control damping
  controls.update();

  // render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
// -----------------------------------------


