import * as THREE from "three";

export const createFlor = () => {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1_000, 1_000),
    new THREE.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 0.5,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;

  return floor;
};
