import type { PointLightSettings } from '../../types'

interface PointLightControlsProps {
  title?: string
  light: PointLightSettings
  onUpdate: (key: keyof PointLightSettings, value: [number, number, number] | number | string) => void
}

/**
 * Reusable component for Point Light UI controls
 * Provides controls for position (X, Y, Z), intensity, and color
 */
export function PointLightControls({
  title,
  light,
  onUpdate
}: PointLightControlsProps) {
  return (
    <>
      {title && <h3 style={{ marginBottom: '8px', fontSize: '10px' }}>{title}</h3>}
      
      {/* Position X */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
          <span>Position X</span>
          <input
            type="number"
            step="0.01"
            value={light.position[0]}
            onChange={(e) => onUpdate('position', [Number(e.target.value), light.position[1], light.position[2]])}
            style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
          />
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          step="0.01"
          value={light.position[0]}
          onChange={(e) => onUpdate('position', [Number(e.target.value), light.position[1], light.position[2]])}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      
      {/* Position Y */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
          <span>Position Y</span>
          <input
            type="number"
            step="0.01"
            value={light.position[1]}
            onChange={(e) => onUpdate('position', [light.position[0], Number(e.target.value), light.position[2]])}
            style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
          />
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          step="0.01"
          value={light.position[1]}
          onChange={(e) => onUpdate('position', [light.position[0], Number(e.target.value), light.position[2]])}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      
      {/* Position Z */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
          <span>Position Z</span>
          <input
            type="number"
            step="0.01"
            value={light.position[2]}
            onChange={(e) => onUpdate('position', [light.position[0], light.position[1], Number(e.target.value)])}
            style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
          />
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          step="0.01"
          value={light.position[2]}
          onChange={(e) => onUpdate('position', [light.position[0], light.position[1], Number(e.target.value)])}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      
      {/* Intensity */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', fontSize: '9px' }}>
          <span>Intensity</span>
          <input
            type="number"
            step="0.01"
            value={light.intensity}
            onChange={(e) => onUpdate('intensity', Number(e.target.value))}
            style={{ width: '50px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px', padding: '2px 4px', fontSize: '9px' }}
          />
        </label>
        <input
          type="range"
          min="0"
          max="200"
          step="0.01"
          value={light.intensity}
          onChange={(e) => onUpdate('intensity', Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      
      {/* Color */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '3px', fontSize: '9px' }}>Color</label>
        <input
          type="color"
          value={light.color.startsWith('#') ? light.color : (light.color === 'red' ? '#ff0000' : light.color === 'green' ? '#00ff00' : light.color === 'blue' ? '#0000ff' : light.color)}
          onChange={(e) => onUpdate('color', e.target.value)}
          style={{ width: '100%', height: '30px', backgroundColor: '#222', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}
        />
      </div>
    </>
  )
}
