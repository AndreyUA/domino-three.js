import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

export interface BoxResult {
  rigidBody: RAPIER.RigidBody;
  mesh: THREE.Mesh<
    THREE.BoxGeometry,
    THREE.MeshStandardMaterial,
    THREE.Object3DEventMap
  >;
}

const boxGeometry = new THREE.BoxGeometry(1, 2, 0.2);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
});

export const createBox = ({
  x,
  y,
  z,
  world,
  scene,
  arrayOfBoxes,
}: {
  x: number;
  y: number;
  z: number;
  world: RAPIER.World;
  scene: THREE.Scene;
  arrayOfBoxes: Array<BoxResult>;
}): BoxResult => {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.castShadow = true;
  mesh.position.copy({
    x,
    y,
    z,
  });

  const cubeBody = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);
  const cubeCollider = RAPIER.ColliderDesc.cuboid(0.5, 1, 0.1).setRestitution(
    0.4
  );
  const cubeRigidBody = world.createRigidBody(cubeBody);
  world.createCollider(cubeCollider, cubeRigidBody);

  scene.add(mesh);

  const result = {
    rigidBody: cubeRigidBody,
    mesh,
  };

  arrayOfBoxes.push(result);

  return result;
};
