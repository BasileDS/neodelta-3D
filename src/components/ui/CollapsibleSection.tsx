import type React from 'react'

interface CollapsibleSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

/**
 * Reusable collapsible section component with toggle functionality
 */
export function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children
}: CollapsibleSectionProps) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          padding: '8px 10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isOpen ? '8px' : '0',
          fontSize: '11px',
          fontWeight: 'bold',
          userSelect: 'none'
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '10px' }}>{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <div style={{ paddingLeft: '5px' }}>
          {children}
        </div>
      )}
    </div>
  )
}
