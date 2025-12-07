import { useState, useEffect, useRef } from 'react'
import type React from 'react'
import './App.css'
import Scene from './Scene'
import VectorLogotype from './VectorLogotype'

const title = {
  fontSize: '1.4rem',
  fontWeight: 600,
  position: 'fixed' as const,
  top: '1rem',
  left: '2rem',
  zIndex: 10,
}


function App() {
  const [fillColor, setFillColor] = useState('#ffffff53')
  const [strokeWidth, setStrokeWidth] = useState('0.5')
  const [strokeOpacity, setStrokeOpacity] = useState(1)
  const [fillOpacity, setFillOpacity] = useState(1)
  const [backdropBlur, setBackdropBlur] = useState('7.58px')
  const [blendMode, setBlendMode] = useState<React.CSSProperties['mixBlendMode']>('plus-lighter')
  const [glowColor, setGlowColor] = useState('white')
  const [glowOpacity, setGlowOpacity] = useState(0.5)

  // Mouse tracking and interactive effects state
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [enableDynamicGlow, setEnableDynamicGlow] = useState(true)
  const [enableRotation, setEnableRotation] = useState(true)
  const [enablePositioning, setEnablePositioning] = useState(true)
  const [displacementCoeff, setDisplacementCoeff] = useState(0.03)
  const [rotationCoeff, setRotationCoeff] = useState(0.3)
  const [showControls, setShowControls] = useState(false)
  
  const animationFrameRef = useRef<number | null>(null)
  const currentPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

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

  // Calculate dynamic values based on mouse position
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  // Calculate angle from center to mouse (in degrees)
  const deltaX = mousePos.x - centerX
  const deltaY = mousePos.y - centerY
  const glowAngle = enableDynamicGlow
    ? Math.atan2(deltaY, deltaX) * (180 / Math.PI)
    : 45

  // Calculate rotation based on mouse X and Y position
  // X axis rotation based on mouse Y, Y axis rotation based on mouse X
  const rotationX = enableRotation
    ? ((mousePos.y - centerY) / centerY) * rotationCoeff * 100
    : 0
  const rotationY = enableRotation
    ? ((mousePos.x - centerX) / centerX) * rotationCoeff * 100
    : 0

  // Calculate positioning offset based on mouse position
  const translateX = enablePositioning
    ? (mousePos.x - centerX) * displacementCoeff
    : 0
  const translateY = enablePositioning
    ? (mousePos.y - centerY) * displacementCoeff
    : 0

  return (
    <>
      <h1 style={title}>Neodelta <em>Playground</em></h1>
      <Scene
        logoControls={{
          fillColor,
          setFillColor,
          strokeWidth,
          setStrokeWidth,
          strokeOpacity,
          setStrokeOpacity,
          fillOpacity,
          setFillOpacity,
          backdropBlur,
          setBackdropBlur,
          blendMode,
          setBlendMode,
          glowColor,
          setGlowColor,
          glowOpacity,
          setGlowOpacity
        }}
        mouseRotationX={rotationX}
        mouseRotationY={rotationY}
        enableRotation={enableRotation}
        enableDynamicGlow={enableDynamicGlow}
        setEnableDynamicGlow={setEnableDynamicGlow}
        setEnableRotation={setEnableRotation}
        enablePositioning={enablePositioning}
        setEnablePositioning={setEnablePositioning}
        displacementCoeff={displacementCoeff}
        setDisplacementCoeff={setDisplacementCoeff}
        rotationCoeff={rotationCoeff}
        setRotationCoeff={setRotationCoeff}
        mousePos={mousePos}
        showControls={showControls}
        setShowControls={setShowControls}
      />
      <div className='square'>
        <VectorLogotype
          fillColor={fillColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
          fillOpacity={fillOpacity}
          backdropBlur={backdropBlur}
          blendMode={blendMode}
          glowColor={glowColor}
          glowOpacity={glowOpacity}
          glowAngle={glowAngle}
          translateX={translateX}
          translateY={translateY}
        />
      </div>
    </>
  )
}

export default App
