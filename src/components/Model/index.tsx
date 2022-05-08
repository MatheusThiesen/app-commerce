import {
  ContactShadows,
  Html,
  OrbitControls,
  useProgress,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { Suspense } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

export function Model() {
  function Shoes() {
    const gltf = useLoader(GLTFLoader, "/assets/nike_space/scene.gltf");
    // const obj = useLoader(
    //   OBJLoader,
    //   "/assets/obj/vans_old/export/vans_old_skool_black__corona.obj"
    // );

    return (
      <Suspense fallback={<Loader />}>
        <primitive scale={13} object={gltf.scene} />
        {/* <primitive object={obj} /> */}
      </Suspense>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 2.75] }}>
      <Shoes />

      <ambientLight intensity={0.3} />
      <spotLight
        intensity={0.3}
        angle={0.1}
        penumbra={1}
        position={[5, 25, 20]}
      />

      <ContactShadows
        rotation-x={Math.PI / 2}
        position={[0, -0.8, 0]}
        opacity={0.25}
        width={10}
        height={10}
        blur={2}
        far={1}
      />

      <OrbitControls />
    </Canvas>
  );
}
