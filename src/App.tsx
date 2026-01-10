import { useState } from 'react'
import type React from 'react'
import './App.css'
import Scene from './Scene'
import VectorLogotype from './components/vector/VectorLogotype'
import { useMousePosition } from './hooks/useMousePosition'
import type { LightSettings } from './types'

const title = {
  fontSize: '1.4rem',
  fontWeight: 600,
  position: 'fixed' as const,
  top: '1rem',
  left: '2rem',
  zIndex: 10,
}

function App() {
  // Vector text styling
  const fillColor = '#ffffff53'
  const strokeWidth = '0.5'
  const strokeOpacity = 1
  const fillOpacity = 1
  const backdropBlur = '7px'
  const blendMode: React.CSSProperties['mixBlendMode'] = 'plus-lighter'
  const glowColor = 'white'
  const glowOpacity = 0.66
  const glowIntensity = 2.3

  // Interactive effects
  const enableDynamicGlow = true
  const invertGlow = true
  const enableRotation = false
  const enablePositioning = true
  const displacementCoeff = 0.01
  const rotationCoeff = 0.3

  // Rotation toggle state
  const [isRotated] = useState(false)
  const disableEffectsWhenRotated = true

  // Vector text 3D rotation parameters
  const enableVectorRotation = true
  const vectorPerspective = 950
  const vectorRotateY = 50
  const vectorTranslateZ = -450
  const vectorRotateX = 3

  // Mouse position tracking
  const { mousePos } = useMousePosition(false)

  // Calculate dynamic values based on mouse position
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  const deltaX = mousePos.x - centerX
  const deltaY = mousePos.y - centerY
  const glowAngle = enableDynamicGlow && !(isRotated && disableEffectsWhenRotated)
    ? Math.atan2(deltaY, deltaX) * (180 / Math.PI)
    : 45

  const rotationX = enableRotation && !(isRotated && disableEffectsWhenRotated)
    ? ((mousePos.y - centerY) / centerY) * rotationCoeff * 100
    : 0
  const rotationY = enableRotation && !(isRotated && disableEffectsWhenRotated)
    ? ((mousePos.x - centerX) / centerX) * rotationCoeff * 100
    : 0

  const translateX = enablePositioning && !(isRotated && disableEffectsWhenRotated)
    ? (mousePos.x - centerX) * displacementCoeff
    : 0
  const translateY = enablePositioning && !(isRotated && disableEffectsWhenRotated)
    ? (mousePos.y - centerY) * displacementCoeff
    : 0

  // 3D Scene settings
  const lights: LightSettings = {
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
  }

  const modelColor = '#ffae00'
  const modelPosition: [number, number, number] = [0, -1.5, 0.51]
  const modelRotation: [number, number, number] = [-0.972, -2.962, -0.72]
  const modelScale = 76.1

  // Animation parameters for 3D logo
  const activeRotation: [number, number, number] = [0, Math.PI, 0]
  const activeTranslation: [number, number, number] = [15.9, 1.6, 0]
  const activeScale = 2.1
  const activationLerpFactor = 0.09
  const deactivationLerpFactor = 0.24

  return (
    <>
      <h1 style={title}>Neodelta <em>Playground</em></h1>

      <Scene
        mouseRotationX={rotationX}
        mouseRotationY={rotationY}
        enableRotation={enableRotation}
        isRotated={isRotated}
        lights={lights}
        modelColor={modelColor}
        modelPosition={modelPosition}
        modelRotation={modelRotation}
        modelScale={modelScale}
        modelLerpFactor={isRotated ? activationLerpFactor : deactivationLerpFactor}
        activeRotation={activeRotation}
        activeTranslation={activeTranslation}
        activeScale={activeScale}
      />

      <div
        className='square'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          opacity: 1,
          transform: (isRotated && enableVectorRotation)
            ? `translate(-50%, -50%) perspective(${vectorPerspective}px) rotateY(${vectorRotateY}deg) translateZ(${vectorTranslateZ}px) rotateX(${vectorRotateX}deg)`
            : 'translate(-50%, -50%)',
          transition: 'transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.8s ease',
          zIndex: isRotated ? 0 : 1,
          pointerEvents: 'none'
        }}
      >
        <VectorLogotype
          fillColor={fillColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          fillOpacity={fillOpacity}
          backdropBlur={(isRotated && disableEffectsWhenRotated) ? '0px' : backdropBlur}
          blendMode={blendMode}
          glowColor={glowColor}
          glowOpacity={glowOpacity}
          glowIntensity={glowIntensity}
          glowAngle={glowAngle}
          invertGlow={invertGlow}
          translateX={translateX}
          translateY={translateY}
        />
      </div>
    </>
  )
}

export default App
