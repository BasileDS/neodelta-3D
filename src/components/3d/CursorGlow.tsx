import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CursorGlowProps {
  mousePos: { x: number; y: number }
}

// Component for cursor glow that follows mouse position
export default function CursorGlow({ mousePos }: CursorGlowProps) {
  const glowRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!glowRef.current || !lightRef.current) return

    // Convert screen coordinates to normalized device coordinates (-1 to +1)
    const x = (mousePos.x / window.innerWidth) * 2 - 1
    const y = -(mousePos.y / window.innerHeight) * 2 + 1

    // Convert to world coordinates at a specific z depth
    const vector = new THREE.Vector3(x, y, 0.5)
    vector.unproject(camera)

    // Position the glow behind the scene (negative z)
    const dir = vector.sub(camera.position).normalize()
    const distance = -15 // Distance behind the main objects
    const pos = camera.position.clone().add(dir.multiplyScalar(distance))

    glowRef.current.position.copy(pos)
    lightRef.current.position.copy(pos)
  })

  return (
    <>
      {/* Glowing sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#ff0000ff" transparent opacity={0.6} />
      </mesh>
      {/* Point light for additional glow effect */}
      <pointLight ref={lightRef} color="#0D3057" intensity={50} distance={30} decay={2} />
    </>
  )
}
