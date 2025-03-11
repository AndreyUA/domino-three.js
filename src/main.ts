import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import RAPIER from "@dimforge/rapier3d-compat";
import GUI from "lil-gui";
import { BoxResult, createBox } from "./box";
import { createFlor } from "./floor";

RAPIER.init().then(() => {
  const arrayOfBoxes: Array<BoxResult> = [];
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

    const box = createBox({ x, y, z, world, scene, arrayOfBoxes });

    // Rounding logic
    if (index % 40 === 0) {
      const newZ = z + 20;

      box.mesh.rotateY(Math.PI / 3);
      box.mesh.position.x = x + 0.5;
      box.mesh.position.z = newZ;
      box.rigidBody.setTranslation(
        new RAPIER.Vector3(
          box.mesh.position.x,
          box.mesh.position.y,
          box.mesh.position.z
        ),
        false
      );
      box.rigidBody.setRotation(
        new RAPIER.Quaternion(
          box.mesh.quaternion.x,
          box.mesh.quaternion.y,
          box.mesh.quaternion.z,
          box.mesh.quaternion.w
        ),
        false
      );

      const firstAdditionalBox = createBox({
        x: x + 2,
        y,
        z: newZ,
        world,
        scene,
        arrayOfBoxes,
      });

      firstAdditionalBox.mesh.rotateY(Math.PI / 2);
      firstAdditionalBox.rigidBody.setTranslation(
        new RAPIER.Vector3(
          firstAdditionalBox.mesh.position.x,
          firstAdditionalBox.mesh.position.y,
          firstAdditionalBox.mesh.position.z
        ),
        false
      );
      firstAdditionalBox.rigidBody.setRotation(
        new RAPIER.Quaternion(
          firstAdditionalBox.mesh.quaternion.x,
          firstAdditionalBox.mesh.quaternion.y,
          firstAdditionalBox.mesh.quaternion.z,
          firstAdditionalBox.mesh.quaternion.w
        ),
        false
      );

      const secondAdditionalBox = createBox({
        x: x + 3.5,
        y,
        z: newZ,
        world,
        scene,
        arrayOfBoxes,
      });

      secondAdditionalBox.mesh.rotateY(-Math.PI / 6);
      secondAdditionalBox.rigidBody.setTranslation(
        new RAPIER.Vector3(
          secondAdditionalBox.mesh.position.x,
          secondAdditionalBox.mesh.position.y,
          secondAdditionalBox.mesh.position.z
        ),
        false
      );
      secondAdditionalBox.rigidBody.setRotation(
        new RAPIER.Quaternion(
          secondAdditionalBox.mesh.quaternion.x,
          secondAdditionalBox.mesh.quaternion.y,
          secondAdditionalBox.mesh.quaternion.z,
          secondAdditionalBox.mesh.quaternion.w
        ),
        false
      );

      continue;
    }

    if (!(index / coefficient === 5)) {
      continue;
    }

    if ((index / 20) % 2 !== 0) {
      box.mesh.rotateY(-Math.PI / 3);
      box.mesh.position.x = x + 0.5;
      box.rigidBody.setTranslation(
        new RAPIER.Vector3(
          box.mesh.position.x,
          box.mesh.position.y,
          box.mesh.position.z
        ),
        false
      );
      box.rigidBody.setRotation(
        new RAPIER.Quaternion(
          box.mesh.quaternion.x,
          box.mesh.quaternion.y,
          box.mesh.quaternion.z,
          box.mesh.quaternion.w
        ),
        false
      );

      const firstAdditionalBox = createBox({
        x: x + 2,
        y,
        z,
        world,
        scene,
        arrayOfBoxes,
      });

      firstAdditionalBox.mesh.rotateY(Math.PI / 2);
      firstAdditionalBox.rigidBody.setTranslation(
        new RAPIER.Vector3(
          firstAdditionalBox.mesh.position.x,
          firstAdditionalBox.mesh.position.y,
          firstAdditionalBox.mesh.position.z
        ),
        false
      );
      firstAdditionalBox.rigidBody.setRotation(
        new RAPIER.Quaternion(
          firstAdditionalBox.mesh.quaternion.x,
          firstAdditionalBox.mesh.quaternion.y,
          firstAdditionalBox.mesh.quaternion.z,
          firstAdditionalBox.mesh.quaternion.w
        ),
        false
      );

      const secondAdditionalBox = createBox({
        x: x + 3.5,
        y,
        z,
        world,
        scene,
        arrayOfBoxes,
      });

      secondAdditionalBox.mesh.rotateY(Math.PI / 6);
      secondAdditionalBox.rigidBody.setTranslation(
        new RAPIER.Vector3(
          secondAdditionalBox.mesh.position.x,
          secondAdditionalBox.mesh.position.y,
          secondAdditionalBox.mesh.position.z
        ),
        false
      );
      secondAdditionalBox.rigidBody.setRotation(
        new RAPIER.Quaternion(
          secondAdditionalBox.mesh.quaternion.x,
          secondAdditionalBox.mesh.quaternion.y,
          secondAdditionalBox.mesh.quaternion.z,
          secondAdditionalBox.mesh.quaternion.w
        ),
        false
      );
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

    arrayOfBoxes.forEach(({ rigidBody, mesh }) => {
      const position = rigidBody.translation();
      mesh.position.set(position.x, position.y, position.z);

      const rotation = rigidBody.rotation();
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
      arrayOfBoxes[18].rigidBody.addForce(impulse, true);
    },
  };

  gui.add(debugObject, "start");
});
