import { useState, useEffect, useCallback, useRef } from 'react'
import { scrollSections, type SectionConfig } from '../data/scrollSectionsConfig'

export interface SectionPositionState {
  currentSection: SectionConfig
  previousSection: SectionConfig | null
  progress: number // 0 to 1, transition progress between sections
  sectionIndex: number
  isTransitioning: boolean
}

export interface InterpolatedValues {
  model: {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: number
  }
  vector: {
    position: { x: number; y: number }
    scale: number
    opacity: number
    rotation: number
  }
  effects: {
    enableMouseTracking: boolean
    enableGlow: boolean
    blurBackground: boolean
  }
}

// Linear interpolation
function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

// Smooth easing function
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function useSectionPosition(lerpFactor: number = 0.1): SectionPositionState & InterpolatedValues {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [rawProgress, setRawProgress] = useState(0)
  const [smoothProgress, setSmoothProgress] = useState(0)
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Detect which section is currently visible
  const detectVisibleSection = useCallback(() => {
    const sections = document.querySelectorAll('.hero-section, .services-section, .portfolio-section, .about-section, .contact-section')
    
    if (sections.length === 0) return

    const windowHeight = window.innerHeight
    const scrollY = window.scrollY
    const viewportMiddle = scrollY + windowHeight / 2

    let closestIndex = 0
    let closestDistance = Infinity

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + scrollY
      const sectionMiddle = sectionTop + rect.height / 2
      const distance = Math.abs(viewportMiddle - sectionMiddle)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setSectionIndex(closestIndex)

    // Calculate progress within the current section
    const currentSection = sections[closestIndex]
    const rect = currentSection.getBoundingClientRect()
    const sectionTop = rect.top + scrollY
    const sectionHeight = rect.height

    // Progress from -0.5 (section entering) to 0.5 (section leaving)
    const relativeScroll = viewportMiddle - (sectionTop + sectionHeight / 2)
    const normalizedProgress = relativeScroll / sectionHeight
    
    setRawProgress(Math.max(-0.5, Math.min(0.5, normalizedProgress)))
  }, [])

  // Smooth progress interpolation
  useEffect(() => {
    const animate = () => {
      setSmoothProgress(prev => {
        const diff = rawProgress - prev
        if (Math.abs(diff) < 0.001) return rawProgress
        return prev + diff * lerpFactor
      })
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [rawProgress, lerpFactor])

  // Set up scroll listener
  useEffect(() => {
    detectVisibleSection()
    
    const handleScroll = () => {
      detectVisibleSection()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', detectVisibleSection, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', detectVisibleSection)
    }
  }, [detectVisibleSection])

  // Get current and next section for interpolation
  const currentSection = scrollSections[sectionIndex] || scrollSections[0]
  const nextSectionIndex = Math.min(sectionIndex + 1, scrollSections.length - 1)
  const nextSection = scrollSections[nextSectionIndex]
  const previousSectionIndex = Math.max(sectionIndex - 1, 0)
  const previousSection = sectionIndex > 0 ? scrollSections[previousSectionIndex] : null

  // Determine if we're transitioning and which direction
  const isTransitioning = Math.abs(smoothProgress) > 0.2
  const transitionProgress = smoothProgress > 0 
    ? Math.max(0, (smoothProgress - 0.2) / 0.3) // Transitioning to next
    : Math.max(0, (-smoothProgress - 0.2) / 0.3) // Transitioning to previous

  const easedProgress = easeInOutCubic(Math.min(1, transitionProgress))

  // Interpolate model values
  const targetSection = smoothProgress > 0 ? nextSection : (previousSection || currentSection)
  
  const interpolatedModel = {
    position: [
      lerp(currentSection.model?.position[0] || 0, targetSection.model?.position[0] || 0, easedProgress),
      lerp(currentSection.model?.position[1] || 0, targetSection.model?.position[1] || 0, easedProgress),
      lerp(currentSection.model?.position[2] || 0, targetSection.model?.position[2] || 0, easedProgress)
    ] as [number, number, number],
    rotation: [
      lerp(currentSection.model?.rotation[0] || 0, targetSection.model?.rotation[0] || 0, easedProgress),
      lerp(currentSection.model?.rotation[1] || 0, targetSection.model?.rotation[1] || 0, easedProgress),
      lerp(currentSection.model?.rotation[2] || 0, targetSection.model?.rotation[2] || 0, easedProgress)
    ] as [number, number, number],
    scale: lerp(currentSection.model?.scale || 1, targetSection.model?.scale || 1, easedProgress)
  }

  // Interpolate vector values
  const interpolatedVector = {
    position: {
      x: lerp(currentSection.vector?.position.x || 0, targetSection.vector?.position.x || 0, easedProgress),
      y: lerp(currentSection.vector?.position.y || 0, targetSection.vector?.position.y || 0, easedProgress)
    },
    scale: lerp(currentSection.vector?.scale || 1, targetSection.vector?.scale || 1, easedProgress),
    opacity: lerp(currentSection.vector?.opacity || 1, targetSection.vector?.opacity || 1, easedProgress),
    rotation: lerp(currentSection.vector?.rotation || 0, targetSection.vector?.rotation || 0, easedProgress)
  }

  // Effects (use current section's effects)
  const interpolatedEffects = {
    enableMouseTracking: currentSection.effects?.enableMouseTracking ?? true,
    enableGlow: currentSection.effects?.enableGlow ?? true,
    blurBackground: currentSection.effects?.blurBackground ?? true
  }

  return {
    currentSection,
    previousSection,
    progress: smoothProgress,
    sectionIndex,
    isTransitioning,
    model: interpolatedModel,
    vector: interpolatedVector,
    effects: interpolatedEffects
  }
}