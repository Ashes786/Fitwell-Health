import { ChartContainer, ChartGrid, ChartAxis } from './chart-base'

interface LineData {
  label: string
  value: number
}

interface LineChartProps {
  data: LineData[]
  width?: number
  height?: number
  lineColor?: string
  pointColor?: string
  areaColor?: string
  showGrid?: boolean
  showPoints?: boolean
  showArea?: boolean
  showValues?: boolean
  maxValue?: number
  className?: string
  title?: string
  smooth?: boolean
}

export function LineChart({
  data,
  width = 500,
  height = 300,
  lineColor = '#3b82f6',
  pointColor = '#1d4ed8',
  areaColor = '#3b82f6',
  showGrid = true,
  showPoints = true,
  showArea = false,
  showValues = false,
  maxValue,
  className = '',
  title,
  smooth = true
}: LineChartProps) {
  const padding = { top: 40, right: 40, bottom: 60, left: 60 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  
  const maxVal = maxValue || Math.max(...data.map(d => d.value))
  const xStep = chartWidth / (data.length - 1)

  // Generate path data
  const generatePath = () => {
    const points = data.map((item, index) => {
      const x = index * xStep
      const y = chartHeight - (item.value / maxVal) * chartHeight
      return `${x},${y}`
    })

    if (smooth) {
      return generateSmoothPath(points)
    }
    
    return `M ${points.join(' L ')}`
  }

  // Generate smooth curve path
  const generateSmoothPath = (points: string[]) => {
    if (points.length < 2) return ''
    
    let path = `M ${points[0]}`
    
    for (let i = 1; i < points.length - 1; i++) {
      const [x1, y1] = points[i - 1].split(',').map(Number)
      const [x2, y2] = points[i].split(',').map(Number)
      const [x3, y3] = points[i + 1].split(',').map(Number)
      
      const cp1x = x1 + (x2 - x1) * 0.5
      const cp1y = y1
      const cp2x = x2 - (x3 - x2) * 0.5
      const cp2y = y2
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`
    }
    
    // Add last point
    const lastPoint = points[points.length - 1]
    path += ` L ${lastPoint}`
    
    return path
  }

  // Generate area path
  const generateAreaPath = () => {
    const linePath = generatePath()
    const lastPoint = data[data.length - 1]
    const lastX = (data.length - 1) * xStep
    const lastY = chartHeight - (lastPoint.value / maxVal) * chartHeight
    
    return `${linePath} L ${lastX},${chartHeight} L 0,${chartHeight} Z`
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      )}
      <ChartContainer width={width} height={height}>
        {/* Definitions for gradients and effects */}
        <defs>
          {/* Area gradient */}
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={areaColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={areaColor} stopOpacity="0.05" />
          </linearGradient>
          
          {/* Line gradient */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} />
            <stop offset="100%" stopColor={pointColor} />
          </linearGradient>
          
          {/* Shadow filter */}
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feFlood floodColor="#000000" floodOpacity="0.1"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid */}
        {showGrid && (
          <ChartGrid
            width={chartWidth}
            height={chartHeight}
            horizontalLines={5}
            verticalLines={data.length - 1}
            color="#e5e7eb"
          />
        )}
        
        {/* Axes */}
        <ChartAxis
          width={chartWidth}
          height={chartHeight}
          color="#374151"
        />
        
        {/* Chart content */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Area fill */}
          {showArea && (
            <path
              d={generateAreaPath()}
              fill="url(#areaGradient)"
              className="transition-all duration-300"
            />
          )}
          
          {/* Line */}
          <path
            d={generatePath()}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
            className="transition-all duration-300"
          />
          
          {/* Data points */}
          {showPoints && data.map((item, index) => {
            const x = index * xStep
            const y = chartHeight - (item.value / maxVal) * chartHeight
            
            return (
              <g key={index}>
                {/* Point circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={pointColor}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:r-6 cursor-pointer"
                  filter="url(#shadow)"
                >
                  <title>{`${item.label}: ${item.value}`}</title>
                </circle>
                
                {/* Value label */}
                {showValues && (
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-700"
                  >
                    {item.value}
                  </text>
                )}
                
                {/* X-axis label */}
                <text
                  x={x}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="text-sm fill-gray-600"
                >
                  {item.label}
                </text>
              </g>
            )
          })}
        </g>
        
        {/* Y-axis labels */}
        <g transform={`translate(${padding.left - 10}, ${padding.top})`}>
          {[0, 25, 50, 75, 100].map((value, index) => {
            const y = chartHeight - (value / 100) * chartHeight
            const displayValue = Math.round((value / 100) * maxVal)
            
            return (
              <text
                key={index}
                x="0"
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {displayValue}
              </text>
            )
          })}
        </g>
      </ChartContainer>
    </div>
  )
}