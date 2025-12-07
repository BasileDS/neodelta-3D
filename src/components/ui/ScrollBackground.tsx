import { useEffect, useState } from 'react'
import { DEFAULT_BACKGROUND, BACKGROUND_ZONES } from '../../data/backgroundConfig'

/**
 * Composant ScrollBackground
 * 
 * Gère le background de la page en fonction du scroll.
 * Le background par défaut est toujours appliqué sauf dans les zones définies.
 * Les transitions entre les backgrounds sont fluides.
 */

const ScrollBackground = () => {
  const [background, setBackground] = useState(DEFAULT_BACKGROUND)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      // Si aucune zone n'est définie, on garde le background par défaut
      if (BACKGROUND_ZONES.length === 0) {
        setBackground(DEFAULT_BACKGROUND)
        return
      }

      // Chercher si on est dans une zone de scroll spécifique
      let newBackground = DEFAULT_BACKGROUND
      
      for (const zone of BACKGROUND_ZONES) {
        // Si on est dans la zone de transition
        if (scrollY >= zone.scrollStart && scrollY <= zone.scrollEnd) {
          newBackground = zone.background
          break
        }
      }

      setBackground(newBackground)
    }

    // Initialiser au chargement
    handleScroll()

    // Écouter le scroll
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: background,
        zIndex: -1,
        transition: 'background 0.5s ease-in-out'
      }}
    />
  )
}

export default ScrollBackground
