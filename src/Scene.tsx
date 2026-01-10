import { Canvas } from '@react-three/fiber'
import PenroseObj from './components/3d/PenroseObj'
import ResettableControls from './components/3d/ResettableControls'
import type { SceneProps } from './types'

// Helper function to combine rotations
function combineRotations(
  baseRotation: [number, number, number],
  mouseRotationX: number,
  mouseRotationY: number,
  enableMouseRotation: boolean
): [number, number, number] {
  if (!enableMouseRotation) return baseRotation

  return [
    baseRotation[0] + (mouseRotationX * Math.PI / 180),
    baseRotation[1] + (mouseRotationY * Math.PI / 180),
    baseRotation[2]
  ]
}

export default function Scene({
  mouseRotationX = 0,
  mouseRotationY = 0,
  enableRotation = false,
  isRotated,
  lights,
  modelColor,
  modelPosition,
  modelRotation,
  modelScale,
  modelLerpFactor,
  activeRotation,
  activeTranslation,
  activeScale
}: SceneProps) {

  // Calculate combined transformations
  let finalRotation = combineRotations(
    modelRotation,
    mouseRotationX,
    mouseRotationY,
    enableRotation
  )

  // Add active rotation when isRotated is true
  if (isRotated) {
    finalRotation = [
      finalRotation[0] + activeRotation[0],
      finalRotation[1] + activeRotation[1],
      finalRotation[2] + activeRotation[2]
    ]
  }

  let finalPosition = [...modelPosition] as [number, number, number]

  // Add active translation when isRotated is true
  if (isRotated) {
    finalPosition = [
      finalPosition[0] + activeTranslation[0],
      finalPosition[1] + activeTranslation[1],
      finalPosition[2] + activeTranslation[2]
    ]
  }

  let finalScale = modelScale

  // Apply active scale multiplier when isRotated is true
  if (isRotated) {
    finalScale = finalScale * activeScale
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
      touchAction: 'none',
      zIndex: isRotated ? 10 : 0,
      transition: 'z-index 0.4s',
      pointerEvents: isRotated ? 'auto' : 'none'
    }}>
      <Canvas
        camera={{ zoom: 50, position: [0, 0, 20], fov: 35 }}
        orthographic
        shadows
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={1} />
        <directionalLight
          position={lights.directional.position}
          intensity={lights.directional.intensity}
          color={lights.directional.color}
        />
        <pointLight
          position={lights.point1.position}
          intensity={lights.point1.intensity}
          color={lights.point1.color}
        />
        <pointLight
          position={lights.point2.position}
          intensity={lights.point2.intensity}
          color={lights.point2.color}
        />
        <pointLight
          position={lights.point3.position}
          intensity={lights.point3.intensity}
          color={lights.point3.color}
        />
        <pointLight
          position={lights.point4.position}
          intensity={lights.point4.intensity}
          color={lights.point4.color}
        />
        <PenroseObj
          color={modelColor}
          position={finalPosition}
          rotation={finalRotation}
          scale={finalScale}
          lerpFactor={modelLerpFactor}
        />
        <ResettableControls />
      </Canvas>
    </div>
  )
}
