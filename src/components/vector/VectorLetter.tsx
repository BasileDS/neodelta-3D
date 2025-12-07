import React from 'react';

interface VectorLetterProps {
  // SVG properties
  width: number;
  height: number;
  viewBox: string;
  
  // Path data
  fillPath: string;
  strokePath: string;
  clipPath: string;
  
  // Styling props
  fillColor?: string;
  strokeWidth?: string;
  strokeOpacity?: number;
  fillOpacity?: number;
  backdropBlur?: string;
  blendMode?: React.CSSProperties['mixBlendMode'];
  glowColor?: string;
  glowOpacity?: number;
  glowIntensity?: number;
  glowDx1?: number;
  glowDy1?: number;
  glowDx2?: number;
  glowDy2?: number;
  
  // Filter and gradient IDs (unique per letter)
  filterId: string;
  clipPathId?: string;
  gradientId: string;
  
  // Foreignobject dimensions for backdrop blur
  foreignX: number;
  foreignY: number;
  foreignWidth: number;
  foreignHeight: number;
}

export default function VectorLetter({
  width,
  height,
  viewBox,
  fillPath,
  strokePath,
  clipPath,
  fillColor = "#ffffff53",
  strokeWidth = "0.2",
  strokeOpacity = 1,
  fillOpacity = 1,
  backdropBlur = "11px",
  blendMode = "lighten",
  glowColor = "white",
  glowOpacity = 0.3,
  glowIntensity = 1,
  glowDx1 = 1.31697,
  glowDy1 = 1.79586,
  glowDx2 = 2.32229,
  glowDy2 = 3.16675,
  filterId,
  gradientId,
  foreignX,
  foreignY,
  foreignWidth,
  foreignHeight
}: VectorLetterProps) {
  // Convert SVG path to CSS clip-path polygon if possible
  // For now, we'll use the backdrop on the wrapper with inline SVG for clipping
  const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path d="${clipPath}"/></svg>`)}`;
  
  return (
    <div
      data-svg-wrapper
      data-layer="Vector"
      className="Vector"
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Backdrop blur layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: `blur(${backdropBlur})`,
          WebkitBackdropFilter: `blur(${backdropBlur})`,
          WebkitMaskImage: `url("${svgDataUrl}")`,
          maskImage: `url("${svgDataUrl}")`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
      
      {/* SVG letter on top */}
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <filter
            id={filterId}
            x={foreignX}
            y={foreignY}
            width={foreignWidth}
            height={foreignHeight}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx={glowDx1 * glowIntensity} dy={glowDy1 * glowIntensity}/>
            <feGaussianBlur stdDeviation={2.31 * glowIntensity}/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${glowColor === 'white' ? '1' : '0'} 0 0 0 0 ${glowColor === 'white' ? '1' : '0'} 0 0 0 0 ${glowColor === 'white' ? '1' : '0'} 0 0 0 ${glowOpacity} 0`}
            />
            <feBlend mode="lighten" in2="shape" result="effect1_innerShadow"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx={glowDx2 * glowIntensity} dy={glowDy2 * glowIntensity}/>
            <feGaussianBlur stdDeviation={4.62 * glowIntensity}/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 ${glowColor === 'white' ? '1' : '0'} 0 0 0 0 ${glowColor === 'white' ? '1' : '0'} 0 0 0 0 ${glowColor === 'white' ? '1' : '0'} 0 0 0 ${glowOpacity} 0`}
            />
            <feBlend mode="lighten" in2="effect1_innerShadow" result="effect2_innerShadow"/>
          </filter>
          
          <linearGradient id={gradientId} x1="-67.5093" y1="0" x2="67.5093" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"/>
            <stop offset="0.456731" stopColor="white" stopOpacity="0"/>
            <stop offset="1" stopColor="white" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
        
        <g filter={`url(#${filterId})`} data-figma-bg-blur-radius="15.16">
          <path
            d={fillPath}
            fill={fillColor}
            fillOpacity={fillOpacity}
            style={{ mixBlendMode: blendMode }}
          />
          <path
            d={strokePath}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            style={{ mixBlendMode: blendMode }}
          />
        </g>
      </svg>
    </div>
  );
}
