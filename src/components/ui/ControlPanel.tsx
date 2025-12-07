import { useState } from 'react'
import type React from 'react'
import type { LightSettings, LogoControls, PointLightSettings } from '../../types'
import { CollapsibleSection } from './CollapsibleSection'
import { PointLightControls } from './PointLightControls'

interface ControlPanelProps {
  // Light settings
  lightSettings: LightSettings
  setLightSettings: React.Dispatch<React.SetStateAction<LightSettings>>
  
  // Logo controls
  logoControls: LogoControls
  
  // Interactive effects
  enableDynamicGlow: boolean
  setEnableDynamicGlow: (value: boolean) => void
  enableRotation: boolean
  setEnableRotation: (value: boolean) => void
  enablePositioning: boolean
  setEnablePositioning: (value: boolean) => void
  displacementCoeff: number
  setDisplacementCoeff: (value: number) => void
  rotationCoeff: number
  setRotationCoeff: (value: number) => void
  mousePos: { x: number; y: number }
  
  // 3D Model controls
  modelColor: string
  setModelColor: (value: string) => void
  modelPosition: [number, number, number]
  setModelPosition: (value: [number, number, number]) => void
  modelRotation: [number, number, number]
  setModelRotation: (value: [number, number, number]) => void
  modelScale: number
  setModelScale: (value: number) => void
}

/**
 * Main control panel component that composes all UI controls
 * Provides controls for lights, model properties, logo, and interactive effects
 */
export function ControlPanel({
  lightSettings,
  setLightSettings,
  logoControls,
  enableDynamicGlow,
  setEnableDynamicGlow,
  enableRotation,
  setEnableRotation,
  enablePositioning,
  setEnablePositioning,
  displacementCoeff,
  setDisplacementCoeff,
  rotationCoeff,
  setRotationCoeff,
  mousePos,
  modelColor,
  setModelColor,
  modelPosition,
  setModelPosition,
  modelRotation,
  setModelRotation,
  modelScale,
  setModelScale
}: ControlPanelProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  
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

  const updateDirectionalLight = (
    key: keyof LightSettings['directional'],
    value: [number, number, number] | number | string
  ) => {
    setLightSettings(prev => ({
      ...prev,
      directional: { ...prev.directional, [key]: value }
    }))
  }

  const updatePointLight = (
    pointKey: 'point1' | 'point2' | 'point3' | 'point4',
    key: keyof PointLightSettings,
    value: [number, number, number] | number | string
  ) => {
    setLightSettings(prev => ({
      ...prev,
      [pointKey]: { ...prev[pointKey], [key]: value }
    }))
  }

  const copyToClipboard = () => {
    const lightConfig = `<directionalLight position={[${lightSettings.directional.position.join(', ')}]} intensity={${lightSettings.directional.intensity}} color={'${lightSettings.directional.color}'} />
<pointLight position={[${lightSettings.point1.position.join(', ')}]} intensity={${lightSettings.point1.intensity}} color={'${lightSettings.point1.color}'} />
<pointLight position={[${lightSettings.point2.position.join(', ')}]} intensity={${lightSettings.point2.intensity}} color={'${lightSettings.point2.color}'} />
<pointLight position={[${lightSettings.point3.position.join(', ')}]} intensity={${lightSettings.point3.intensity}} color={'${lightSettings.point3.color}'} />
<pointLight position={[${lightSettings.point4.position.join(', ')}]} intensity={${lightSettings.point4.intensity}} color={'${lightSettings.point4.color}'} />
<PenroseObj color={'${modelColor}'} position={[${modelPosition.join(', ')}]} rotation={[${modelRotation.join(', ')}]} scale={${modelScale}} />`
    
    navigator.clipboard.writeText(lightConfig).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  return (
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
              value={lightSettings.directional.position[0]}
              onChange={(e) => updateDirectionalLight('position', [Number(e.target.value), lightSettings.directional.position[1], lightSettings.directional.position[2]])}
              style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
            />
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="0.01"
            value={lightSettings.directional.position[0]}
            onChange={(e) => updateDirectionalLight('position', [Number(e.target.value), lightSettings.directional.position[1], lightSettings.directional.position[2]])}
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
              value={lightSettings.directional.position[1]}
              onChange={(e) => updateDirectionalLight('position', [lightSettings.directional.position[0], Number(e.target.value), lightSettings.directional.position[2]])}
              style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
            />
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="0.01"
            value={lightSettings.directional.position[1]}
            onChange={(e) => updateDirectionalLight('position', [lightSettings.directional.position[0], Number(e.target.value), lightSettings.directional.position[2]])}
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
              value={lightSettings.directional.position[2]}
              onChange={(e) => updateDirectionalLight('position', [lightSettings.directional.position[0], lightSettings.directional.position[1], Number(e.target.value)])}
              style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
            />
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            step="0.01"
            value={lightSettings.directional.position[2]}
            onChange={(e) => updateDirectionalLight('position', [lightSettings.directional.position[0], lightSettings.directional.position[1], Number(e.target.value)])}
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
              value={lightSettings.directional.intensity}
              onChange={(e) => updateDirectionalLight('intensity', Number(e.target.value))}
              style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
            />
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.01"
            value={lightSettings.directional.intensity}
            onChange={(e) => updateDirectionalLight('intensity', Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        
        {/* Dir Color */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>Color</label>
          <input
            type="color"
            value={lightSettings.directional.color}
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
          light={lightSettings.point1}
          onUpdate={(key, value) => updatePointLight('point1', key, value)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Point Light 2"
        isOpen={openSections.point2}
        onToggle={() => toggleSection('point2')}
      >
        <PointLightControls
          light={lightSettings.point2}
          onUpdate={(key, value) => updatePointLight('point2', key, value)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Point Light 3"
        isOpen={openSections.point3}
        onToggle={() => toggleSection('point3')}
      >
        <PointLightControls
          light={lightSettings.point3}
          onUpdate={(key, value) => updatePointLight('point3', key, value)}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Point Light 4"
        isOpen={openSections.point4}
        onToggle={() => toggleSection('point4')}
      >
        <PointLightControls
          light={lightSettings.point4}
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
  )
}
