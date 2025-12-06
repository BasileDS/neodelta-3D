// components/PenroseObj.jsx
import { useEffect, useRef, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { STLLoader } from 'three-stdlib'

interface PenroseObjProps {
  color?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export default function PenroseObj({
  color = '#ffbb00',
  position = [0, 0, 0],
  rotation = [-0.952, -3.05, -0.72]
}: PenroseObjProps) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useLoader(STLLoader, '/models/Penrose_object.stl')

  // Créer le matériau avec la couleur passée en prop (mémorisé pour éviter les recréations)
  // MeshStandardMaterial permet des transitions de lumière progressives et lisses
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: 0.1,
  }), [color])

  // Centrer la géométrie
  useEffect(() => {
    geometry.center()
    geometry.computeVertexNormals()
  }, [geometry])

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      scale={[50, 50, 50]}
      rotation={rotation}
      position={position}
    />
  )
}
