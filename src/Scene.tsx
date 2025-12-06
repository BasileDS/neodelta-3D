// App.jsx
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import PenroseObj from './PenroseObj'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface LightSettings {
  directional: {
    position: [number, number, number]
    intensity: number
    color: string
  }
  point: {
    position: [number, number, number]
    intensity: number
    color: string
  }
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

export default function Scene() {
  const [lights, setLights] = useState<LightSettings>({
    directional: {
      position: [10, 0, 10],
      intensity: 4,
      color: '#ffbb00'
    },
    point: {
      position: [-10, 10, 0],
      intensity: 90,
      color: 'red'
    }
  })

  const [modelColor, setModelColor] = useState('#ffbb00')
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, 0, 0])
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([-0.95, -3.05, -0.72])
  const [copySuccess, setCopySuccess] = useState(false)

  const updateDirectionalLight = (key: keyof LightSettings['directional'], value: [number, number, number] | number | string) => {
    setLights(prev => ({
      ...prev,
      directional: { ...prev.directional, [key]: value }
    }))
  }

  const updatePointLight = (key: keyof LightSettings['point'], value: [number, number, number] | number | string) => {
    setLights(prev => ({
      ...prev,
      point: { ...prev.point, [key]: value }
    }))
  }

  const copyToClipboard = () => {
    const lightConfig = `<directionalLight position={[${lights.directional.position.join(', ')}]} intensity={${lights.directional.intensity}} color={'${lights.directional.color}'} />
<pointLight position={[${lights.point.position.join(', ')}]} intensity={${lights.point.intensity}} color={'${lights.point.color}'} />
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
          position={lights.point.position}
          intensity={lights.point.intensity}
          color={lights.point.color}
        />
        <PenroseObj color={modelColor} position={modelPosition} rotation={modelRotation} />
        <ResettableControls />
      </Canvas>

      {/* Control Panel - Always Visible */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        maxHeight: 'calc(100vh - 20px)',
        overflowY: 'auto',
        width: '320px',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>Modèle 3D</h3>
        
        {/* Position X */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position X</span>
            <span>{modelPosition[0].toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="-20"
            max="20"
            step="0.1"
            value={modelPosition[0]}
            onChange={(e) => setModelPosition([Number(e.target.value), modelPosition[1], modelPosition[2]])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {/* Position Y */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Y</span>
            <span>{modelPosition[1].toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="-20"
            max="20"
            step="0.1"
            value={modelPosition[1]}
            onChange={(e) => setModelPosition([modelPosition[0], Number(e.target.value), modelPosition[2]])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {/* Position Z */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Z</span>
            <span>{modelPosition[2].toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="-20"
            max="20"
            step="0.1"
            value={modelPosition[2]}
            onChange={(e) => setModelPosition([modelPosition[0], modelPosition[1], Number(e.target.value)])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {/* Rotation X */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Rotation X</span>
            <span>{modelRotation[0].toFixed(2)}</span>
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
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Rotation Y</span>
            <span>{modelRotation[1].toFixed(2)}</span>
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
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Rotation Z</span>
            <span>{modelRotation[2].toFixed(2)}</span>
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
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position X</span>
            <span>{lights.directional.position[0].toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={lights.directional.position[0]}
            onChange={(e) => updateDirectionalLight('position', [Number(e.target.value), lights.directional.position[1], lights.directional.position[2]])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        {/* Dir Position Y */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Y</span>
            <span>{lights.directional.position[1].toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={lights.directional.position[1]}
            onChange={(e) => updateDirectionalLight('position', [lights.directional.position[0], Number(e.target.value), lights.directional.position[2]])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        {/* Dir Position Z */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Z</span>
            <span>{lights.directional.position[2].toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={lights.directional.position[2]}
            onChange={(e) => updateDirectionalLight('position', [lights.directional.position[0], lights.directional.position[1], Number(e.target.value)])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        {/* Dir Intensity */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Intensity</span>
            <span>{lights.directional.intensity.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
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

        <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Point Light</h3>
        
        {/* Point Position X */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position X</span>
            <span>{lights.point.position[0].toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={lights.point.position[0]}
            onChange={(e) => updatePointLight('position', [Number(e.target.value), lights.point.position[1], lights.point.position[2]])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        {/* Point Position Y */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Y</span>
            <span>{lights.point.position[1].toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={lights.point.position[1]}
            onChange={(e) => updatePointLight('position', [lights.point.position[0], Number(e.target.value), lights.point.position[2]])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        {/* Point Position Z */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Position Z</span>
            <span>{lights.point.position[2].toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={lights.point.position[2]}
            onChange={(e) => updatePointLight('position', [lights.point.position[0], lights.point.position[1], Number(e.target.value)])}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        {/* Point Intensity */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
            <span>Intensity</span>
            <span>{lights.point.intensity.toFixed(0)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            step="1"
            value={lights.point.intensity}
            onChange={(e) => updatePointLight('intensity', Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        {/* Point Color */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '11px' }}>Color</label>
          <input
            type="color"
            value={lights.point.color === 'red' ? '#ff0000' : lights.point.color}
            onChange={(e) => updatePointLight('color', e.target.value)}
            style={{ width: '100%', height: '35px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>

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
            marginTop: '5px'
          }}
        >
          {copySuccess ? '✓ Copié!' : 'Copier les valeurs'}
        </button>
      </div>
    </div>
  )
}
