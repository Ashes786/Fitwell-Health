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
  
  // Horizontal lines
  for (let i = 0; i <= horizontalLines; i++) {
    const y = (height / horizontalLines) * i
    hLines.push(
      <line
        key={`h-${i}`}
        x1="0"
        y1={y}
        x2={width}
        y2={y}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    )
  }
  
  // Vertical lines
  for (let i = 0; i <= verticalLines; i++) {
    const x = (width / verticalLines) * i
    vLines.push(
      <line
        key={`v-${i}`}
        x1={x}
        y1="0"
        x2={x}
        y2={height}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    )
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
  return (
    <g>
      {/* X-axis */}
      <line
        x1="0"
        y1={height}
        x2={width}
        y2={height}
        stroke={color}
        strokeWidth="2"
      />
      {/* Y-axis */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={height}
        stroke={color}
        strokeWidth="2"
      />
    </g>
  )
}