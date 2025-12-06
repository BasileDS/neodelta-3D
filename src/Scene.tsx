// App.jsx
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import PenroseObj from './PenroseObj'
import VectorLogo3D from './VectorLogo3D'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

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

  return <OrbitControls ref={controlsRef} enableZoom={false} enableRotate={true} enablePan={true} />
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
      <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>{title}</h3>
      
      {/* Position X */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
          <span>Position X</span>
          <input
            type="number"
            step="0.01"
            value={light.position[0]}
            onChange={(e) => onUpdate('position', [Number(e.target.value), light.position[1], light.position[2]])}
            style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
          <span>Position Y</span>
          <input
            type="number"
            step="0.01"
            value={light.position[1]}
            onChange={(e) => onUpdate('position', [light.position[0], Number(e.target.value), light.position[2]])}
            style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
          <span>Position Z</span>
          <input
            type="number"
            step="0.01"
            value={light.position[2]}
            onChange={(e) => onUpdate('position', [light.position[0], light.position[1], Number(e.target.value)])}
            style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
          <span>Intensity</span>
          <input
            type="number"
            step="0.01"
            value={light.intensity}
            onChange={(e) => onUpdate('intensity', Number(e.target.value))}
            style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>Color</label>
        <input
          type="color"
          value={light.color.startsWith('#') ? light.color : (light.color === 'red' ? '#ff0000' : light.color === 'green' ? '#00ff00' : light.color === 'blue' ? '#0000ff' : light.color)}
          onChange={(e) => onUpdate('color', e.target.value)}
          style={{ width: '100%', height: '35px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
        />
      </div>
    </>
  )
}

export default function Scene() {
  const [lights, setLights] = useState<LightSettings>({
    directional: {
      position: [-22, 7, 13],
      intensity: 4.96,
      color: '#ffe95c'
    },
    point1: {
      position: [-0.25, 1.21, 0.68],
      intensity: 1.88,
      color: '#fbff00'
    },
    point2: {
      position: [6, -1.77, 2.03],
      intensity: 27.9,
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

  const [modelColor, setModelColor] = useState('#ffab1a')
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, 0, 0])
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([-0.952, -3.05, -0.72])
  const [copySuccess, setCopySuccess] = useState(false)
  const [showControls, setShowControls] = useState(true)

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
<PenroseObj color={'${modelColor}'} position={[${modelPosition.join(', ')}]} rotation={[${modelRotation.join(', ')}]} />`
    
    navigator.clipboard.writeText(lightConfig).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        camera={{ zoom: 50, position: [0, 0, 20], fov: 35 }}
        orthographic
        shadows
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
        <PenroseObj color={modelColor} position={modelPosition} rotation={modelRotation} />
        <VectorLogo3D color={modelColor} position={[0, 2.55, -10]} scale={0.02} />
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
        {showControls ? '✕ Masquer' : '⚙ Paramètres'}
      </button>

      {/* Control Panel */}
      {showControls && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto',
          width: '320px',
          zIndex: 1000,
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px'
        }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>Modèle 3D</h3>
        
        {/* Position X */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position X</span>
            <input
              type="number"
              step="0.01"
              value={modelPosition[0]}
              onChange={(e) => setModelPosition([Number(e.target.value), modelPosition[1], modelPosition[2]])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Y</span>
            <input
              type="number"
              step="0.01"
              value={modelPosition[1]}
              onChange={(e) => setModelPosition([modelPosition[0], Number(e.target.value), modelPosition[2]])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Z</span>
            <input
              type="number"
              step="0.01"
              value={modelPosition[2]}
              onChange={(e) => setModelPosition([modelPosition[0], modelPosition[1], Number(e.target.value)])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Rotation X</span>
            <input
              type="number"
              step="0.01"
              value={modelRotation[0]}
              onChange={(e) => setModelRotation([Number(e.target.value), modelRotation[1], modelRotation[2]])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Rotation Y</span>
            <input
              type="number"
              step="0.01"
              value={modelRotation[1]}
              onChange={(e) => setModelRotation([modelRotation[0], Number(e.target.value), modelRotation[2]])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Rotation Z</span>
            <input
              type="number"
              step="0.01"
              value={modelRotation[2]}
              onChange={(e) => setModelRotation([modelRotation[0], modelRotation[1], Number(e.target.value)])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        
        {/* Couleur */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>Couleur</label>
          <input
            type="color"
            value={modelColor}
            onChange={(e) => setModelColor(e.target.value)}
            style={{ width: '100%', height: '35px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #555', margin: '15px 0' }} />

        <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Directional Light</h3>
        
        {/* Dir Position X */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position X</span>
            <input
              type="number"
              step="0.01"
              value={lights.directional.position[0]}
              onChange={(e) => updateDirectionalLight('position', [Number(e.target.value), lights.directional.position[1], lights.directional.position[2]])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Y</span>
            <input
              type="number"
              step="0.01"
              value={lights.directional.position[1]}
              onChange={(e) => updateDirectionalLight('position', [lights.directional.position[0], Number(e.target.value), lights.directional.position[2]])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Z</span>
            <input
              type="number"
              step="0.01"
              value={lights.directional.position[2]}
              onChange={(e) => updateDirectionalLight('position', [lights.directional.position[0], lights.directional.position[1], Number(e.target.value)])}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
            <span>Intensity</span>
            <input
              type="number"
              step="0.01"
              value={lights.directional.intensity}
              onChange={(e) => updateDirectionalLight('intensity', Number(e.target.value))}
              style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 5px', fontSize: '11px' }}
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
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>Color</label>
          <input
            type="color"
            value={lights.directional.color}
            onChange={(e) => updateDirectionalLight('color', e.target.value)}
            style={{ width: '100%', height: '35px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #555', margin: '15px 0' }} />

        {/* Point Light 1 */}
        <PointLightControls
          title="Point Light 1"
          light={lights.point1}
          onUpdate={(key, value) => updatePointLight('point1', key, value)}
        />

        <hr style={{ border: 'none', borderTop: '1px solid #555', margin: '15px 0' }} />

        {/* Point Light 2 */}
        <PointLightControls
          title="Point Light 2"
          light={lights.point2}
          onUpdate={(key, value) => updatePointLight('point2', key, value)}
        />

        <hr style={{ border: 'none', borderTop: '1px solid #555', margin: '15px 0' }} />

        {/* Point Light 3 */}
        <PointLightControls
          title="Point Light 3"
          light={lights.point3}
          onUpdate={(key, value) => updatePointLight('point3', key, value)}
        />

        <hr style={{ border: 'none', borderTop: '1px solid #555', margin: '15px 0' }} />

        {/* Point Light 4 */}
        <PointLightControls
          title="Point Light 4"
          light={lights.point4}
          onUpdate={(key, value) => updatePointLight('point4', key, value)}
        />

        <button
          onClick={copyToClipboard}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: copySuccess ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
            marginTop: '15px'
          }}
        >
          {copySuccess ? '✓ Copié!' : 'Copier les valeurs'}
        </button>
        </div>
      )}
    </div>
  )
}
