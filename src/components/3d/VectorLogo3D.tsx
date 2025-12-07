import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three-stdlib'
import { vectorPaths } from '../../data/vectorPaths'

interface VectorLogo3DProps {
  color?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export default function VectorLogo3D({ 
  color = '#ffffff', 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.05
}: VectorLogo3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Optional: Add subtle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  // Parse SVG and create shapes using useMemo for performance
  const shapes = useMemo(() => {
    const svgString = `
      <svg viewBox="0 0 930 161" xmlns="http://www.w3.org/2000/svg">
        ${vectorPaths.map(path => `<path d="${path}" fill="white"/>`).join('\n')}
      </svg>
    `
    
    const loader = new SVGLoader()
    const svgData = loader.parse(svgString)
    const allShapes: THREE.Shape[] = []
    
    svgData.paths.forEach((path) => {
      const shapes = SVGLoader.createShapes(path)
      shapes.forEach((shape) => {
        allShapes.push(shape)
      })
    })
    
    return allShapes
  }, [])

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={[scale, -scale, scale]}>
      <group position={[-465, 0, 0]}>
        {shapes.map((shape, i) => (
          <mesh key={i} castShadow receiveShadow>
            <extrudeGeometry
              args={[
                shape,
                {
                  depth: 15,
                  bevelEnabled: true,
                  bevelThickness: 2,
                  bevelSize: 1,
                  bevelSegments: 5
                }
              ]}
            />
            <meshPhysicalMaterial
              color={color}
              metalness={0}
              roughness={0}
              transmission={1}
              thickness={2}
              ior={1.5}
              clearcoat={1}
              clearcoatRoughness={0}
              transparent={true}
              opacity={0.1}
              reflectivity={1}
              envMapIntensity={2}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
