// PenroseScene.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function PenroseTriangle() {
  const thickness = 1;
  const length = 10;

  return (
    <group>
      {/* Barre horizontale (base) */}
      <mesh position={[0, -length / 2, 0]}>
        <boxGeometry args={[length, thickness, thickness]} />
        <meshStandardMaterial color="#fcdb19" />
      </mesh>

      {/* Barre montante droite */}
      <mesh
        position={[length / 2.3, 0.6, -length / 2.6]}
        rotation={[0, 0, Math.PI / 2.5]}
      >
        <boxGeometry args={[length, thickness, thickness]} />
        <meshStandardMaterial color="#e7b119" />
      </mesh>

      {/* Barre en retour gauche */}
      <mesh
        position={[-length / 2.5, length / 2.7, -length / 2.8]}
        rotation={[0, 0, -Math.PI / 2.5]}
      >
        <boxGeometry args={[length, thickness, thickness]} />
        <meshStandardMaterial color="#c57a0f" />
      </mesh>
    </group>
  );
}

export default function PenroseScene() {
  return (
    <Canvas orthographic camera={{ zoom: 45, position: [0, 0, 100] }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 10]} />
      <PenroseTriangle />
      {/* Verrouille la vue pour préserver l’illusion */}
      <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
