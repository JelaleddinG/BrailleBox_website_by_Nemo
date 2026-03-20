"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const panels = [
  {
    id: "overview",
    eyebrow: "Overview",
    title: "The current BrailleBox, shown as the full device.",
    body:
      "Start with the whole object. This is the current BrailleBox, not a future concept. The goal here is simple: make the device readable before anything else happens.",
  },
  {
    id: "input",
    eyebrow: "Brailler-style input",
    title: "Six-button input, centered as the main interaction point.",
    body:
      "The next move is to focus on the six-button Brailler-style input. That is where the interaction becomes clearer and the product starts to explain itself.",
  },
  {
    id: "detail",
    eyebrow: "Braille detail",
    title: "Then move closer to the labeled button detail.",
    body:
      "The last view should feel tighter and more intentional. It brings attention to the tactile detail and reinforces that this is a device built around Braille interaction, not generic hardware.",
  },
];

function CameraRig({ activeIndex }: { activeIndex: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const targets = [
      { position: new THREE.Vector3(0, 1.2, 11.8), lookAt: new THREE.Vector3(0, 0, 0) },
      { position: new THREE.Vector3(0.18, 0.82, 10.2), lookAt: new THREE.Vector3(0.16, -0.02, 0.06) },
      { position: new THREE.Vector3(-0.1, 0.72, 9.1), lookAt: new THREE.Vector3(-0.06, -0.04, 0.1) },
    ];

    const target = targets[activeIndex] ?? targets[0];
    camera.position.lerp(target.position, 0.05);
    camera.lookAt(target.lookAt);
  });

  return null;
}

function AssemblyMesh({ activeIndex }: { activeIndex: number }) {
  const geometry = useLoader(STLLoader, "/assets/current-braillebox-assembly.stl");
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: ["#f5b14c", "#ffd45c", "#ff8a5b"][activeIndex] ?? "#ffd45c",
        metalness: 0.06,
        roughness: 0.46,
        clearcoat: 0.26,
        clearcoatRoughness: 0.44,
      }),
    [activeIndex],
  );

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 35), [geometry]);

  useEffect(() => {
    geometry.computeBoundingBox();
    geometry.center();
    geometry.computeVertexNormals();
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current || !edgeRef.current) return;

    const targetRotY = [0.62, 0.18, -0.04][activeIndex] ?? 0.45;
    const targetRotX = [-0.42, -0.18, -0.08][activeIndex] ?? -0.24;
    const targetScale = [0.98, 1.16, 1.34][activeIndex] ?? 1;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.055);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.055);
    edgeRef.current.rotation.y = meshRef.current.rotation.y;
    edgeRef.current.rotation.x = meshRef.current.rotation.x;

    const scale = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.07);
    meshRef.current.scale.setScalar(scale);
    edgeRef.current.scale.setScalar(scale * 1.003);

    const bob = Math.sin(state.clock.elapsedTime * 0.45) * 0.02;
    meshRef.current.position.y = bob;
    edgeRef.current.position.y = bob;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />
      <lineSegments ref={edgeRef} geometry={edges}>
        <lineBasicMaterial color="#fff0c7" transparent opacity={0.28} />
      </lineSegments>
    </group>
  );
}

function ModelStage({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="sticky top-24 flex h-[74vh] items-center justify-center rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09),rgba(255,255,255,0.02)_48%,transparent_72%)] shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
      <Canvas camera={{ position: [0, 1.1, 9.8], fov: 24 }} dpr={[1, 1.8]}>
        <ambientLight intensity={1} />
        <directionalLight position={[7, 9, 6]} intensity={2.5} color="#fff6de" />
        <directionalLight position={[-6, -2, 3]} intensity={0.95} color="#01c2c2" />
        <directionalLight position={[0, 6, -6]} intensity={0.7} color="#ff6347" />
        <CameraRig activeIndex={activeIndex} />
        <AssemblyMesh activeIndex={activeIndex} />
        <Environment preset="studio" />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-center text-xs uppercase tracking-[0.24em] text-white/42">
        Current device • Full Assembly No PCB
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] ring-1 ring-inset ring-white/8" />
    </div>
  );
}

export function ProductScrollShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((node, index) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveIndex(index);
          });
        },
        { threshold: 0.58 },
      );
      observer.observe(node);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <section className="border-b border-black/6 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="max-w-4xl">
          <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Our Product</div>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            The current BrailleBox,
            <br />
            in three clear views.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/74 sm:text-xl">
            First show the full device. Then move to the six-button input.
            Then move closer to the Braille-labeled detail. The motion should
            explain the product, not distract from it.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
          <ModelStage activeIndex={activeIndex} />

          <div className="space-y-12">
            {panels.map((panel, index) => (
              <div
                key={panel.id}
                ref={(node) => {
                  sectionRefs.current[index] = node;
                }}
                className={`min-h-[62vh] rounded-[2rem] border px-7 py-8 transition duration-500 lg:px-8 lg:py-10 ${
                  activeIndex === index
                    ? "border-white/22 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <div className="text-sm uppercase tracking-[0.22em] text-[var(--bb-yellow)]">
                  {panel.eyebrow}
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  {panel.title}
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/72">{panel.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
