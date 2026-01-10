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
  glowIntensity: number
  setGlowIntensity: (value: number) => void
}

/**
 * Scene component props
 */
export interface SceneProps {
  mouseRotationX?: number
  mouseRotationY?: number
  enableRotation?: boolean
  // Rotation toggle
  isRotated: boolean
  // Light and model settings
  lights: LightSettings
  modelColor: string
  modelPosition: [number, number, number]
  modelRotation: [number, number, number]
  modelScale: number
  // Animation parameters
  modelLerpFactor: number
  activeRotation: [number, number, number]
  activeTranslation: [number, number, number]
  activeScale: number
}
