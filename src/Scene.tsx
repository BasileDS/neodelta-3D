import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import PenroseObj from './components/3d/PenroseObj'
import ResettableControls from './components/3d/ResettableControls'
import { ControlPanel } from './components/ui/ControlPanel'
import type { SceneProps, LightSettings } from './types'

export default function Scene({
  logoControls,
  mouseRotationX = 0,
  mouseRotationY = 0,
  enableRotation = false,
  enableDynamicGlow,
  setEnableDynamicGlow,
  invertGlow,
  setInvertGlow,
  setEnableRotation,
  enablePositioning,
  setEnablePositioning,
  displacementCoeff,
  setDisplacementCoeff,
  rotationCoeff,
  setRotationCoeff,
  mousePos,
  showControls,
  setShowControls
}: SceneProps) {
  const [lights, setLights] = useState<LightSettings>({
    directional: {
      position: [-26.34, 12.33, 14.98],
      intensity: 4.45,
      color: '#ffe95c'
    },
    point1: {
      position: [-0.22, 1.46, 1.12],
      intensity: 3.52,
      color: '#ffd500'
    },
    point2: {
      position: [6, -1.23, 4.46],
      intensity: 8.6,
      color: '#ffbb00'
    },
    point3: {
      position: [3.42, 5.82, -15.45],
      intensity: 0,
      color: '#ff0000'
    },
    point4: {
      position: [0, -2, -2],
      intensity: 0,
      color: '#ff0000'
    }
  })

  const [modelColor, setModelColor] = useState('#ffae00')
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, -1.5, 0.51])
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([-0.972, -2.962, -0.72])
  const [modelScale, setModelScale] = useState(76.1)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', touchAction: 'none' }}>
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
          position={modelPosition}
          rotation={enableRotation
            ? [
                modelRotation[0] + (mouseRotationX * Math.PI / 180),
                modelRotation[1] + (mouseRotationY * Math.PI / 180),
                modelRotation[2]
              ]
            : modelRotation
          }
          scale={modelScale}
        />
        <ResettableControls />
      </Canvas>

      {/* Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          border: '1px solid #555',
          borderRadius: '8px',
          padding: '10px 15px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 1001,
          transition: 'all 0.3s',
          fontFamily: 'Arial, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.95)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.85)'
        }}
      >
        {showControls ? 'Masquer' : 'Paramètres'}
      </button>

      {/* Control Panel */}
      {showControls && (
        <ControlPanel
          lightSettings={lights}
          setLightSettings={setLights}
          logoControls={logoControls}
          enableDynamicGlow={enableDynamicGlow}
          setEnableDynamicGlow={setEnableDynamicGlow}
          invertGlow={invertGlow}
          setInvertGlow={setInvertGlow}
          enableRotation={enableRotation}
          setEnableRotation={setEnableRotation}
          enablePositioning={enablePositioning}
          setEnablePositioning={setEnablePositioning}
          displacementCoeff={displacementCoeff}
          setDisplacementCoeff={setDisplacementCoeff}
          rotationCoeff={rotationCoeff}
          setRotationCoeff={setRotationCoeff}
          mousePos={mousePos}
          modelColor={modelColor}
          setModelColor={setModelColor}
          modelPosition={modelPosition}
          setModelPosition={setModelPosition}
          modelRotation={modelRotation}
          setModelRotation={setModelRotation}
          modelScale={modelScale}
          setModelScale={setModelScale}
        />
      )}
    </div>
  )
}
