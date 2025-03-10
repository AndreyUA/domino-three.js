import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import RAPIER from "@dimforge/rapier3d-compat";
import GUI from "lil-gui";
import { createBox } from "./box";
import { createFlor } from "./floor";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-8, 10, -6);
scene.add(camera);
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const gui = new GUI();

const numberOfBoxes = 400;
for (let index = 1; index < numberOfBoxes; index++) {
  const coefficient = Math.ceil(index / 20) * 4;

  const x = coefficient - 5;
  const y = 1;
  const z = (index % 20) - 5;

  const box = createBox({ x, y, z });
  scene.add(box);

  // Rounding logic
  if (index % 40 === 0) {
    const newZ = z + 20;

    box.rotateY(Math.PI / 3);
    box.position.x = x + 0.5;
    box.position.z = newZ;

    const firstAdditionalBox = createBox({ x: x + 2, y, z: newZ });
    firstAdditionalBox.rotateY(Math.PI / 2);
    scene.add(firstAdditionalBox);

    const secondAdditionalBox = createBox({ x: x + 3.5, y, z: newZ });
    secondAdditionalBox.rotateY(-Math.PI / 3);
    scene.add(secondAdditionalBox);

    continue;
  }

  if (!(index / coefficient === 5)) {
    continue;
  }

  if ((index / 20) % 2 !== 0) {
    box.rotateY(-Math.PI / 3);
    box.position.x = x + 0.5;

    const firstAdditionalBox = createBox({ x: x + 2, y, z });
    firstAdditionalBox.rotateY(Math.PI / 2);
    scene.add(firstAdditionalBox);

    const secondAdditionalBox = createBox({ x: x + 3.5, y, z });
    secondAdditionalBox.rotateY(Math.PI / 3);
    scene.add(secondAdditionalBox);
  }
}

const floor = createFlor();
scene.add(floor);

const clock = new THREE.Clock();
let oldElapseTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapseTime;
  oldElapseTime = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// TODO: here is a code generated by Copilot that I can use as a reference:
/*

import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

RAPIER.init().then(() => {
  const gravity = { x: 0, y: -9.81, z: 0 };
  const world = new RAPIER.World(gravity);

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(0, 5, 10);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const floorGeometry = new THREE.BoxGeometry(10, 1, 10);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  scene.add(floor);

  const floorBody = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0);
  const floorCollider = RAPIER.ColliderDesc.cuboid(5, 0.5, 5);
  const floorRigidBody = world.createRigidBody(floorBody);
  world.createCollider(floorCollider, floorRigidBody);

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 5, 0);
  scene.add(cube);

  const cubeBody = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0);
  const cubeCollider = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setRestitution(0.8); // Set restitution for bouncing
  const cubeRigidBody = world.createRigidBody(cubeBody);
  world.createCollider(cubeCollider, cubeRigidBody);

  // Apply an impulse to the cube
  const impulse = { x: 10, y: 0, z: 0 }; // Change these values to apply force in different directions
  cubeRigidBody.applyImpulse(impulse, true);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const clock = new THREE.Clock();
  const tick = () => {
    world.step();

    const position = cubeRigidBody.translation();
    cube.position.set(position.x, position.y, position.z);

    const rotation = cubeRigidBody.rotation();
    cube.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
});

*/
