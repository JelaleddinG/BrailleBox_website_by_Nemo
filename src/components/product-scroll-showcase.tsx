"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const panels = [
  {
    id: "shape",
    eyebrow: "Form",
    title: "The current BrailleBox, shown as the real object.",
    body:
      "This page is now built around the current device, not a future concept. The physical form is the starting point: what the learner touches, sees, and returns to.",
  },
  {
    id: "interaction",
    eyebrow: "Interaction",
    title: "Built around tactile use, not abstract product talk.",
    body:
      "The geometry matters because Braille learning is physical. The top surface, spacing, and layout need to support repeated use, attention, and confidence.",
  },
  {
    id: "teacher",
    eyebrow: "Teacher visibility",
    title: "The hardware only matters if it leads to clearer teaching decisions.",
    body:
      "BrailleBox is not just an object on a desk. It connects to a teacher-facing view that helps educators understand what is happening and where support is needed next.",
  },
  {
    id: "system",
    eyebrow: "System",
    title: "One device. One dashboard. One clearer learning loop.",
    body:
      "Student interaction, teacher visibility, and school understanding should connect into one coherent system instead of scattered tools and manual guesswork.",
  },
];

function AssemblyMesh({ activeIndex }: { activeIndex: number }) {
  const geometry = useLoader(STLLoader, "/assets/current-braillebox-assembly.stl");
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: activeIndex % 2 === 0 ? "#ffd700" : "#ff6347",
        metalness: 0.18,
        roughness: 0.38,
      }),
    [activeIndex],
  );

  useEffect(() => {
    geometry.computeBoundingBox();
    geometry.center();
    geometry.computeVertexNormals();
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const targetScale = [1.9, 1.5, 1.15, 0.92][activeIndex] ?? 1;
    const targetRotY = [0.55, 0.2, -0.15, -0.35][activeIndex] ?? 0;
    const targetRotX = [-0.4, -0.28, -0.22, -0.18][activeIndex] ?? -0.25;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotY,
      0.06,
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotX,
      0.06,
    );
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08),
    );

    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.03;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

function ModelStage({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="sticky top-24 flex h-[72vh] items-center justify-center rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),rgba(255,255,255,0.02)_48%,transparent_72%)] shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
      <Canvas camera={{ position: [0, 0.8, 7], fov: 28 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 8, 6]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-6, -4, 2]} intensity={0.9} color="#01c2c2" />
        <AssemblyMesh activeIndex={activeIndex} />
        <Environment preset="city" />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-center text-xs uppercase tracking-[0.24em] text-white/42">
        Current device • Full Assembly No PCB
      </div>
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
        { threshold: 0.55 },
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
            shaped into view.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/74 sm:text-xl">
            This is the current device, presented as the object itself and then
            opened up through the story around it. Scroll through the product,
            not just past it.
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
                className={`min-h-[56vh] rounded-[2rem] border px-7 py-8 transition duration-500 lg:px-8 lg:py-10 ${
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
