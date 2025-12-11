// Configuration for scroll sections and element positioning
export interface SectionConfig {
  id: string
  name: string
  // Positioning for 3D elements
  model?: {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: number
  }
  // Positioning for vector elements
  vector?: {
    position: { x: number; y: number }
    scale: number
    opacity: number
    rotation?: number
  }
  // Additional effects
  effects?: {
    enableMouseTracking?: boolean
    enableGlow?: boolean
    blurBackground?: boolean
  }
}

export const scrollSections: SectionConfig[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    model: {
      position: [0, -1.5, 0.51],
      rotation: [-0.972, -2.962, -0.72],
      scale: 76.1
    },
    vector: {
      position: { x: 0, y: 0 },
      scale: 1,
      opacity: 1
    },
    effects: {
      enableMouseTracking: true,
      enableGlow: true,
      blurBackground: true
    }
  },
  {
    id: 'services',
    name: 'Services Section',
    model: {
      position: [8, 0, 0],
      rotation: [0, Math.PI * 0.5, 0],
      scale: 50
    },
    vector: {
      position: { x: -30, y: 0 },
      scale: 0.7,
      opacity: 0.8,
      rotation: -5
    },
    effects: {
      enableMouseTracking: false,
      enableGlow: false,
      blurBackground: false
    }
  },
  {
    id: 'portfolio',
    name: 'Portfolio Section',
    model: {
      position: [-6, 2, 2],
      rotation: [Math.PI * 0.25, Math.PI, 0],
      scale: 60
    },
    vector: {
      position: { x: 25, y: -10 },
      scale: 0.5,
      opacity: 0.6,
      rotation: 15
    },
    effects: {
      enableMouseTracking: false,
      enableGlow: false,
      blurBackground: false
    }
  },
  {
    id: 'about',
    name: 'About Section',
    model: {
      position: [0, 0, -1],
      rotation: [0, Math.PI * 1.5, 0],
      scale: 70
    },
    vector: {
      position: { x: 0, y: 15 },
      scale: 0.9,
      opacity: 0.9
    },
    effects: {
      enableMouseTracking: true,
      enableGlow: true,
      blurBackground: true
    }
  },
  {
    id: 'contact',
    name: 'Contact Section',
    model: {
      position: [0, -2, 1],
      rotation: [0, Math.PI * 2, 0],
      scale: 80
    },
    vector: {
      position: { x: 0, y: 0 },
      scale: 1.1,
      opacity: 1
    },
    effects: {
      enableMouseTracking: true,
      enableGlow: true,
      blurBackground: true
    }
  }
]