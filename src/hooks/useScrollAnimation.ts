import { useState, useEffect, useCallback, useRef } from 'react'

export interface ScrollAnimationConfig {
  // Enable/disable individual animations
  enableScrollRotation: boolean
  enableScrollScale: boolean
  enableScrollPosition: boolean
  enableScrollOpacity: boolean
  
  // Rotation settings
  rotationAxis: 'x' | 'y' | 'z' | 'all'
  rotationSpeed: number // multiplier for rotation amount
  rotationRange: number // max rotation in radians
  
  // Scale settings
  scaleMin: number
  scaleMax: number
  scaleEasing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  
  // Position settings
  positionAxis: 'x' | 'y' | 'z' | 'all'
  positionRange: number // max displacement
  positionDirection: 'positive' | 'negative' | 'both'
  
  // Opacity settings (for 2D elements)
  opacityMin: number
  opacityMax: number
  opacityInvert: boolean // fade out instead of fade in
  
  // Scroll behavior
  scrollSmoothing: number // 0-1, higher = smoother
  scrollThreshold: number // pixels before animation starts
  scrollRange: number // pixels for full animation (0 = use document height)
}

export interface ScrollAnimationValues {
  // Raw scroll values
  scrollY: number
  scrollProgress: number // 0 to 1
  scrollDirection: 'up' | 'down' | 'none'
  
  // Computed animation values
  rotation: [number, number, number]
  scale: number
  position: [number, number, number]
  opacity: number
  
  // Velocity for momentum-based effects
  scrollVelocity: number
}

export const defaultScrollConfig: ScrollAnimationConfig = {
  enableScrollRotation: false,
  enableScrollScale: false,
  enableScrollPosition: false,
  enableScrollOpacity: false,
  
  rotationAxis: 'y',
  rotationSpeed: 1,
  rotationRange: Math.PI * 2,
  
  scaleMin: 0.5,
  scaleMax: 1.5,
  scaleEasing: 'easeInOut',
  
  positionAxis: 'y',
  positionRange: 5,
  positionDirection: 'both',
  
  opacityMin: 0,
  opacityMax: 1,
  opacityInvert: false,
  
  scrollSmoothing: 0.1,
  scrollThreshold: 0,
  scrollRange: 0
}

// Easing functions
const easings = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export function useScrollAnimation(config: ScrollAnimationConfig): ScrollAnimationValues {
  const [scrollY, setScrollY] = useState(0)
  const [smoothScrollY, setSmoothScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none')
  const [scrollVelocity, setScrollVelocity] = useState(0)
  
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Handle scroll event
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const currentTime = Date.now()
    const timeDelta = currentTime - lastTime.current
    
    // Calculate velocity
    if (timeDelta > 0) {
      const velocity = (currentScrollY - lastScrollY.current) / timeDelta * 1000
      setScrollVelocity(velocity)
    }
    
    // Determine direction
    if (currentScrollY > lastScrollY.current) {
      setScrollDirection('down')
    } else if (currentScrollY < lastScrollY.current) {
      setScrollDirection('up')
    }
    
    lastScrollY.current = currentScrollY
    lastTime.current = currentTime
    setScrollY(currentScrollY)
  }, [])

  // Smooth scroll interpolation
  useEffect(() => {
    const smoothing = config.scrollSmoothing
    
    const animate = () => {
      setSmoothScrollY(prev => {
        const diff = scrollY - prev
        if (Math.abs(diff) < 0.1) return scrollY
        return prev + diff * smoothing
      })
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [scrollY, config.scrollSmoothing])

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Calculate scroll progress
  const getScrollProgress = useCallback(() => {
    const threshold = config.scrollThreshold
    const scrollRange = config.scrollRange || (document.documentElement.scrollHeight - window.innerHeight)
    
    const adjustedScroll = Math.max(0, smoothScrollY - threshold)
    const progress = Math.min(1, adjustedScroll / Math.max(1, scrollRange - threshold))
    
    return progress
  }, [smoothScrollY, config.scrollThreshold, config.scrollRange])

  // Calculate rotation based on scroll
  const calculateRotation = useCallback((): [number, number, number] => {
    if (!config.enableScrollRotation) return [0, 0, 0]
    
    const progress = getScrollProgress()
    const rotation = progress * config.rotationRange * config.rotationSpeed
    
    switch (config.rotationAxis) {
      case 'x': return [rotation, 0, 0]
      case 'y': return [0, rotation, 0]
      case 'z': return [0, 0, rotation]
      case 'all': return [rotation, rotation, rotation]
      default: return [0, 0, 0]
    }
  }, [config, getScrollProgress])

  // Calculate scale based on scroll
  const calculateScale = useCallback(() => {
    if (!config.enableScrollScale) return 1
    
    const progress = getScrollProgress()
    const easedProgress = easings[config.scaleEasing](progress)
    
    return config.scaleMin + (config.scaleMax - config.scaleMin) * easedProgress
  }, [config, getScrollProgress])

  // Calculate position based on scroll
  const calculatePosition = useCallback((): [number, number, number] => {
    if (!config.enableScrollPosition) return [0, 0, 0]
    
    const progress = getScrollProgress()
    let displacement = progress * config.positionRange
    
    if (config.positionDirection === 'negative') {
      displacement = -displacement
    } else if (config.positionDirection === 'both') {
      displacement = (progress - 0.5) * 2 * config.positionRange
    }
    
    switch (config.positionAxis) {
      case 'x': return [displacement, 0, 0]
      case 'y': return [0, displacement, 0]
      case 'z': return [0, 0, displacement]
      case 'all': return [displacement, displacement, displacement]
      default: return [0, 0, 0]
    }
  }, [config, getScrollProgress])

  // Calculate opacity based on scroll
  const calculateOpacity = useCallback(() => {
    if (!config.enableScrollOpacity) return 1
    
    const progress = getScrollProgress()
    let opacity = config.opacityMin + (config.opacityMax - config.opacityMin) * progress
    
    if (config.opacityInvert) {
      opacity = config.opacityMax - (config.opacityMax - config.opacityMin) * progress
    }
    
    return Math.max(0, Math.min(1, opacity))
  }, [config, getScrollProgress])

  return {
    scrollY: smoothScrollY,
    scrollProgress: getScrollProgress(),
    scrollDirection,
    scrollVelocity,
    rotation: calculateRotation(),
    scale: calculateScale(),
    position: calculatePosition(),
    opacity: calculateOpacity()
  }
}

// Preset configurations for common effects
export const scrollPresets = {
  spinOnScroll: {
    ...defaultScrollConfig,
    enableScrollRotation: true,
    rotationAxis: 'y' as const,
    rotationSpeed: 2,
    rotationRange: Math.PI * 4
  },
  
  scaleOnScroll: {
    ...defaultScrollConfig,
    enableScrollScale: true,
    scaleMin: 0.5,
    scaleMax: 1.2,
    scaleEasing: 'easeOut' as const
  },
  
  floatOnScroll: {
    ...defaultScrollConfig,
    enableScrollPosition: true,
    positionAxis: 'y' as const,
    positionRange: 3,
    positionDirection: 'both' as const
  },
  
  fadeOnScroll: {
    ...defaultScrollConfig,
    enableScrollOpacity: true,
    opacityMin: 0.2,
    opacityMax: 1,
    opacityInvert: false
  },
  
  parallax: {
    ...defaultScrollConfig,
    enableScrollPosition: true,
    positionAxis: 'y' as const,
    positionRange: 10,
    positionDirection: 'negative' as const,
    scrollSmoothing: 0.05
  },
  
  fullEffect: {
    ...defaultScrollConfig,
    enableScrollRotation: true,
    enableScrollScale: true,
    enableScrollPosition: true,
    rotationAxis: 'y' as const,
    rotationSpeed: 1,
    rotationRange: Math.PI,
    scaleMin: 0.8,
    scaleMax: 1.1,
    scaleEasing: 'easeInOut' as const,
    positionAxis: 'y' as const,
    positionRange: 2,
    positionDirection: 'both' as const
  }
}
