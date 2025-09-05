import React from 'react'

interface ChartProps {
  width?: number
  height?: number
  className?: string
  children: React.ReactNode
}

export function ChartContainer({ width = 400, height = 300, className = '', children }: ChartProps) {
  return (
    <div className={`w-full ${className}`} style={{ maxWidth: width }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {children}
      </svg>
    </div>
  )
}

interface GridProps {
  width: number
  height: number
  horizontalLines?: number
  verticalLines?: number
  color?: string
}

export function ChartGrid({ width, height, horizontalLines = 5, verticalLines = 0, color = '#e5e7eb' }: GridProps) {
  const hLines: React.ReactElement[] = []
  const vLines: React.ReactElement[] = []
  
  // Validate inputs to prevent NaN values
  const validWidth = typeof width === 'number' && !isNaN(width) && isFinite(width) && width > 0 ? width : 0
  const validHeight = typeof height === 'number' && !isNaN(height) && isFinite(height) && height > 0 ? height : 0
  const validHorizontalLines = typeof horizontalLines === 'number' && !isNaN(horizontalLines) && isFinite(horizontalLines) && horizontalLines > 0 ? horizontalLines : 0
  const validVerticalLines = typeof verticalLines === 'number' && !isNaN(verticalLines) && isFinite(verticalLines) && verticalLines > 0 ? verticalLines : 0
  
  // Horizontal lines
  for (let i = 0; i <= validHorizontalLines; i++) {
    const y = (validHeight / validHorizontalLines) * i
    hLines.push(
      <line
        key={`h-${i}`}
        x1="0"
        y1={y}
        x2={validWidth}
        y2={y}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    )
  }
  
  // Vertical lines - only if we have valid vertical lines count
  if (validVerticalLines > 0) {
    for (let i = 0; i <= validVerticalLines; i++) {
      const x = (validWidth / validVerticalLines) * i
      vLines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1="0"
          x2={x}
          y2={validHeight}
          stroke={color}
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      )
    }
  }

  return (
    <g>
      {hLines}
      {vLines}
    </g>
  )
}

interface AxisProps {
  width: number
  height: number
  color?: string
}

export function ChartAxis({ width, height, color = '#374151' }: AxisProps) {
  // Validate inputs to prevent NaN values
  const validWidth = typeof width === 'number' && !isNaN(width) && isFinite(width) && width > 0 ? width : 0
  const validHeight = typeof height === 'number' && !isNaN(height) && isFinite(height) && height > 0 ? height : 0
  
  return (
    <g>
      {/* X-axis */}
      <line
        x1="0"
        y1={validHeight}
        x2={validWidth}
        y2={validHeight}
        stroke={color}
        strokeWidth="2"
      />
      {/* Y-axis */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={validHeight}
        stroke={color}
        strokeWidth="2"
      />
    </g>
  )
}