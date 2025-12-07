// components/PenroseObj.jsx
import { useEffect, useRef, useMemo } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { STLLoader } from 'three-stdlib'

interface PenroseObjProps {
  color?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  lerpFactor?: number
}

export default function PenroseObj({
  color = '#ffbb00',
  position = [15.9, 1.6, 0],
  rotation = [0, 3.14, 0],
  scale = 105,
  lerpFactor = 1
}: PenroseObjProps) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useLoader(STLLoader, '/models/Penrose_object_rounded_v2.stl')
  const initializedRef = useRef(false)

  // Créer le matériau avec la couleur passée en prop (mémorisé pour éviter les recréations)
  // MeshStandardMaterial permet des transitions de lumière progressives et lisses
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color,
    roughness: 1,
    metalness: 0,
  }), [color])

  // Centrer la géométrie et initialiser la position/rotation/scale
  useEffect(() => {
    geometry.center()
    geometry.computeVertexNormals()
    
    // Initialize position, rotation, and scale on first render
    if (ref.current && !initializedRef.current) {
      ref.current.position.set(position[0], position[1], position[2])
      ref.current.rotation.set(rotation[0], rotation[1], rotation[2])
      ref.current.scale.set(scale, scale, scale)
      initializedRef.current = true
    }
  }, [geometry, position, rotation, scale])
  
  // Smooth interpolation for rotation, position, and scale
  useFrame(() => {
    if (ref.current && initializedRef.current) {
      // Smoothly interpolate rotation using lerp
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, rotation[0], lerpFactor)
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, rotation[1], lerpFactor)
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rotation[2], lerpFactor)
      
      // Smoothly interpolate position
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0], lerpFactor)
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1], lerpFactor)
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, position[2], lerpFactor)
      
      // Smoothly interpolate scale
      ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, scale, lerpFactor)
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, scale, lerpFactor)
      ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, scale, lerpFactor)
    }
  })

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
    />
  )
}
