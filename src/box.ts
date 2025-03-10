import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

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
  arrayOfBoxes,
}: {
  x: number;
  y: number;
  z: number;
  world: RAPIER.World;
  arrayOfBoxes: Array<{
    cubeRigidBody: RAPIER.RigidBody;
    mesh: THREE.Mesh<
      THREE.BoxGeometry,
      THREE.MeshStandardMaterial,
      THREE.Object3DEventMap
    >;
  }>;
}): THREE.Mesh<
  THREE.BoxGeometry,
  THREE.MeshStandardMaterial,
  THREE.Object3DEventMap
> => {
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

  arrayOfBoxes.push({ cubeRigidBody, mesh });

  return mesh;
};
