import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import RAPIER from "@dimforge/rapier3d-compat";
import GUI from "lil-gui";
import { createBox } from "./box";
import { createFlor } from "./floor";

RAPIER.init().then(() => {
  const arrayOfBoxes: Array<{
    cubeRigidBody: RAPIER.RigidBody;
    mesh: THREE.Mesh<
      THREE.BoxGeometry,
      THREE.MeshStandardMaterial,
      THREE.Object3DEventMap
    >;
  }> = [];
  const gravity = { x: 0, y: -9.81, z: 0 };
  const world = new RAPIER.World(gravity);

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

  const numberOfBoxes = 400;
  for (let index = 1; index < numberOfBoxes; index++) {
    const coefficient = Math.ceil(index / 20) * 4;

    const x = coefficient - 5;
    const y = 1;
    const z = (index % 20) - 5;

    const box = createBox({ x, y, z, world, arrayOfBoxes });
    scene.add(box);

    // Rounding logic
    if (index % 40 === 0) {
      const newZ = z + 20;

      // TODO: connect it with physics world
      box.rotateY(Math.PI / 3);
      box.position.x = x + 0.5;
      box.position.z = newZ;

      const firstAdditionalBox = createBox({
        x: x + 2,
        y,
        z: newZ,
        world,
        arrayOfBoxes,
      });
      // TODO: connect it with physics world
      firstAdditionalBox.rotateY(Math.PI / 2);
      scene.add(firstAdditionalBox);

      const secondAdditionalBox = createBox({
        x: x + 3.5,
        y,
        z: newZ,
        world,
        arrayOfBoxes,
      });
      // TODO: connect it with physics world
      secondAdditionalBox.rotateY(-Math.PI / 3);
      scene.add(secondAdditionalBox);

      continue;
    }

    if (!(index / coefficient === 5)) {
      continue;
    }

    if ((index / 20) % 2 !== 0) {
      // TODO: connect it with physics world
      box.rotateY(-Math.PI / 3);
      box.position.x = x + 0.5;

      const firstAdditionalBox = createBox({
        x: x + 2,
        y,
        z,
        world,
        arrayOfBoxes,
      });
      // TODO: connect it with physics world
      firstAdditionalBox.rotateY(Math.PI / 2);
      scene.add(firstAdditionalBox);

      const secondAdditionalBox = createBox({
        x: x + 3.5,
        y,
        z,
        world,
        arrayOfBoxes,
      });
      // TODO: connect it with physics world
      secondAdditionalBox.rotateY(Math.PI / 3);
      scene.add(secondAdditionalBox);
    }
  }

  const floor = createFlor(world);
  scene.add(floor);

  const clock = new THREE.Clock();
  let oldElapseTime = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapseTime;
    oldElapseTime = elapsedTime;

    world.step();

    arrayOfBoxes.forEach(({ cubeRigidBody, mesh }) => {
      const position = cubeRigidBody.translation();
      mesh.position.set(position.x, position.y, position.z);

      const rotation = cubeRigidBody.rotation();
      mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    });

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

  const gui = new GUI();
  const debugObject = {
    start: () => {
      const impulse = { x: 0, y: 0, z: -2 };
      arrayOfBoxes[18].cubeRigidBody.addForce(impulse, true);
    },
  };

  gui.add(debugObject, "start");
});
