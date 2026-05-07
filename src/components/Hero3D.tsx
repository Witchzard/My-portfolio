import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { motion } from "motion/react";
import { CyberCar } from "./CyberCar";

function InfiniteGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (gridRef.current) {
      // Move grid towards the camera (which is behind)
      gridRef.current.position.z -= delta * 50; 
      // Loop the grid to make it infinite
      if (gridRef.current.position.z < -20) {
        gridRef.current.position.z += 20;
      }
    }
  });

  return (
    <group ref={gridRef}>
      <Grid 
        position={[0, -0.01, 0]} 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#00ffcc" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#1e1b4b" 
        fadeDistance={40} 
        fadeStrength={1} 
      />
    </group>
  );
}

function CinematicCamera() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Start camera far away
    camera.position.set(10, 5, -20);
    camera.lookAt(0, 0, 0);

    // Initial cinematic sweep behind the car
    gsap.to(camera.position, {
      x: -4,
      y: 2,
      z: -7,
      duration: 3.5,
      ease: "power3.out",
      onUpdate: () => camera.lookAt(0, 0.5, 2)
    });
  }, [camera]);

  useFrame((state) => {
    if (state.clock.elapsedTime > 3.5) {
      // Add subtle handheld/floating camera effect after entrance
      const t = state.clock.elapsedTime;
      camera.position.x = -4 + Math.sin(t * 0.5) * 0.3;
      camera.position.y = 2 + Math.cos(t * 0.4) * 0.1;
      camera.lookAt(0, 0.5, 2);
    }
  });

  return null;
}

function SpeedParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40; // x
      pos[i * 3 + 1] = Math.random() * 10;     // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Particles fly back towards camera
        positions[i * 3 + 2] -= delta * 80;
        if (positions[i * 3 + 2] < -20) {
          positions[i * 3 + 2] += 100; // recycle back to forward distance
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00ffcc" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function CarController() {
  const carRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Car starts behind the camera
    if (carRef.current) {
      carRef.current.position.set(0, 0, -30);
      
      // Zooms past the camera into the center
      gsap.to(carRef.current.position, {
        z: 0,
        duration: 2.5,
        delay: 0.5,
        ease: "power3.out"
      });

      // Add a slight tilt/sway
      gsap.to(carRef.current.rotation, {
        y: 0.02,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <group ref={carRef}>
      <CyberCar />
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#020202]">
      {/* Cinematic Gradient Overlays to blend edges */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/80 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-[30vh] bg-gradient-to-t from-[#020202] to-transparent pointer-events-none" />
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }}>
          <color attach="background" args={["#010103"]} />
          <fog attach="fog" args={["#010103", 5, 40]} />
          
          <CinematicCamera />
          
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
          <pointLight position={[-10, 5, -10]} intensity={2} color="#00ffcc" />
          
          {/* Main Car Model */}
          <CarController />

          <InfiniteGrid />
          <SpeedParticles />
          
          <EffectComposer multisampling={4}>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
            <Noise opacity={0.03} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
    </div>
  );
}
