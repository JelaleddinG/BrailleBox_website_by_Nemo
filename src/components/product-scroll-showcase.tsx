"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const panels = [
  {
    id: "shape",
    eyebrow: "Form",
    title: "The current BrailleBox, shown as the real object.",
    body:
      "This page is built around the current device, not a future concept. The physical form is the starting point: what the learner touches, sees, and returns to.",
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
  const edgeRef = useRef<THREE.LineSegments>(null);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: ["#ffb84d", "#ffd700", "#01c2c2", "#ff8a65"][activeIndex] ?? "#ffd700",
        metalness: 0.08,
        roughness: 0.42,
        clearcoat: 0.35,
        clearcoatRoughness: 0.45,
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
    const targetScale = [1.7, 1.35, 1.05, 0.88][activeIndex] ?? 1;
    const targetRotY = [0.95, 0.48, 0.14, -0.18][activeIndex] ?? 0;
    const targetRotX = [-0.72, -0.46, -0.3, -0.2][activeIndex] ?? -0.25;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.055);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.055);
    edgeRef.current.rotation.y = meshRef.current.rotation.y;
    edgeRef.current.rotation.x = meshRef.current.rotation.x;

    const scale = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08);
    meshRef.current.scale.setScalar(scale);
    edgeRef.current.scale.setScalar(scale * 1.0025);

    const bob = Math.sin(state.clock.elapsedTime * 0.55) * 0.025;
    meshRef.current.position.y = bob;
    edgeRef.current.position.y = bob;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />
      <lineSegments ref={edgeRef} geometry={edges}>
        <lineBasicMaterial color="#fff4c2" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

function ModelStage({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="sticky top-24 flex h-[72vh] items-center justify-center rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09),rgba(255,255,255,0.02)_48%,transparent_72%)] shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
      <Canvas camera={{ position: [0, 0.9, 7.4], fov: 24 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.95} />
        <directionalLight position={[7, 9, 6]} intensity={2.4} color="#fff7e0" />
        <directionalLight position={[-7, -3, 3]} intensity={1.1} color="#01c2c2" />
        <directionalLight position={[0, 6, -6]} intensity={0.75} color="#ff6347" />
        <AssemblyMesh activeIndex={activeIndex} />
        <Environment preset="studio" />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-center text-xs uppercase tracking-[0.24em] text-white/42">
        Current device • Full Assembly No PCB
      </div>
    </div>
  );
}

function TipHeroReveal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const total = Math.max(node.offsetHeight - window.innerHeight, 1);
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(traveled / total);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scale = 1.95 - progress * 1.08;
  const translateY = progress * -58;
  const opacity = 1 - progress * 0.88;

  return (
    <section ref={containerRef} className="relative h-[155vh] border-b border-black/6 bg-slate-950 text-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(1,194,194,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,99,71,0.16),transparent_22%)]" />
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pt-18 pb-0 lg:px-10 lg:pt-24">
          <div className="relative z-10 max-w-4xl" style={{ opacity: Math.max(0.25, 1 - progress * 0.7) }}>
            <div className="text-sm uppercase tracking-[0.24em] text-[var(--bb-yellow)]">Our Product</div>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              The current BrailleBox,
              <br />
              coming into focus.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/74 sm:text-xl">
              Land on the tip of the device first. Then scroll into the rest of
              the object, the interaction, and the system around it.
            </p>
          </div>

          <div className="relative mt-auto h-[56vh] min-h-[420px] w-full">
            <div
              className="absolute inset-x-[-6%] bottom-[-34%] sm:bottom-[-42%] lg:inset-x-[-2%] lg:bottom-[-48%]"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                transformOrigin: "center bottom",
                transition: "transform 60ms linear, opacity 60ms linear",
              }}
            >
              <Image
                src="/assets/box-picture.png"
                alt="BrailleBox tip reveal"
                width={2600}
                height={1600}
                priority
                className="h-auto w-full object-contain drop-shadow-[0_50px_110px_rgba(0,0,0,0.52)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
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
    <>
      <TipHeroReveal />
      <section className="border-b border-black/6 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="mt-2 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
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
    </>
  );
}
