import { useState } from 'react'
import type React from 'react'
import './App.css'
import Scene from './Scene'
import VectorLogotype from './components/vector/VectorLogotype'
import CursorGlow from './components/ui/CursorGlow'
import { useMousePosition } from './hooks/useMousePosition'

const title = {
  fontSize: '1.4rem',
  fontWeight: 600,
  position: 'fixed' as const,
  top: '1rem',
  left: '2rem',
  zIndex: 10,
}

function App() {
  const [fillColor, setFillColor] = useState('#ffffff53')
  const [strokeWidth, setStrokeWidth] = useState('0.5')
  const [strokeOpacity, setStrokeOpacity] = useState(1)
  const [fillOpacity, setFillOpacity] = useState(1)
  const [backdropBlur, setBackdropBlur] = useState('7px')
  const [blendMode, setBlendMode] = useState<React.CSSProperties['mixBlendMode']>('plus-lighter')
  const [glowColor, setGlowColor] = useState('white')
  const [glowOpacity, setGlowOpacity] = useState(0.66)
  const [glowIntensity, setGlowIntensity] = useState(2.3)

  // Interactive effects state
  const [enableDynamicGlow, setEnableDynamicGlow] = useState(true)
  const [invertGlow, setInvertGlow] = useState(true)
  const [enableRotation, setEnableRotation] = useState(true)
  const [enablePositioning, setEnablePositioning] = useState(true)
  const [displacementCoeff, setDisplacementCoeff] = useState(0.03)
  const [rotationCoeff, setRotationCoeff] = useState(0.3)
  const [showControls, setShowControls] = useState(false)
  
  // Use custom mouse position hook
  const { mousePos } = useMousePosition(showControls)

  // Calculate dynamic values based on mouse position
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  // Calculate angle from center to mouse (in degrees)
  const deltaX = mousePos.x - centerX
  const deltaY = mousePos.y - centerY
  const glowAngle = enableDynamicGlow
    ? Math.atan2(deltaY, deltaX) * (180 / Math.PI)
    : 45

  // Calculate rotation based on mouse X and Y position
  // X axis rotation based on mouse Y, Y axis rotation based on mouse X
  const rotationX = enableRotation
    ? ((mousePos.y - centerY) / centerY) * rotationCoeff * 100
    : 0
  const rotationY = enableRotation
    ? ((mousePos.x - centerX) / centerX) * rotationCoeff * 100
    : 0

  // Calculate positioning offset based on mouse position
  const translateX = enablePositioning
    ? (mousePos.x - centerX) * displacementCoeff
    : 0
  const translateY = enablePositioning
    ? (mousePos.y - centerY) * displacementCoeff
    : 0

  // Cursor glow settings
  const [cursorGlowColor] = useState('#00a2ffff')
  const [cursorGlowWidth] = useState(50) // Width in vw
  const [cursorGlowHeight] = useState(90) // Height in vh
  const [cursorGlowOpacity] = useState(0.05)
  const [enableCursorGlow] = useState(true)
  const [cursorGlowDisplacement] = useState(1) // 1 = follows cursor exactly

  return (
    <>
      <CursorGlow
        mousePos={mousePos}
        color={cursorGlowColor}
        width={cursorGlowWidth}
        height={cursorGlowHeight}
        opacity={cursorGlowOpacity}
        enabled={enableCursorGlow}
        displacementCoeff={cursorGlowDisplacement}
      />
      <h1 style={title}>Neodelta <em>Playground</em></h1>
      <Scene
        logoControls={{
          fillColor,
          setFillColor,
          strokeWidth,
          setStrokeWidth,
          strokeOpacity,
          setStrokeOpacity,
          fillOpacity,
          setFillOpacity,
          backdropBlur,
          setBackdropBlur,
          blendMode,
          setBlendMode,
          glowColor,
          setGlowColor,
          glowOpacity,
          setGlowOpacity,
          glowIntensity,
          setGlowIntensity
        }}
        mouseRotationX={rotationX}
        mouseRotationY={rotationY}
        enableRotation={enableRotation}
        enableDynamicGlow={enableDynamicGlow}
        setEnableDynamicGlow={setEnableDynamicGlow}
        invertGlow={invertGlow}
        setInvertGlow={setInvertGlow}
        setEnableRotation={setEnableRotation}
        enablePositioning={enablePositioning}
        setEnablePositioning={setEnablePositioning}
        displacementCoeff={displacementCoeff}
        setDisplacementCoeff={setDisplacementCoeff}
        rotationCoeff={rotationCoeff}
        setRotationCoeff={setRotationCoeff}
        mousePos={mousePos}
        showControls={showControls}
        setShowControls={setShowControls}
      />
      <div className='square'>
        <VectorLogotype
          fillColor={fillColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          fillOpacity={fillOpacity}
          backdropBlur={backdropBlur}
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
