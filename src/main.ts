import "./style.css";

import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import GUI from "lil-gui";

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
camera.position.set(3, 3, 3);
scene.add(camera);
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const gui = new GUI();

const clock = new THREE.Clock();
let oldElapseTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapseTime;
  oldElapseTime = elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
