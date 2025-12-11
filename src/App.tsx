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
import { useSectionPosition } from './hooks/useSectionPosition'
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
  const [enableRotation, setEnableRotation] = useState(false)
  const [enablePositioning, setEnablePositioning] = useState(true)
  const [displacementCoeff, setDisplacementCoeff] = useState(0.01)
  const [rotationCoeff, setRotationCoeff] = useState(0.3)
  const [showControls, setShowControls] = useState(false)
  
  // Rotation toggle state
  const [isRotated, setIsRotated] = useState(false)
  
  // Control if effects should be disabled when isRotated is true
  const [disableEffectsWhenRotated, setDisableEffectsWhenRotated] = useState(true)
  
  // Vector text rotation parameters
  const [enableVectorRotation, setEnableVectorRotation] = useState(true)
  const [vectorPerspective, setVectorPerspective] = useState(950)
  const [vectorRotateY, setVectorRotateY] = useState(50)
  const [vectorTranslateZ, setVectorTranslateZ] = useState(-450)
  const [vectorRotateX, setVectorRotateX] = useState(3)
  
  // Scroll animation state
  const [scrollConfig, setScrollConfig] = useState<ScrollAnimationConfig>(defaultScrollConfig)
  const scrollValues = useScrollAnimation(scrollConfig)
  
  // Section-based positioning
  const [enableSectionPositioning] = useState(true)
  const sectionPosition = useSectionPosition(0.08)
  
  // Use custom mouse position hook
  const { mousePos } = useMousePosition(showControls)

  // Calculate dynamic values based on mouse position
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  // Calculate angle from center to mouse (in degrees)
  const deltaX = mousePos.x - centerX
  const deltaY = mousePos.y - centerY
  const glowAngle = enableDynamicGlow && !(isRotated && disableEffectsWhenRotated)
    ? Math.atan2(deltaY, deltaX) * (180 / Math.PI)
    : 45

  // Calculate rotation based on mouse X and Y position
  // X axis rotation based on mouse Y, Y axis rotation based on mouse X
  const rotationX = enableRotation && !(isRotated && disableEffectsWhenRotated)
    ? ((mousePos.y - centerY) / centerY) * rotationCoeff * 100
    : 0
  const rotationY = enableRotation && !(isRotated && disableEffectsWhenRotated)
    ? ((mousePos.x - centerX) / centerX) * rotationCoeff * 100
    : 0

  // Calculate positioning offset based on mouse position
  const translateX = enablePositioning && !(isRotated && disableEffectsWhenRotated)
    ? (mousePos.x - centerX) * displacementCoeff
    : 0
  const translateY = enablePositioning && !(isRotated && disableEffectsWhenRotated)
    ? (mousePos.y - centerY) * displacementCoeff
    : 0

  // Cursor glow settings
  const [cursorGlowColor] = useState('#00a2ffff')
  const [cursorGlowWidth] = useState(50) // Width in vw
  const [cursorGlowHeight] = useState(90) // Height in vh
  const [cursorGlowOpacity] = useState(0.05)
  const [enableCursorGlow] = useState(true)
  const [cursorGlowDisplacement] = useState(1) // 1 = follows cursor exactly

  // Toggle section positioning mode
  const [useSectionMode, setUseSectionMode] = useState(false)
  
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
  const [modelLerpFactor, setModelLerpFactor] = useState(0.47) // Smoothness of rotation (0.01-1)
  const [activeRotation, setActiveRotation] = useState<[number, number, number]>([0, Math.PI, 0]) // Rotation added when active (radians)
  const [activeTranslation, setActiveTranslation] = useState<[number, number, number]>([15.9, 1.6, 0]) // Translation added when active
  const [activeScale, setActiveScale] = useState(2.1) // Scale multiplier when active (1 = no change)
  
  // Separate lerp factors for activation and deactivation
  const [activationLerpFactor, setActivationLerpFactor] = useState(0.09) // Smoothness when activating rotation
  const [deactivationLerpFactor, setDeactivationLerpFactor] = useState(0.24) // Smoothness when deactivating rotation
  
  // Determine final values based on mode
  const finalModelPosition = (useSectionMode && enableSectionPositioning)
    ? sectionPosition.model.position
    : modelPosition
  const finalModelRotation = (useSectionMode && enableSectionPositioning)
    ? sectionPosition.model.rotation
    : modelRotation
  const finalModelScale = (useSectionMode && enableSectionPositioning)
    ? sectionPosition.model.scale
    : modelScale

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
        {isRotated ? 'Annuler l\'animation' : 'Appliquer l\'animation'}
      </button>
      
      {/* Section Mode Toggle Button */}
      <button
        onClick={() => setUseSectionMode(!useSectionMode)}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '23rem',
          backgroundColor: useSectionMode ? 'rgba(0, 162, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
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
          e.currentTarget.style.backgroundColor = useSectionMode ? 'rgba(0, 162, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = useSectionMode ? 'rgba(0, 162, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'
        }}
      >
        {useSectionMode ? 'Mode Section: ON' : 'Mode Section: OFF'}
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
          activationLerpFactor={activationLerpFactor}
          setActivationLerpFactor={setActivationLerpFactor}
          deactivationLerpFactor={deactivationLerpFactor}
          setDeactivationLerpFactor={setDeactivationLerpFactor}
          disableEffectsWhenRotated={disableEffectsWhenRotated}
          setDisableEffectsWhenRotated={setDisableEffectsWhenRotated}
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
        modelPosition={finalModelPosition}
        modelRotation={finalModelRotation}
        modelScale={finalModelScale}
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
          opacity: (useSectionMode && enableSectionPositioning)
            ? sectionPosition.vector.opacity
            : (scrollConfig.enableScrollOpacity ? scrollValues.opacity : 1),
          transform: (isRotated && enableVectorRotation)
            ? `translate(-50%, -50%) perspective(${vectorPerspective}px) rotateY(${vectorRotateY}deg) translateZ(${vectorTranslateZ}px) rotateX(${vectorRotateX}deg)`
            : (useSectionMode && enableSectionPositioning)
              ? `translate(calc(-50% + ${sectionPosition.vector.position.x}vw), calc(-50% + ${sectionPosition.vector.position.y}vh)) scale(${sectionPosition.vector.scale}) rotate(${sectionPosition.vector.rotation}deg)`
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
          backdropBlur={(isRotated && disableEffectsWhenRotated)
            ? '0px'
            : ((useSectionMode && enableSectionPositioning && !sectionPosition.effects.blurBackground)
              ? '0px'
              : backdropBlur)}
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
