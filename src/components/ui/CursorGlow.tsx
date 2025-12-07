import { useMemo } from 'react'

interface CursorGlowProps {
  mousePos: { x: number; y: number }
  color?: string
  size?: number // Deprecated: use width and height instead
  width?: number // Width in vw units
  height?: number // Height in vh units
  opacity?: number
  enabled?: boolean
  displacementCoeff?: number // Coefficient to amplify/reduce movement (1 = normal, >1 = amplified, <1 = reduced)
}

// CSS-based cursor glow effect - more performant than 3D version
export default function CursorGlow({
  mousePos,
  color = '#117eddff',
  size,
  width = 40, // Default 40vw
  height = 60, // Default 60vh
  opacity = 1,
  enabled = true,
  displacementCoeff = 1
}: CursorGlowProps) {
  // Calculate center of screen
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  
  // Apply displacement coefficient from center
  const glowX = centerX + (mousePos.x - centerX) * displacementCoeff
  const glowY = centerY + (mousePos.y - centerY) * displacementCoeff

  // Convert glow position to percentage for the gradient
  const glowXPercent = (glowX / (typeof window !== 'undefined' ? window.innerWidth : 1)) * 100
  const glowYPercent = (glowY / (typeof window !== 'undefined' ? window.innerHeight : 1)) * 100

  // Use size as fallback for backward compatibility (converts px to approximate vw/vh)
  const effectiveWidth = size ? (size / (typeof window !== 'undefined' ? window.innerWidth : 1)) * 100 : width
  const effectiveHeight = size ? (size / (typeof window !== 'undefined' ? window.innerHeight : 1)) * 100 : height

  const style = useMemo(() => ({
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none' as const,
    zIndex: 0,
    background: enabled
      ? `radial-gradient(ellipse ${effectiveWidth}vw ${effectiveHeight}vh at ${glowXPercent}% ${glowYPercent}%, ${color} 0%, transparent 70%)`
      : 'transparent',
    opacity: enabled ? opacity : 0,
    transition: 'opacity 0.3s ease',
  }), [glowXPercent, glowYPercent, color, effectiveWidth, effectiveHeight, opacity, enabled])

  return <div style={style} />
}
