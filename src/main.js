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

const vertex_shader = `
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragment_shader = `
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform vec3 u_color;
uniform float u_time;
void main(){

  // vec3 color = vec3((sin(u_time) + 1.0) / 2.0, 0.0 , (cos(u_time) + 1.0) / 2.0);

  vec2 uv = gl_FragCoord.xy/u_resolution;
  vec3 color = mix(vec3(1.0,0.0,0.0), vec3(0.0,0.0,1.0), uv.y);
  gl_FragColor = vec4(color, 1.0); 
}
`;

// #Object
const uniforms = {
  u_time: { value: 0.0 },
  u_mouse: { value: { x: 0.0, y: 0.0 } },
  u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
  u_color: { value: new THREE.Color(0xffaf00) },
};

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertex_shader,
  fragmentShader: fragment_shader,
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

const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener('resize', () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // update renderer
  renderer.setSize(sizes.width, sizes.height);

  // update pixel ratio for multiple monitor users
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // uniform resolution update
  if (uniforms.u_resolution !== undefined) {
    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;
  }
});



// full screen
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1.35;

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// #Orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;



// -----------------------------------------

// #Animations
// gsap.to(mesh.position, { x: 2, duration: 2 })
// gsap.to(mesh.position, { x: 0, duration: 2, delay: 3 })

// #Cursor
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5; // => fix value between -0.5 & 0.5
  cursor.y = event.clientY / sizes.height - 0.5; // => fix value between -0.5 & 0.5
  // updating uniforms
  uniforms.u_mouse.value.x = event.clientX
  uniforms.u_mouse.value.y = event.clientY
});
window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0]; // Get the first touch point
  uniforms.u_mouse.value.x = touch.clientX;
  uniforms.u_mouse.value.y = touch.clientY;
});

// time
let time = Date.now();
const clock = new THREE.Clock({autoStart: true})

const tick = () => {
  // get delta time
  const current_time = Date.now();
  const delta_time = current_time - time;
  time = current_time;
  uniforms.u_time.value = clock.getElapsedTime()

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
