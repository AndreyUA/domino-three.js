import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

export const createFlor = (world: RAPIER.World) => {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(200, 1, 200),
    new THREE.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 0.5,
    })
  );
  floor.receiveShadow = true;
  floor.position.y = -0.5;

  const floorBody = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0);
  const floorCollider = RAPIER.ColliderDesc.cuboid(100, 0.5, 100);
  const floorRigidBody = world.createRigidBody(floorBody);
  world.createCollider(floorCollider, floorRigidBody);

  return floor;
};
