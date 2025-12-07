// App.jsx
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import PenroseObj from './PenroseObj'
// import VectorLogo3D from './VectorLogo3D'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type React from 'react'

// Component for cursor glow that follows mouse position
function CursorGlow({ mousePos }: { mousePos: { x: number; y: number } }) {
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
        <meshBasicMaterial color="#0D3057" transparent opacity={0.6} />
      </mesh>
      {/* Point light for additional glow effect */}
      <pointLight ref={lightRef} color="#0D3057" intensity={50} distance={30} decay={2} />
    </>
  )
}

interface PointLightSettings {
  position: [number, number, number]
  intensity: number
  color: string
}

interface LightSettings {
  directional: {
    position: [number, number, number]
    intensity: number
    color: string
  }
  point1: PointLightSettings
  point2: PointLightSettings
  point3: PointLightSettings
  point4: PointLightSettings
}

interface LogoControls {
  fillColor: string
  setFillColor: (value: string) => void
  strokeWidth: string
  setStrokeWidth: (value: string) => void
  strokeOpacity: number
  setStrokeOpacity: (value: number) => void
  fillOpacity: number
  setFillOpacity: (value: number) => void
  backdropBlur: string
  setBackdropBlur: (value: string) => void
  blendMode: React.CSSProperties['mixBlendMode']
  setBlendMode: (value: React.CSSProperties['mixBlendMode']) => void
  glowColor: string
  setGlowColor: (value: string) => void
  glowOpacity: number
  setGlowOpacity: (value: number) => void
}

interface SceneProps {
  logoControls: LogoControls
  mouseRotationX?: number
  mouseRotationY?: number
  enableRotation?: boolean
  // Interactive effects controls
  enableDynamicGlow: boolean
  setEnableDynamicGlow: (value: boolean) => void
  setEnableRotation: (value: boolean) => void
  enablePositioning: boolean
  setEnablePositioning: (value: boolean) => void
  displacementCoeff: number
  setDisplacementCoeff: (value: number) => void
  rotationCoeff: number
  setRotationCoeff: (value: number) => void
  mousePos: { x: number; y: number }
}

function ResettableControls() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  // Position et cible initiales
  const initialPosition = new THREE.Vector3(0, 0, 20)
  const initialTarget = new THREE.Vector3(0, 0, 0)

  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const idleDelay = 1000 // ms avant reset

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const onStart = () => setLastInteraction(Date.now())
    controls.addEventListener('start', onStart)

    return () => {
      controls.removeEventListener('start', onStart)
    }
  }, [])

  useFrame(() => {
    const now = Date.now()
    if (now - lastInteraction > idleDelay && controlsRef.current) {
      camera.position.lerp(initialPosition, 0.05)
      controlsRef.current.target.lerp(initialTarget, 0.05)
      controlsRef.current.update()
    }
  })

  // Fix for non-passive wheel event listener warning
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const domElement = controls.domElement
    if (!domElement) return

    // Store original addEventListener
    const originalAddEventListener = domElement.addEventListener.bind(domElement)
    
    // Override addEventListener to make wheel events passive
    domElement.addEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      if (type === 'wheel') {
        const newOptions = typeof options === 'boolean' 
          ? { capture: options, passive: true }
          : { ...options, passive: true }
        return originalAddEventListener(type, listener, newOptions)
      }
      return originalAddEventListener(type, listener, options)
    }

    // Force reconnect to apply new event listeners
    controls.dispose()
    controls.connect(domElement)

    return () => {
      domElement.addEventListener = originalAddEventListener
    }
  }, [])

  return (
    <OrbitControls 
      ref={controlsRef} 
      enableZoom={false} 
      enableRotate={true} 
      enablePan={true}
      makeDefault
    />
  )
}

// Reusable component for Point Light UI controls
function PointLightControls({
  title,
  light,
  onUpdate
}: {
  title: string
  light: PointLightSettings
  onUpdate: (key: keyof PointLightSettings, value: [number, number, number] | number | string) => void
}) {
  return (
    <>
      {title && <h3 style={{ marginBottom: '8px', fontSize: '10px' }}>{title}</h3>}
      
      {/* Position X */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
          <span>Position X</span>
          <input
            type="number"
            step="0.01"
            value={light.position[0]}
            onChange={(e) => onUpdate('position', [Number(e.target.value), light.position[1], light.position[2]])}
            style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
          />
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          step="0.01"
          value={light.position[0]}
          onChange={(e) => onUpdate('position', [Number(e.target.value), light.position[1], light.position[2]])}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      
      {/* Position Y */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
          <span>Position Y</span>
          <input
            type="number"
            step="0.01"
            value={light.position[1]}
            onChange={(e) => onUpdate('position', [light.position[0], Number(e.target.value), light.position[2]])}
            style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
          />
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          step="0.01"
          value={light.position[1]}
          onChange={(e) => onUpdate('position', [light.position[0], Number(e.target.value), light.position[2]])}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      
      {/* Position Z */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
          <span>Position Z</span>
          <input
            type="number"
            step="0.01"
            value={light.position[2]}
            onChange={(e) => onUpdate('position', [light.position[0], light.position[1], Number(e.target.value)])}
            style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
          />
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          step="0.01"
          value={light.position[2]}
          onChange={(e) => onUpdate('position', [light.position[0], light.position[1], Number(e.target.value)])}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      
      {/* Intensity */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
          <span>Intensity</span>
          <input
            type="number"
            step="0.01"
            value={light.intensity}
            onChange={(e) => onUpdate('intensity', Number(e.target.value))}
            style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
          />
        </label>
        <input
          type="range"
          min="0"
          max="200"
          step="0.01"
          value={light.intensity}
          onChange={(e) => onUpdate('intensity', Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      
      {/* Color */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>Color</label>
        <input
          type="color"
          value={light.color.startsWith('#') ? light.color : (light.color === 'red' ? '#ff0000' : light.color === 'green' ? '#00ff00' : light.color === 'blue' ? '#0000ff' : light.color)}
          onChange={(e) => onUpdate('color', e.target.value)}
          style={{ width: '100%', height: '30px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
        />
      </div>
    </>
  )
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          padding: '8px 10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isOpen ? '8px' : '0',
          fontSize: '11px',
          fontWeight: 'bold',
          userSelect: 'none'
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '10px' }}>{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <div style={{ paddingLeft: '5px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function Scene({
  logoControls,
  mouseRotationX = 0,
  mouseRotationY = 0,
  enableRotation = false,
  enableDynamicGlow,
  setEnableDynamicGlow,
  setEnableRotation,
  enablePositioning,
  setEnablePositioning,
  displacementCoeff,
  setDisplacementCoeff,
  rotationCoeff,
  setRotationCoeff,
  mousePos
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
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([-0.951592653589793, -3.05, -0.72])
  const [modelScale, setModelScale] = useState(76.1)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showControls, setShowControls] = useState(false)
  
  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    interactive: false,
    logo: false,
    model: false,
    directional: false,
    point1: false,
    point2: false,
    point3: false,
    point4: false
  })
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateDirectionalLight = (key: keyof LightSettings['directional'], value: [number, number, number] | number | string) => {
    setLights(prev => ({
      ...prev,
      directional: { ...prev.directional, [key]: value }
    }))
  }

  const updatePointLight = (pointKey: 'point1' | 'point2' | 'point3' | 'point4', key: keyof PointLightSettings, value: [number, number, number] | number | string) => {
    setLights(prev => ({
      ...prev,
      [pointKey]: { ...prev[pointKey], [key]: value }
    }))
  }

  const copyToClipboard = () => {
    const lightConfig = `<directionalLight position={[${lights.directional.position.join(', ')}]} intensity={${lights.directional.intensity}} color={'${lights.directional.color}'} />
<pointLight position={[${lights.point1.position.join(', ')}]} intensity={${lights.point1.intensity}} color={'${lights.point1.color}'} />
<pointLight position={[${lights.point2.position.join(', ')}]} intensity={${lights.point2.intensity}} color={'${lights.point2.color}'} />
<pointLight position={[${lights.point3.position.join(', ')}]} intensity={${lights.point3.intensity}} color={'${lights.point3.color}'} />
<pointLight position={[${lights.point4.position.join(', ')}]} intensity={${lights.point4.intensity}} color={'${lights.point4.color}'} />
<PenroseObj color={'${modelColor}'} position={[${modelPosition.join(', ')}]} rotation={[${modelRotation.join(', ')}]} scale={${modelScale}} />`
    
    navigator.clipboard.writeText(lightConfig).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', touchAction: 'none' }}>
      <Canvas
        camera={{ zoom: 50, position: [0, 0, 20], fov: 35 }}
        orthographic
        shadows
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={1} />
        <CursorGlow mousePos={mousePos} />
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
        {/* <VectorLogo3D color={modelColor} position={[0, 2.55, -10]} scale={0.02} /> */}
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
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '12px',
          borderRadius: '10px',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto',
          width: '280px',
          zIndex: 1000,
          fontFamily: 'Arial, sans-serif',
          fontSize: '10px'
        }}>
        {/* Interactive Effects Section */}
        <CollapsibleSection
          title="Effets Interactifs"
          isOpen={openSections.interactive}
          onToggle={() => toggleSection('interactive')}
        >
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '9px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enableDynamicGlow}
                onChange={(e) => setEnableDynamicGlow(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Lueur dynamique</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '9px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enableRotation}
                onChange={(e) => setEnableRotation(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Rotation 3D</span>
            </label>

            {enableRotation && (
              <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
                  <span>Vitesse rotation</span>
                  <span>{rotationCoeff.toFixed(3)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.001"
                  value={rotationCoeff}
                  onChange={(e) => setRotationCoeff(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '9px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enablePositioning}
                onChange={(e) => setEnablePositioning(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Positionnement dynamique</span>
            </label>

            {enablePositioning && (
              <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
                  <span>Déplacement</span>
                  <span>{displacementCoeff.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.2"
                  step="0.01"
                  value={displacementCoeff}
                  onChange={(e) => setDisplacementCoeff(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            )}

            <div style={{ marginTop: '10px', fontSize: '8px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
              Souris: ({mousePos.x}, {mousePos.y})
            </div>
          </div>
        </CollapsibleSection>

        {/* Logo Controls Section */}
        <CollapsibleSection
          title="Logo Controls"
          isOpen={openSections.logo}
          onToggle={() => toggleSection('logo')}
        >
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>
              Fill Color
            </label>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <input
                type="color"
                value={logoControls.fillColor.substring(0, 7)}
                onChange={(e) => logoControls.setFillColor(e.target.value + logoControls.fillColor.substring(7))}
                style={{ width: '40px', height: '25px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={logoControls.fillColor}
                onChange={(e) => logoControls.setFillColor(e.target.value)}
                style={{ flex: 1, padding: '3px', fontSize: '9px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Fill Opacity</span>
              <span>{logoControls.fillOpacity.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={logoControls.fillOpacity}
              onChange={(e) => logoControls.setFillOpacity(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Stroke Width</span>
              <span>{parseFloat(logoControls.strokeWidth).toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.01"
              value={parseFloat(logoControls.strokeWidth)}
              onChange={(e) => logoControls.setStrokeWidth(e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Stroke Opacity</span>
              <span>{logoControls.strokeOpacity.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={logoControls.strokeOpacity}
              onChange={(e) => logoControls.setStrokeOpacity(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Backdrop Blur</span>
              <span>{parseFloat(logoControls.backdropBlur).toFixed(2)}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              step="0.01"
              value={parseFloat(logoControls.backdropBlur)}
              onChange={(e) => logoControls.setBackdropBlur(e.target.value + 'px')}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>
              Blend Mode
            </label>
            <select
              value={logoControls.blendMode}
              onChange={(e) => logoControls.setBlendMode(e.target.value as React.CSSProperties['mixBlendMode'])}
              style={{ width: '100%', padding: '3px', fontSize: '9px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', cursor: 'pointer' }}
            >
              <option value="normal">normal</option>
              <option value="multiply">multiply</option>
              <option value="screen">screen</option>
              <option value="overlay">overlay</option>
              <option value="darken">darken</option>
              <option value="lighten">lighten</option>
              <option value="color-dodge">color-dodge</option>
              <option value="color-burn">color-burn</option>
              <option value="hard-light">hard-light</option>
              <option value="soft-light">soft-light</option>
              <option value="difference">difference</option>
              <option value="exclusion">exclusion</option>
              <option value="hue">hue</option>
              <option value="saturation">saturation</option>
              <option value="color">color</option>
              <option value="luminosity">luminosity</option>
              <option value="plus-lighter">plus-lighter</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>
              Glow Color
            </label>
            <select
              value={logoControls.glowColor}
              onChange={(e) => logoControls.setGlowColor(e.target.value)}
              style={{ width: '100%', padding: '3px', fontSize: '9px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', cursor: 'pointer' }}
            >
              <option value="white">White</option>
              <option value="black">Black</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Glow Opacity</span>
              <span>{logoControls.glowOpacity.toFixed(3)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={logoControls.glowOpacity}
              onChange={(e) => logoControls.setGlowOpacity(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <button
            onClick={() => {
              logoControls.setFillColor('#ffffff53')
              logoControls.setStrokeWidth('0.5')
              logoControls.setStrokeOpacity(1)
              logoControls.setFillOpacity(1)
              logoControls.setBackdropBlur('7.58px')
              logoControls.setBlendMode('plus-lighter')
              logoControls.setGlowColor('white')
              logoControls.setGlowOpacity(0.126)
            }}
            style={{
              width: '100%',
              padding: '6px',
              background: '#444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 'bold'
            }}
          >
            Reset Logo Defaults
          </button>
        </CollapsibleSection>

        {/* Model 3D Section */}
        <CollapsibleSection
          title="Modèle 3D"
          isOpen={openSections.model}
          onToggle={() => toggleSection('model')}
        >
        
          {/* Position X */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Position X</span>
              <input
                type="number"
                step="0.01"
                value={modelPosition[0]}
                onChange={(e) => setModelPosition([Number(e.target.value), modelPosition[1], modelPosition[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              step="0.01"
              value={modelPosition[0]}
              onChange={(e) => setModelPosition([Number(e.target.value), modelPosition[1], modelPosition[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Position Y */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Position Y</span>
              <input
                type="number"
                step="0.01"
                value={modelPosition[1]}
                onChange={(e) => setModelPosition([modelPosition[0], Number(e.target.value), modelPosition[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              step="0.01"
              value={modelPosition[1]}
              onChange={(e) => setModelPosition([modelPosition[0], Number(e.target.value), modelPosition[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Position Z */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Position Z</span>
              <input
                type="number"
                step="0.01"
                value={modelPosition[2]}
                onChange={(e) => setModelPosition([modelPosition[0], modelPosition[1], Number(e.target.value)])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              step="0.01"
              value={modelPosition[2]}
              onChange={(e) => setModelPosition([modelPosition[0], modelPosition[1], Number(e.target.value)])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Rotation X */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Rotation X</span>
              <input
                type="number"
                step="0.01"
                value={modelRotation[0]}
                onChange={(e) => setModelRotation([Number(e.target.value), modelRotation[1], modelRotation[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step="0.01"
              value={modelRotation[0]}
              onChange={(e) => setModelRotation([Number(e.target.value), modelRotation[1], modelRotation[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Rotation Y */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Rotation Y</span>
              <input
                type="number"
                step="0.01"
                value={modelRotation[1]}
                onChange={(e) => setModelRotation([modelRotation[0], Number(e.target.value), modelRotation[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step="0.01"
              value={modelRotation[1]}
              onChange={(e) => setModelRotation([modelRotation[0], Number(e.target.value), modelRotation[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Rotation Z */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Rotation Z</span>
              <input
                type="number"
                step="0.01"
                value={modelRotation[2]}
                onChange={(e) => setModelRotation([modelRotation[0], modelRotation[1], Number(e.target.value)])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step="0.01"
              value={modelRotation[2]}
              onChange={(e) => setModelRotation([modelRotation[0], modelRotation[1], Number(e.target.value)])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Taille */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Taille</span>
              <input
                type="number"
                step="0.1"
                value={modelScale}
                onChange={(e) => setModelScale(Number(e.target.value))}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="0.1"
              value={modelScale}
              onChange={(e) => setModelScale(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Couleur */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>Couleur</label>
            <input
              type="color"
              value={modelColor}
              onChange={(e) => setModelColor(e.target.value)}
              style={{ width: '100%', height: '30px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
            />
          </div>
        </CollapsibleSection>

        {/* Directional Light Section */}
        <CollapsibleSection
          title="Directional Light"
          isOpen={openSections.directional}
          onToggle={() => toggleSection('directional')}
        >
          {/* Dir Position X */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Position X</span>
              <input
                type="number"
                step="0.01"
                value={lights.directional.position[0]}
                onChange={(e) => updateDirectionalLight('position', [Number(e.target.value), lights.directional.position[1], lights.directional.position[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              step="0.01"
              value={lights.directional.position[0]}
              onChange={(e) => updateDirectionalLight('position', [Number(e.target.value), lights.directional.position[1], lights.directional.position[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Dir Position Y */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Position Y</span>
              <input
                type="number"
                step="0.01"
                value={lights.directional.position[1]}
                onChange={(e) => updateDirectionalLight('position', [lights.directional.position[0], Number(e.target.value), lights.directional.position[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              step="0.01"
              value={lights.directional.position[1]}
              onChange={(e) => updateDirectionalLight('position', [lights.directional.position[0], Number(e.target.value), lights.directional.position[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Dir Position Z */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Position Z</span>
              <input
                type="number"
                step="0.01"
                value={lights.directional.position[2]}
                onChange={(e) => updateDirectionalLight('position', [lights.directional.position[0], lights.directional.position[1], Number(e.target.value)])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              step="0.01"
              value={lights.directional.position[2]}
              onChange={(e) => updateDirectionalLight('position', [lights.directional.position[0], lights.directional.position[1], Number(e.target.value)])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Dir Intensity */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Intensity</span>
              <input
                type="number"
                step="0.01"
                value={lights.directional.intensity}
                onChange={(e) => updateDirectionalLight('intensity', Number(e.target.value))}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.01"
              value={lights.directional.intensity}
              onChange={(e) => updateDirectionalLight('intensity', Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Dir Color */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>Color</label>
            <input
              type="color"
              value={lights.directional.color}
              onChange={(e) => updateDirectionalLight('color', e.target.value)}
              style={{ width: '100%', height: '30px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
            />
          </div>
        </CollapsibleSection>

        {/* Point Lights wrapped in CollapsibleSections */}
        <CollapsibleSection
          title="Point Light 1"
          isOpen={openSections.point1}
          onToggle={() => toggleSection('point1')}
        >
          <PointLightControls
            title=""
            light={lights.point1}
            onUpdate={(key, value) => updatePointLight('point1', key, value)}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Point Light 2"
          isOpen={openSections.point2}
          onToggle={() => toggleSection('point2')}
        >
          <PointLightControls
            title=""
            light={lights.point2}
            onUpdate={(key, value) => updatePointLight('point2', key, value)}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Point Light 3"
          isOpen={openSections.point3}
          onToggle={() => toggleSection('point3')}
        >
          <PointLightControls
            title=""
            light={lights.point3}
            onUpdate={(key, value) => updatePointLight('point3', key, value)}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Point Light 4"
          isOpen={openSections.point4}
          onToggle={() => toggleSection('point4')}
        >
          <PointLightControls
            title=""
            light={lights.point4}
            onUpdate={(key, value) => updatePointLight('point4', key, value)}
          />
        </CollapsibleSection>

        <button
          onClick={copyToClipboard}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: copySuccess ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '9px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
            marginTop: '10px'
          }}
        >
          {copySuccess ? '✓ Copié!' : 'Copier les valeurs'}
        </button>
        </div>
      )}
    </div>
  )
}
