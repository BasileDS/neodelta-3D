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

  // Track mouse position with progressive reset
  useEffect(() => {
    const getCenterPos = () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    })
    
    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any ongoing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      const newPos = { x: e.clientX, y: e.clientY }
      currentPosRef.current = newPos
      setMousePos(newPos)
    }
    
    const handleMouseLeave = () => {
      // Animate to center when mouse leaves the page
      const duration = 800 // milliseconds
      const startTime = performance.now()
      const startPos = { ...currentPosRef.current }
      const centerPos = getCenterPos()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        const newPos = {
          x: startPos.x + (centerPos.x - startPos.x) * easeProgress,
          y: startPos.y + (centerPos.y - startPos.y) * easeProgress
        }
        
        currentPosRef.current = newPos
        setMousePos(newPos)
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          animationFrameRef.current = null
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
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
        // Reset mouse position to center when page is hidden
        setMousePos({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        })
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Reset position when controls panel opens
  useEffect(() => {
    if (showControls) {
      // Animate to center when controls open
      const duration = 800
      const startTime = performance.now()
      const startPos = { ...currentPosRef.current }
      const centerPos = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation (ease-out cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        const newPos = {
          x: startPos.x + (centerPos.x - startPos.x) * easeProgress,
          y: startPos.y + (centerPos.y - startPos.y) * easeProgress
        }
        
        currentPosRef.current = newPos
        setMousePos(newPos)
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          animationFrameRef.current = null
        }
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }, [showControls])

  return { mousePos }
}
