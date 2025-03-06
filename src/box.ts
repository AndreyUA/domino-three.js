import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 2, 0.2);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
});

export const createBox = ({
  x,
  y,
  z,
}: {
  x: number;
  y: number;
  z: number;
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

  return mesh;
};
