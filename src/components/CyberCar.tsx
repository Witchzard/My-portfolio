import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CyberCar(props: any) {
  const wheelRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    // Animate wheels spinning
    wheelRefs.current.forEach(wheel => {
      if (wheel) wheel.rotation.x += delta * 15;
    });
  });

  return (
    <group {...props}>
      {/* Chassis Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.25, 4.8]} />
        <meshStandardMaterial color="#070707" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Front Hood (Angled down) */}
      <mesh position={[0, 0.4, 1.8]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.2, 1.5]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Cabin/Roof */}
      <mesh position={[0, 0.7, -0.4]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 2.2]} />
        <meshStandardMaterial color="#020202" metalness={1} roughness={0} />
      </mesh>

      {/* Rear Wing/Spoilers */}
      <mesh position={[0, 0.8, -2.2]} castShadow>
        <boxGeometry args={[2.1, 0.05, 0.4]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Wing supports */}
      <mesh position={[0.8, 0.6, -2.1]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.8, 0.6, -2.1]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Cyberpunk Emissive Details (Neon Lines) */}
      
      {/* Side Neon strips */}
      <mesh position={[1.01, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.02, 4.5]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[-1.01, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.02, 4.5]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Front Headlights (Aggressive slits) */}
      <mesh position={[0.7, 0.45, 2.41]}>
        <boxGeometry args={[0.5, 0.05, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0f2fe" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.7, 0.45, 2.41]}>
        <boxGeometry args={[0.5, 0.05, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#e0f2fe" emissiveIntensity={5} toneMapped={false} />
      </mesh>

      {/* Center glowing badge */}
      <mesh position={[0, 0.46, 2.42]}>
        <planeGeometry args={[0.1, 0.1]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={4} toneMapped={false} />
      </mesh>

      {/* Rear Taillights (Cyberpunk red strip) */}
      <mesh position={[0, 0.5, -2.41]}>
        <boxGeometry args={[1.8, 0.08, 0.05]} />
        <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      
      {/* Exhaust Glows */}
      <mesh position={[0.5, 0.25, -2.41]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[-0.5, 0.25, -2.41]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* Wheels */}
      <Wheel position={[-1.1, 0.35, 1.5]} ref={(el) => { wheelRefs.current[0] = el as THREE.Mesh; }} />
      <Wheel position={[1.1, 0.35, 1.5]} ref={(el) => { wheelRefs.current[1] = el as THREE.Mesh; }} />
      <Wheel position={[-1.1, 0.35, -1.4]} ref={(el) => { wheelRefs.current[2] = el as THREE.Mesh; }} />
      <Wheel position={[1.1, 0.35, -1.4]} ref={(el) => { wheelRefs.current[3] = el as THREE.Mesh; }} />
    </group>
  );
}

const Wheel = React.forwardRef(({ position }: { position: [number, number, number] }, ref: any) => {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.8} />
      </mesh>
      {/* Rim Neon Glow */}
      <mesh rotation={[0, 0, Math.PI / 2]} ref={ref}>
        <torusGeometry args={[0.2, 0.02, 16, 32]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} toneMapped={false} />
        {/* Hubcap design crossing */}
        <mesh rotation={[0, 0, 0]}>
           <boxGeometry args={[0.4, 0.05, 0.02]} />
           <meshStandardMaterial color="#111" metalness={1} />
        </mesh>
        <mesh rotation={[0, Math.PI/2, 0]}>
           <boxGeometry args={[0.4, 0.05, 0.02]} />
           <meshStandardMaterial color="#111" metalness={1} />
        </mesh>
      </mesh>
    </group>
  );
});
Wheel.displayName = "Wheel";
