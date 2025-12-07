import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for tracking mouse position with smooth return-to-center animations
 * 
 * @param showControls - Flag to trigger return-to-center when controls panel opens
 * @returns Object containing current mouse position
 */
export function useMousePosition(showControls: boolean) {
  const [mousePos, setMousePos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  })
  
  const animationFrameRef = useRef<number | null>(null)
  const currentPosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  })
  const targetPosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  })

  // Continuous lerp animation
  useEffect(() => {
    const lerpSpeed = 0.15 // Adjust this value for smoother/faster tracking (0.1 = slower, 0.3 = faster)
    
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }
    
    const animateLerp = () => {
      const current = currentPosRef.current
      const target = targetPosRef.current
      
      const distance = Math.sqrt(
        Math.pow(target.x - current.x, 2) +
        Math.pow(target.y - current.y, 2)
      )
      
      // Only update if there's a significant distance
      if (distance >= 0.5) {
        const newPos = {
          x: lerp(current.x, target.x, lerpSpeed),
          y: lerp(current.y, target.y, lerpSpeed)
        }
        
        currentPosRef.current = newPos
        setMousePos(newPos)
      } else if (distance > 0) {
        // Snap to target when very close
        currentPosRef.current = { ...target }
        setMousePos({ ...target })
      }
      
      // Always continue the loop
      animationFrameRef.current = requestAnimationFrame(animateLerp)
    }
    
    // Start the lerp loop
    animationFrameRef.current = requestAnimationFrame(animateLerp)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Track mouse position with progressive reset
  useEffect(() => {
    const getCenterPos = () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    })
    
    const handleMouseMove = (e: MouseEvent) => {
      // Update target position, lerp loop will follow
      targetPosRef.current = { x: e.clientX, y: e.clientY }
    }
    
    const handleMouseLeave = () => {
      // Update target to center, lerp loop will smoothly move there
      const centerPos = getCenterPos()
      targetPosRef.current = centerPos
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Reset logo position when leaving the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Update target to center, lerp loop will smoothly move there
        const centerPos = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        }
        targetPosRef.current = centerPos
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Reset position when controls panel opens
  useEffect(() => {
    if (showControls) {
      // Update target to center, lerp loop will smoothly move there
      const centerPos = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }
      targetPosRef.current = centerPos
    }
  }, [showControls])

  return { mousePos }
}
