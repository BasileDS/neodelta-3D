import type { ScrollAnimationConfig, ScrollAnimationValues } from '../../hooks/useScrollAnimation'
import { scrollPresets, defaultScrollConfig } from '../../hooks/useScrollAnimation'
import { CollapsibleSection } from './CollapsibleSection'

interface ScrollAnimationControlsProps {
  config: ScrollAnimationConfig
  setConfig: (config: ScrollAnimationConfig) => void
  values: ScrollAnimationValues
  isOpen: boolean
  onToggle: () => void
}

/**
 * UI Controls for scroll-based animations
 * Allows enabling/disabling and fine-tuning scroll animations for testing
 */
export function ScrollAnimationControls({
  config,
  setConfig,
  values,
  isOpen,
  onToggle
}: ScrollAnimationControlsProps) {
  
  const updateConfig = <K extends keyof ScrollAnimationConfig>(
    key: K,
    value: ScrollAnimationConfig[K]
  ) => {
    setConfig({ ...config, [key]: value })
  }

  const applyPreset = (presetName: keyof typeof scrollPresets) => {
    setConfig(scrollPresets[presetName])
  }

  const resetToDefault = () => {
    setConfig(defaultScrollConfig)
  }

  return (
    <CollapsibleSection
      title="Animations Scroll"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div style={{ marginBottom: '15px' }}>
        {/* Presets */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '9px', fontWeight: 'bold', color: '#aaa' }}>
            Présets rapides
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {Object.keys(scrollPresets).map((preset) => (
              <button
                key={preset}
                onClick={() => applyPreset(preset as keyof typeof scrollPresets)}
                style={{
                  padding: '4px 8px',
                  fontSize: '8px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#555'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#333'
                }}
              >
                {preset}
              </button>
            ))}
            <button
              onClick={resetToDefault}
              style={{
                padding: '4px 8px',
                fontSize: '8px',
                backgroundColor: '#442222',
                color: '#fff',
                border: '1px solid #664444',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Status Display */}
        <div style={{ 
          marginBottom: '12px', 
          padding: '8px', 
          backgroundColor: 'rgba(255,255,255,0.05)', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Scroll Y:</span>
            <span>{values.scrollY.toFixed(0)}px</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Progression:</span>
            <span>{(values.scrollProgress * 100).toFixed(1)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Direction:</span>
            <span>{values.scrollDirection === 'up' ? '↑' : values.scrollDirection === 'down' ? '↓' : '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Vélocité:</span>
            <span>{values.scrollVelocity.toFixed(0)}px/s</span>
          </div>
        </div>

        {/* Rotation Controls */}
        <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: 'rgba(100,149,237,0.1)', borderRadius: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
            <input
              type="checkbox"
              checked={config.enableScrollRotation}
              onChange={(e) => updateConfig('enableScrollRotation', e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>🔄 Rotation au scroll</span>
          </label>

          {config.enableScrollRotation && (
            <div style={{ marginLeft: '10px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '8px' }}>Axe de rotation</label>
                <select
                  value={config.rotationAxis}
                  onChange={(e) => updateConfig('rotationAxis', e.target.value as 'x' | 'y' | 'z' | 'all')}
                  style={{ width: '100%', padding: '3px', fontSize: '9px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px' }}
                >
                  <option value="x">X (horizontal)</option>
                  <option value="y">Y (vertical)</option>
                  <option value="z">Z (profondeur)</option>
                  <option value="all">Tous les axes</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                  <span>Vitesse</span>
                  <span>{config.rotationSpeed.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={config.rotationSpeed}
                  onChange={(e) => updateConfig('rotationSpeed', parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                  <span>Amplitude</span>
                  <span>{(config.rotationRange / Math.PI).toFixed(1)}π rad</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.PI * 4}
                  step={Math.PI / 8}
                  value={config.rotationRange}
                  onChange={(e) => updateConfig('rotationRange', parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
              
              <div style={{ marginTop: '5px', fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                Rotation actuelle: [{values.rotation.map(r => r.toFixed(2)).join(', ')}]
              </div>
            </div>
          )}
        </div>

        {/* Scale Controls */}
        <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: 'rgba(50,205,50,0.1)', borderRadius: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
            <input
              type="checkbox"
              checked={config.enableScrollScale}
              onChange={(e) => updateConfig('enableScrollScale', e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>📐 Échelle au scroll</span>
          </label>

          {config.enableScrollScale && (
            <div style={{ marginLeft: '10px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                  <span>Échelle min</span>
                  <span>{config.scaleMin.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.05"
                  value={config.scaleMin}
                  onChange={(e) => updateConfig('scaleMin', parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                  <span>Échelle max</span>
                  <span>{config.scaleMax.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.05"
                  value={config.scaleMax}
                  onChange={(e) => updateConfig('scaleMax', parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '8px' }}>Easing</label>
                <select
                  value={config.scaleEasing}
                  onChange={(e) => updateConfig('scaleEasing', e.target.value as 'linear' | 'easeIn' | 'easeOut' | 'easeInOut')}
                  style={{ width: '100%', padding: '3px', fontSize: '9px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px' }}
                >
                  <option value="linear">Linéaire</option>
                  <option value="easeIn">Ease In (accélère)</option>
                  <option value="easeOut">Ease Out (décélère)</option>
                  <option value="easeInOut">Ease In-Out</option>
                </select>
              </div>
              
              <div style={{ marginTop: '5px', fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                Échelle actuelle: {values.scale.toFixed(3)}
              </div>
            </div>
          )}
        </div>

        {/* Position Controls */}
        <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: 'rgba(255,165,0,0.1)', borderRadius: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
            <input
              type="checkbox"
              checked={config.enableScrollPosition}
              onChange={(e) => updateConfig('enableScrollPosition', e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>📍 Position au scroll</span>
          </label>

          {config.enableScrollPosition && (
            <div style={{ marginLeft: '10px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '8px' }}>Axe de déplacement</label>
                <select
                  value={config.positionAxis}
                  onChange={(e) => updateConfig('positionAxis', e.target.value as 'x' | 'y' | 'z' | 'all')}
                  style={{ width: '100%', padding: '3px', fontSize: '9px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px' }}
                >
                  <option value="x">X (gauche/droite)</option>
                  <option value="y">Y (haut/bas)</option>
                  <option value="z">Z (avant/arrière)</option>
                  <option value="all">Tous les axes</option>
                </select>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                  <span>Amplitude</span>
                  <span>{config.positionRange.toFixed(1)} unités</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={config.positionRange}
                  onChange={(e) => updateConfig('positionRange', parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '3px', fontSize: '8px' }}>Direction</label>
                <select
                  value={config.positionDirection}
                  onChange={(e) => updateConfig('positionDirection', e.target.value as 'positive' | 'negative' | 'both')}
                  style={{ width: '100%', padding: '3px', fontSize: '9px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '3px' }}
                >
                  <option value="positive">Positif (0 → max)</option>
                  <option value="negative">Négatif (0 → -max)</option>
                  <option value="both">Les deux (-max ↔ +max)</option>
                </select>
              </div>
              
              <div style={{ marginTop: '5px', fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                Position actuelle: [{values.position.map(p => p.toFixed(2)).join(', ')}]
              </div>
            </div>
          )}
        </div>

        {/* Opacity Controls */}
        <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: 'rgba(148,0,211,0.1)', borderRadius: '4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '9px', cursor: 'pointer', fontWeight: 'bold' }}>
            <input
              type="checkbox"
              checked={config.enableScrollOpacity}
              onChange={(e) => updateConfig('enableScrollOpacity', e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>👁️ Opacité au scroll</span>
          </label>

          {config.enableScrollOpacity && (
            <div style={{ marginLeft: '10px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                  <span>Opacité min</span>
                  <span>{config.opacityMin.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.opacityMin}
                  onChange={(e) => updateConfig('opacityMin', parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
                  <span>Opacité max</span>
                  <span>{config.opacityMax.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.opacityMax}
                  onChange={(e) => updateConfig('opacityMax', parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.opacityInvert}
                  onChange={(e) => updateConfig('opacityInvert', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <span>Inverser (fade out au lieu de fade in)</span>
              </label>
              
              <div style={{ marginTop: '5px', fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                Opacité actuelle: {values.opacity.toFixed(3)}
              </div>
            </div>
          )}
        </div>

        {/* Scroll Behavior Settings */}
        <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '9px', fontWeight: 'bold', color: '#aaa' }}>
            ⚙️ Paramètres du scroll
          </label>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
              <span>Lissage (smoothing)</span>
              <span>{config.scrollSmoothing.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={config.scrollSmoothing}
              onChange={(e) => updateConfig('scrollSmoothing', parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              Plus bas = plus fluide mais plus lent
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
              <span>Seuil de départ (threshold)</span>
              <span>{config.scrollThreshold}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={config.scrollThreshold}
              onChange={(e) => updateConfig('scrollThreshold', parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              Pixels avant que l'animation démarre
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px' }}>
              <span>Plage d'animation</span>
              <span>{config.scrollRange === 0 ? 'auto' : `${config.scrollRange}px`}</span>
            </label>
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={config.scrollRange}
              onChange={(e) => updateConfig('scrollRange', parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              0 = utilise la hauteur du document
            </div>
          </div>
        </div>

        {/* Helper tip for testing */}
        <div style={{ 
          marginTop: '12px', 
          padding: '8px', 
          backgroundColor: 'rgba(255,193,7,0.1)', 
          borderRadius: '4px',
          border: '1px solid rgba(255,193,7,0.3)'
        }}>
          <div style={{ fontSize: '8px', color: '#ffc107', fontWeight: 'bold', marginBottom: '4px' }}>
            💡 Astuce pour tester
          </div>
          <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.7)' }}>
            Ajoutez du contenu scrollable à votre page ou augmentez la hauteur du body pour tester les animations au scroll.
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}
