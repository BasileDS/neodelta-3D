import { useState } from 'react'
import type React from 'react'
import './App.css'
import Scene from './Scene'
import VectorLogotype from './components/vector/VectorLogotype'
import CursorGlow from './components/ui/CursorGlow'
import ScrollBackground from './components/ui/ScrollBackground'
import AgencySections from './components/ui/AgencySections'
import { ControlPanel } from './components/ui/ControlPanel'
import { useMousePosition } from './hooks/useMousePosition'
import { useScrollAnimation, defaultScrollConfig } from './hooks/useScrollAnimation'
import type { ScrollAnimationConfig, LightSettings } from './types'

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
  
  // Rotation toggle state
  const [isRotated, setIsRotated] = useState(false)
  
  // Vector text rotation parameters
  const [enableVectorRotation, setEnableVectorRotation] = useState(true)
  const [vectorPerspective, setVectorPerspective] = useState(950)
  const [vectorRotateY, setVectorRotateY] = useState(50)
  const [vectorTranslateZ, setVectorTranslateZ] = useState(-450)
  const [vectorRotateX, setVectorRotateX] = useState(3)
  
  // Scroll animation state
  const [scrollConfig, setScrollConfig] = useState<ScrollAnimationConfig>(defaultScrollConfig)
  const scrollValues = useScrollAnimation(scrollConfig)
  
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

  // 3D Scene settings
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
  
  // Animation parameters for 3D logo
  const [modelLerpFactor, setModelLerpFactor] = useState(0.1) // Smoothness of rotation (0.01-1)
  const [activeRotation, setActiveRotation] = useState<[number, number, number]>([0, Math.PI, 0]) // Rotation added when active (radians)
  const [activeTranslation, setActiveTranslation] = useState<[number, number, number]>([0, 0, 0]) // Translation added when active
  const [activeScale, setActiveScale] = useState(1) // Scale multiplier when active (1 = no change)

  return (
    <>
      <ScrollBackground />
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
      
      {/* View Toggle Button */}
      <button
        onClick={() => setIsRotated(!isRotated)}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '12rem',
          backgroundColor: isRotated ? 'rgba(255, 165, 0, 0.85)' : 'rgba(0, 0, 0, 0.85)',
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
          e.currentTarget.style.backgroundColor = isRotated ? 'rgba(255, 165, 0, 0.95)' : 'rgba(0, 0, 0, 0.95)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isRotated ? 'rgba(255, 165, 0, 0.85)' : 'rgba(0, 0, 0, 0.85)'
        }}
      >
        {isRotated ? 'Active' : 'Base'}
      </button>
      
      {/* Parameters Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '2rem',
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
          scrollConfig={scrollConfig}
          setScrollConfig={setScrollConfig}
          scrollValues={scrollValues}
          enableVectorRotation={enableVectorRotation}
          setEnableVectorRotation={setEnableVectorRotation}
          vectorPerspective={vectorPerspective}
          setVectorPerspective={setVectorPerspective}
          vectorRotateY={vectorRotateY}
          setVectorRotateY={setVectorRotateY}
          vectorTranslateZ={vectorTranslateZ}
          setVectorTranslateZ={setVectorTranslateZ}
          vectorRotateX={vectorRotateX}
          setVectorRotateX={setVectorRotateX}
          modelLerpFactor={modelLerpFactor}
          setModelLerpFactor={setModelLerpFactor}
          activeRotation={activeRotation}
          setActiveRotation={setActiveRotation}
          activeTranslation={activeTranslation}
          setActiveTranslation={setActiveTranslation}
          activeScale={activeScale}
          setActiveScale={setActiveScale}
        />
      )}

      <Scene
        mouseRotationX={rotationX}
        mouseRotationY={rotationY}
        enableRotation={enableRotation}
        scrollConfig={scrollConfig}
        scrollValues={scrollValues}
        isRotated={isRotated}
        lights={lights}
        modelColor={modelColor}
        modelPosition={modelPosition}
        modelRotation={modelRotation}
        modelScale={modelScale}
        modelLerpFactor={modelLerpFactor}
        activeRotation={activeRotation}
        activeTranslation={activeTranslation}
        activeScale={activeScale}
      />
      <div
        className='square'
        style={{
          opacity: scrollConfig.enableScrollOpacity ? scrollValues.opacity : 1,
          transform: (isRotated && enableVectorRotation)
            ? `perspective(${vectorPerspective}px) rotateY(${vectorRotateY}deg) translateZ(${vectorTranslateZ}px) rotateX(${vectorRotateX}deg)`
            : 'none',
          transition: 'transform 0.8s ease-in-out',
          zIndex: isRotated ? 0 : 1,
        }}
      >
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
      <AgencySections />
    </>
  )
}

export default App
