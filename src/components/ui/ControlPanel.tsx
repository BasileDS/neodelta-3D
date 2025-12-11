import { useState, useRef } from 'react'
import type React from 'react'
import type { LightSettings, LogoControls, PointLightSettings, ScrollAnimationConfig, ScrollAnimationValues } from '../../types'
import { CollapsibleSection } from './CollapsibleSection'
import { PointLightControls } from './PointLightControls'
import { ScrollAnimationControls } from './ScrollAnimationControls'

interface ConfigurationData {
  // Logo settings
  fillColor: string
  strokeWidth: string
  strokeOpacity: number
  fillOpacity: number
  backdropBlur: string
  blendMode: string
  glowColor: string
  glowOpacity: number
  glowIntensity: number
  
  // Interactive effects
  enableDynamicGlow: boolean
  invertGlow: boolean
  enableRotation: boolean
  enablePositioning: boolean
  displacementCoeff: number
  rotationCoeff: number
  
  // Light settings
  lightSettings: LightSettings
  
  // 3D Model
  modelColor: string
  modelPosition: [number, number, number]
  modelRotation: [number, number, number]
  modelScale: number
  
  // 3D Model animation
  modelLerpFactor?: number
  activeRotation?: [number, number, number]
  activeTranslation?: [number, number, number]
  activeScale?: number
  activationLerpFactor?: number
  deactivationLerpFactor?: number
  disableEffectsWhenRotated?: boolean
  
  // Scroll Animation
  scrollAnimationConfig?: ScrollAnimationConfig
  
  // Vector text rotation
  enableVectorRotation?: boolean
  vectorPerspective?: number
  vectorRotateY?: number
  vectorTranslateZ?: number
  vectorRotateX?: number
}

interface ControlPanelProps {
  // Light settings
  lightSettings: LightSettings
  setLightSettings: React.Dispatch<React.SetStateAction<LightSettings>>
  
  // Logo controls
  logoControls: LogoControls
  
  // Interactive effects
  enableDynamicGlow: boolean
  setEnableDynamicGlow: (value: boolean) => void
  invertGlow: boolean
  setInvertGlow: (value: boolean) => void
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
  
  // Scroll Animation controls
  scrollConfig: ScrollAnimationConfig
  setScrollConfig: (config: ScrollAnimationConfig) => void
  scrollValues: ScrollAnimationValues
  
  // Vector text rotation controls
  enableVectorRotation: boolean
  setEnableVectorRotation: (value: boolean) => void
  vectorPerspective: number
  setVectorPerspective: (value: number) => void
  vectorRotateY: number
  setVectorRotateY: (value: number) => void
  vectorTranslateZ: number
  setVectorTranslateZ: (value: number) => void
  vectorRotateX: number
  setVectorRotateX: (value: number) => void
  
  // 3D Logo animation parameters
  modelLerpFactor: number
  setModelLerpFactor: (value: number) => void
  activeRotation: [number, number, number]
  setActiveRotation: (value: [number, number, number]) => void
  activeTranslation: [number, number, number]
  setActiveTranslation: (value: [number, number, number]) => void
  activeScale: number
  setActiveScale: (value: number) => void
  
  // Separate lerp factors for activation and deactivation
  activationLerpFactor: number
  setActivationLerpFactor: (value: number) => void
  deactivationLerpFactor: number
  setDeactivationLerpFactor: (value: number) => void
  
  // Control if effects should be disabled when isRotated is true
  disableEffectsWhenRotated: boolean
  setDisableEffectsWhenRotated: (value: boolean) => void
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
  invertGlow,
  setInvertGlow,
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
  setModelScale,
  scrollConfig,
  setScrollConfig,
  scrollValues,
  enableVectorRotation,
  setEnableVectorRotation,
  vectorPerspective,
  setVectorPerspective,
  vectorRotateY,
  setVectorRotateY,
  vectorTranslateZ,
  setVectorTranslateZ,
  vectorRotateX,
  setVectorRotateX,
  modelLerpFactor,
  setModelLerpFactor,
  activeRotation,
  setActiveRotation,
  activeTranslation,
  setActiveTranslation,
  activeScale,
  setActiveScale,
  activationLerpFactor,
  setActivationLerpFactor,
  deactivationLerpFactor,
  setDeactivationLerpFactor,
  disableEffectsWhenRotated,
  setDisableEffectsWhenRotated
}: ControlPanelProps) {
  const [exportSuccess, setExportSuccess] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    scrollAnimation: false,
    vectorRotation: false,
    interactive: false,
    logo: false,
    model: false,
    lighting: false
  })
  
  // Sub-sections for lighting
  const [openLightSections, setOpenLightSections] = useState({
    directional: false,
    point1: false,
    point2: false,
    point3: false,
    point4: false
  })
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }
  
  const toggleLightSection = (section: keyof typeof openLightSections) => {
    setOpenLightSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Export configuration to JSON
  const exportConfiguration = () => {
    const config: ConfigurationData = {
      // Logo settings
      fillColor: logoControls.fillColor,
      strokeWidth: logoControls.strokeWidth,
      strokeOpacity: logoControls.strokeOpacity,
      fillOpacity: logoControls.fillOpacity,
      backdropBlur: logoControls.backdropBlur,
      blendMode: logoControls.blendMode as string,
      glowColor: logoControls.glowColor,
      glowOpacity: logoControls.glowOpacity,
      glowIntensity: logoControls.glowIntensity,
      
      // Interactive effects
      enableDynamicGlow,
      invertGlow,
      enableRotation,
      enablePositioning,
      displacementCoeff,
      rotationCoeff,
      
      // Light settings
      lightSettings,
      
      // 3D Model
      modelColor,
      modelPosition,
      modelRotation,
      modelScale,
      
      // 3D Model animation
      modelLerpFactor,
      activeRotation,
      activeTranslation,
      activeScale,
      activationLerpFactor,
      deactivationLerpFactor,
      disableEffectsWhenRotated,
      
      // Vector text rotation
      enableVectorRotation,
      vectorPerspective,
      vectorRotateY,
      vectorTranslateZ,
      vectorRotateX
    }

    const jsonString = JSON.stringify(config, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `neodelta-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 2000)
  }

  // Import configuration from JSON
  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string) as ConfigurationData

        // Apply logo settings
        if (config.fillColor !== undefined) logoControls.setFillColor(config.fillColor)
        if (config.strokeWidth !== undefined) logoControls.setStrokeWidth(config.strokeWidth)
        if (config.strokeOpacity !== undefined) logoControls.setStrokeOpacity(config.strokeOpacity)
        if (config.fillOpacity !== undefined) logoControls.setFillOpacity(config.fillOpacity)
        if (config.backdropBlur !== undefined) logoControls.setBackdropBlur(config.backdropBlur)
        if (config.blendMode !== undefined) logoControls.setBlendMode(config.blendMode as React.CSSProperties['mixBlendMode'])
        if (config.glowColor !== undefined) logoControls.setGlowColor(config.glowColor)
        if (config.glowOpacity !== undefined) logoControls.setGlowOpacity(config.glowOpacity)
        if (config.glowIntensity !== undefined) logoControls.setGlowIntensity(config.glowIntensity)

        // Apply interactive effects
        if (config.enableDynamicGlow !== undefined) setEnableDynamicGlow(config.enableDynamicGlow)
        if (config.invertGlow !== undefined) setInvertGlow(config.invertGlow)
        if (config.enableRotation !== undefined) setEnableRotation(config.enableRotation)
        if (config.enablePositioning !== undefined) setEnablePositioning(config.enablePositioning)
        if (config.displacementCoeff !== undefined) setDisplacementCoeff(config.displacementCoeff)
        if (config.rotationCoeff !== undefined) setRotationCoeff(config.rotationCoeff)

        // Apply light settings
        if (config.lightSettings !== undefined) setLightSettings(config.lightSettings)

        // Apply 3D model settings
        if (config.modelColor !== undefined) setModelColor(config.modelColor)
        if (config.modelPosition !== undefined) setModelPosition(config.modelPosition)
        if (config.modelRotation !== undefined) setModelRotation(config.modelRotation)
        if (config.modelScale !== undefined) setModelScale(config.modelScale)
        
        // Apply 3D model animation settings
        if (config.modelLerpFactor !== undefined) setModelLerpFactor(config.modelLerpFactor)
        if (config.activeRotation !== undefined) setActiveRotation(config.activeRotation)
        if (config.activeTranslation !== undefined) setActiveTranslation(config.activeTranslation)
        if (config.activeScale !== undefined) setActiveScale(config.activeScale)
        if (config.activationLerpFactor !== undefined) setActivationLerpFactor(config.activationLerpFactor)
        if (config.deactivationLerpFactor !== undefined) setDeactivationLerpFactor(config.deactivationLerpFactor)
        if (config.disableEffectsWhenRotated !== undefined) setDisableEffectsWhenRotated(config.disableEffectsWhenRotated)

        // Apply vector text rotation settings
        if (config.enableVectorRotation !== undefined) setEnableVectorRotation(config.enableVectorRotation)
        if (config.vectorPerspective !== undefined) setVectorPerspective(config.vectorPerspective)
        if (config.vectorRotateY !== undefined) setVectorRotateY(config.vectorRotateY)
        if (config.vectorTranslateZ !== undefined) setVectorTranslateZ(config.vectorTranslateZ)
        if (config.vectorRotateX !== undefined) setVectorRotateX(config.vectorRotateX)

        setImportSuccess(true)
        setTimeout(() => setImportSuccess(false), 2000)
      } catch (error) {
        console.error('Error parsing configuration file:', error)
        alert('Erreur lors de l\'importation du fichier de configuration')
      }
    }
    reader.readAsText(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
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
      {/* Scroll Animation Section - Top priority for testing */}
      <ScrollAnimationControls
        config={scrollConfig}
        setConfig={setScrollConfig}
        values={scrollValues}
        isOpen={openSections.scrollAnimation}
        onToggle={() => toggleSection('scrollAnimation')}
      />

      {/* Vector Text Rotation Section */}
      <CollapsibleSection
        title="Rotation Logotype"
        isOpen={openSections.vectorRotation}
        onToggle={() => toggleSection('vectorRotation')}
      >
        <div style={{ marginBottom: '10px' }}>
          {/* Enable/Disable Rotation */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px', fontSize: '9px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={enableVectorRotation}
              onChange={(e) => setEnableVectorRotation(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Activer la rotation miroir</span>
          </label>

          {/* Perspective */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Perspective</span>
              <input
                type="number"
                step="10"
                value={vectorPerspective}
                onChange={(e) => setVectorPerspective(Number(e.target.value))}
                style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="100"
              max="3000"
              step="10"
              value={vectorPerspective}
              onChange={(e) => setVectorPerspective(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Rotate Y (main rotation) */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Rotation Y (deg)</span>
              <input
                type="number"
                step="1"
                value={vectorRotateY}
                onChange={(e) => setVectorRotateY(Number(e.target.value))}
                style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={vectorRotateY}
              onChange={(e) => setVectorRotateY(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Translate Z (depth) */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Profondeur Z (px)</span>
              <input
                type="number"
                step="10"
                value={vectorTranslateZ}
                onChange={(e) => setVectorTranslateZ(Number(e.target.value))}
                style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-1000"
              max="1000"
              step="10"
              value={vectorTranslateZ}
              onChange={(e) => setVectorTranslateZ(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Rotate X (tilt) */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Inclinaison X (deg)</span>
              <input
                type="number"
                step="1"
                value={vectorRotateX}
                onChange={(e) => setVectorRotateX(Number(e.target.value))}
                style={{ width: '60px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-90"
              max="90"
              step="1"
              value={vectorRotateX}
              onChange={(e) => setVectorRotateX(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setVectorPerspective(1000)
              setVectorRotateY(180)
              setVectorTranslateZ(-400)
              setVectorRotateX(5)
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
            Reset Rotation
          </button>
        </div>
      </CollapsibleSection>

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

          {enableDynamicGlow && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', marginLeft: '20px', fontSize: '9px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={invertGlow}
                onChange={(e) => setInvertGlow(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Inverser la lueur</span>
            </label>
          )}

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
        title='Logotype Vectoriel'
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

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
            <span>Glow Intensity</span>
            <span>{logoControls.glowIntensity.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.01"
            value={logoControls.glowIntensity}
            onChange={(e) => logoControls.setGlowIntensity(parseFloat(e.target.value))}
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
            logoControls.setGlowIntensity(1)
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
        title="Logomark 3D"
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
        
        {/* Animation Parameters Section */}
        <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '10px', color: 'rgba(255, 165, 0, 0.9)' }}>
            Paramètres d'Animation
          </div>
          
          {/* Toggle for disabling effects when rotated */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px', fontSize: '9px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={disableEffectsWhenRotated}
              onChange={(e) => setDisableEffectsWhenRotated(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Désactiver les effets en rotation</span>
          </label>
          
          {/* Lerp Factor (Smoothness) - Legacy control for general use */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Fluidité Générale</span>
              <input
                type="number"
                step="0.01"
                value={modelLerpFactor}
                onChange={(e) => setModelLerpFactor(Number(e.target.value))}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={modelLerpFactor}
              onChange={(e) => setModelLerpFactor(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
              Plus bas = plus fluide (0.01-1)
            </div>
          </div>
          
          {/* Activation Lerp Factor */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Fluidité Activation</span>
              <input
                type="number"
                step="0.01"
                value={activationLerpFactor}
                onChange={(e) => setActivationLerpFactor(Number(e.target.value))}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={activationLerpFactor}
              onChange={(e) => setActivationLerpFactor(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
              Fluidité lors de l'activation de la rotation
            </div>
          </div>
          
          {/* Deactivation Lerp Factor */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Fluidité Désactivation</span>
              <input
                type="number"
                step="0.01"
                value={deactivationLerpFactor}
                onChange={(e) => setDeactivationLerpFactor(Number(e.target.value))}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={deactivationLerpFactor}
              onChange={(e) => setDeactivationLerpFactor(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
              Fluidité lors de la désactivation de la rotation
            </div>
          </div>
          
          {/* Active Rotation X */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Rotation Active X (rad)</span>
              <input
                type="number"
                step="0.1"
                value={activeRotation[0].toFixed(2)}
                onChange={(e) => setActiveRotation([Number(e.target.value), activeRotation[1], activeRotation[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min={-Math.PI * 2}
              max={Math.PI * 2}
              step="0.1"
              value={activeRotation[0]}
              onChange={(e) => setActiveRotation([Number(e.target.value), activeRotation[1], activeRotation[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Active Rotation Y */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Rotation Active Y (rad)</span>
              <input
                type="number"
                step="0.1"
                value={activeRotation[1].toFixed(2)}
                onChange={(e) => setActiveRotation([activeRotation[0], Number(e.target.value), activeRotation[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min={-Math.PI * 2}
              max={Math.PI * 2}
              step="0.1"
              value={activeRotation[1]}
              onChange={(e) => setActiveRotation([activeRotation[0], Number(e.target.value), activeRotation[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Active Rotation Z */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Rotation Active Z (rad)</span>
              <input
                type="number"
                step="0.1"
                value={activeRotation[2].toFixed(2)}
                onChange={(e) => setActiveRotation([activeRotation[0], activeRotation[1], Number(e.target.value)])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min={-Math.PI * 2}
              max={Math.PI * 2}
              step="0.1"
              value={activeRotation[2]}
              onChange={(e) => setActiveRotation([activeRotation[0], activeRotation[1], Number(e.target.value)])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Active Translation X */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Translation Active X</span>
              <input
                type="number"
                step="0.1"
                value={activeTranslation[0].toFixed(2)}
                onChange={(e) => setActiveTranslation([Number(e.target.value), activeTranslation[1], activeTranslation[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={activeTranslation[0]}
              onChange={(e) => setActiveTranslation([Number(e.target.value), activeTranslation[1], activeTranslation[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Active Translation Y */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Translation Active Y</span>
              <input
                type="number"
                step="0.1"
                value={activeTranslation[1].toFixed(2)}
                onChange={(e) => setActiveTranslation([activeTranslation[0], Number(e.target.value), activeTranslation[2]])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={activeTranslation[1]}
              onChange={(e) => setActiveTranslation([activeTranslation[0], Number(e.target.value), activeTranslation[2]])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Active Translation Z */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Translation Active Z</span>
              <input
                type="number"
                step="0.1"
                value={activeTranslation[2].toFixed(2)}
                onChange={(e) => setActiveTranslation([activeTranslation[0], activeTranslation[1], Number(e.target.value)])}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={activeTranslation[2]}
              onChange={(e) => setActiveTranslation([activeTranslation[0], activeTranslation[1], Number(e.target.value)])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          {/* Active Scale */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
              <span>Scale Active (multiplicateur)</span>
              <input
                type="number"
                step="0.1"
                value={activeScale.toFixed(2)}
                onChange={(e) => setActiveScale(Number(e.target.value))}
                style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
              />
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={activeScale}
              onChange={(e) => setActiveScale(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
              1 = taille normale, &lt;1 = plus petit, &gt;1 = plus grand
            </div>
          </div>
          
          {/* Reset Button for Animation Params */}
          <button
            onClick={() => {
              setModelLerpFactor(0.07)
              setActivationLerpFactor(0.07)
              setDeactivationLerpFactor(0.07)
              setActiveRotation([0, Math.PI, 0])
              setActiveTranslation([15.9, 1.6, 0])
              setActiveScale(2.1)
              setDisableEffectsWhenRotated(true)
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
            Reset Animation
          </button>
        </div>
      </CollapsibleSection>

      {/* Lighting Section - All lights in one dropdown */}
      <CollapsibleSection
        title="Éclairage"
        isOpen={openSections.lighting}
        onToggle={() => toggleSection('lighting')}
      >
        {/* Directional Light Sub-section */}
        <div style={{ marginBottom: '8px' }}>
          <button
            onClick={() => toggleLightSection('directional')}
            style={{
              width: '100%',
              padding: '6px 8px',
              backgroundColor: openLightSections.directional ? 'rgba(255, 200, 50, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '1px solid rgba(255, 200, 50, 0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Directional Light</span>
            <span>{openLightSections.directional ? '▼' : '▶'}</span>
          </button>
          
          {openLightSections.directional && (
            <div style={{ padding: '8px', backgroundColor: 'rgba(255, 200, 50, 0.05)', borderRadius: '0 0 4px 4px', marginTop: '-1px' }}>
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
              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>Color</label>
                <input
                  type="color"
                  value={lightSettings.directional.color}
                  onChange={(e) => updateDirectionalLight('color', e.target.value)}
                  style={{ width: '100%', height: '25px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Point Light 1 Sub-section */}
        <div style={{ marginBottom: '8px' }}>
          <button
            onClick={() => toggleLightSection('point1')}
            style={{
              width: '100%',
              padding: '6px 8px',
              backgroundColor: openLightSections.point1 ? 'rgba(100, 149, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '1px solid rgba(100, 149, 237, 0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Point Light 1</span>
            <span>{openLightSections.point1 ? '▼' : '▶'}</span>
          </button>
          
          {openLightSections.point1 && (
            <div style={{ padding: '8px', backgroundColor: 'rgba(100, 149, 237, 0.05)', borderRadius: '0 0 4px 4px', marginTop: '-1px' }}>
              <PointLightControls
                light={lightSettings.point1}
                onUpdate={(key, value) => updatePointLight('point1', key, value)}
              />
            </div>
          )}
        </div>

        {/* Point Light 2 Sub-section */}
        <div style={{ marginBottom: '8px' }}>
          <button
            onClick={() => toggleLightSection('point2')}
            style={{
              width: '100%',
              padding: '6px 8px',
              backgroundColor: openLightSections.point2 ? 'rgba(50, 205, 50, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '1px solid rgba(50, 205, 50, 0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Point Light 2</span>
            <span>{openLightSections.point2 ? '▼' : '▶'}</span>
          </button>
          
          {openLightSections.point2 && (
            <div style={{ padding: '8px', backgroundColor: 'rgba(50, 205, 50, 0.05)', borderRadius: '0 0 4px 4px', marginTop: '-1px' }}>
              <PointLightControls
                light={lightSettings.point2}
                onUpdate={(key, value) => updatePointLight('point2', key, value)}
              />
            </div>
          )}
        </div>

        {/* Point Light 3 Sub-section */}
        <div style={{ marginBottom: '8px' }}>
          <button
            onClick={() => toggleLightSection('point3')}
            style={{
              width: '100%',
              padding: '6px 8px',
              backgroundColor: openLightSections.point3 ? 'rgba(255, 99, 71, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '1px solid rgba(255, 99, 71, 0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Point Light 3</span>
            <span>{openLightSections.point3 ? '▼' : '▶'}</span>
          </button>
          
          {openLightSections.point3 && (
            <div style={{ padding: '8px', backgroundColor: 'rgba(255, 99, 71, 0.05)', borderRadius: '0 0 4px 4px', marginTop: '-1px' }}>
              <PointLightControls
                light={lightSettings.point3}
                onUpdate={(key, value) => updatePointLight('point3', key, value)}
              />
            </div>
          )}
        </div>

        {/* Point Light 4 Sub-section */}
        <div style={{ marginBottom: '8px' }}>
          <button
            onClick={() => toggleLightSection('point4')}
            style={{
              width: '100%',
              padding: '6px 8px',
              backgroundColor: openLightSections.point4 ? 'rgba(148, 0, 211, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              border: '1px solid rgba(148, 0, 211, 0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Point Light 4</span>
            <span>{openLightSections.point4 ? '▼' : '▶'}</span>
          </button>
          
          {openLightSections.point4 && (
            <div style={{ padding: '8px', backgroundColor: 'rgba(148, 0, 211, 0.05)', borderRadius: '0 0 4px 4px', marginTop: '-1px' }}>
              <PointLightControls
                light={lightSettings.point4}
                onUpdate={(key, value) => updatePointLight('point4', key, value)}
              />
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Import/Export Configuration Section */}
      <div style={{
        marginTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        paddingTop: '10px'
      }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          Configuration
        </div>
        
        <button
          onClick={exportConfiguration}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: exportSuccess ? '#28a745' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '9px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
            marginBottom: '6px'
          }}
        >
          {exportSuccess ? '✓ Exporté!' : '⬇ Exporter (JSON)'}
        </button>

        <button
          onClick={triggerFileInput}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: importSuccess ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '9px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
        >
          {importSuccess ? '✓ Importé!' : '⬆ Importer (JSON)'}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importConfiguration}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
