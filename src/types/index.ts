import type React from 'react'

/**
 * Point light configuration settings
 */
export interface PointLightSettings {
  position: [number, number, number]
  intensity: number
  color: string
}

/**
 * Light configuration for the scene
 */
export interface LightSettings {
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

/**
 * Logo styling controls
 */
export interface LogoControls {
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

/**
 * Scene component props
 */
export interface SceneProps {
  logoControls: LogoControls
  mouseRotationX?: number
  mouseRotationY?: number
  enableRotation?: boolean
  // Interactive effects controls
  enableDynamicGlow: boolean
  setEnableDynamicGlow: (value: boolean) => void
  invertGlow: boolean
  setInvertGlow: (value: boolean) => void
  setEnableRotation: (value: boolean) => void
  enablePositioning: boolean
  setEnablePositioning: (value: boolean) => void
  displacementCoeff: number
  setDisplacementCoeff: (value: number) => void
  rotationCoeff: number
  setRotationCoeff: (value: number) => void
  mousePos: { x: number; y: number }
  showControls: boolean
  setShowControls: (value: boolean) => void
}
