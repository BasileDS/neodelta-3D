import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export default function ResettableControls() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  // Position et cible initiales
  const initialPosition = new THREE.Vector3(0, 0, 20)
  const initialTarget = new THREE.Vector3(0, 0, 0)

  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const idleDelay = 1000 // ms avant reset

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const onStart = () => setLastInteraction(Date.now())
    controls.addEventListener('start', onStart)

    return () => {
      controls.removeEventListener('start', onStart)
    }
  }, [])

  useFrame(() => {
    const now = Date.now()
    if (now - lastInteraction > idleDelay && controlsRef.current) {
      camera.position.lerp(initialPosition, 0.05)
      controlsRef.current.target.lerp(initialTarget, 0.05)
      controlsRef.current.update()
    }
  })

  // Fix for non-passive wheel event listener warning
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const domElement = controls.domElement
    if (!domElement) return

    // Store original addEventListener
    const originalAddEventListener = domElement.addEventListener.bind(domElement)
    
    // Override addEventListener to make wheel events passive
    domElement.addEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      if (type === 'wheel') {
        const newOptions = typeof options === 'boolean' 
          ? { capture: options, passive: true }
          : { ...options, passive: true }
        return originalAddEventListener(type, listener, newOptions)
      }
      return originalAddEventListener(type, listener, options)
    }

    // Force reconnect to apply new event listeners
    controls.dispose()
    controls.connect(domElement)

    return () => {
      domElement.addEventListener = originalAddEventListener
    }
  }, [])

  return (
    <OrbitControls 
      ref={controlsRef} 
      enableZoom={false} 
      enableRotate={true} 
      enablePan={true}
      makeDefault
    />
  )
}
