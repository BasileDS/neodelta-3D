/**
 * Configuration des backgrounds qui changent selon la position du scroll
 * 
 * Chaque zone définit:
 * - scrollStart: position de scroll (en pixels) où le background commence à changer
 * - scrollEnd: position de scroll (en pixels) où le background finit de changer
 * - background: le CSS background à appliquer
 */

export interface BackgroundZone {
  scrollStart: number
  scrollEnd: number
  background: string
}

// Background par défaut (utilisé quand aucune zone n'est active)
export const DEFAULT_BACKGROUND = 'radial-gradient(circle, #0D3057 0%, #172546 48%, #09091C 100%)'

// Zones de scroll avec backgrounds spécifiques
// Laissez ce tableau vide pour toujours utiliser le background par défaut
export const BACKGROUND_ZONES: BackgroundZone[] = [
  // Exemple: changer le background entre 1000px et 1500px de scroll
  // {
  //   scrollStart: 1000,
  //   scrollEnd: 1500,
  //   background: 'radial-gradient(circle, #1a0033 0%, #0f001a 48%, #05000d 100%)'
  // },
  
  // Exemple: autre zone entre 2500px et 3000px
  // {
  //   scrollStart: 2500,
  //   scrollEnd: 3000,
  //   background: 'linear-gradient(180deg, #001a33 0%, #000d1a 50%, #000000 100%)'
  // }
]
