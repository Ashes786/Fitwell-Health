import { ChartContainer, ChartGrid, ChartAxis } from './chart-base'

interface BarData {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarData[]
  width?: number
  height?: number
  barColor?: string
  showGrid?: boolean
  showValues?: boolean
  maxValue?: number
  className?: string
  title?: string
}

export function BarChart({
  data,
  width = 500,
  height = 300,
  barColor = '#2ba664',
  showGrid = true,
  showValues = true,
  maxValue,
  className = '',
  title
}: BarChartProps) {
  // Validate dimensions
  const validWidth = typeof width === 'number' && !isNaN(width) && isFinite(width) && width > 0 ? width : 500
  const validHeight = typeof height === 'number' && !isNaN(height) && isFinite(height) && height > 0 ? height : 300
  
  const padding = { top: 40, right: 40, bottom: 60, left: 60 }
  const chartWidth = validWidth - padding.left - padding.right
  const chartHeight = validHeight - padding.top - padding.bottom
  
  // Validate data and ensure we have valid numbers
  const validData = data.filter(item => 
    typeof item.value === 'number' && 
    !isNaN(item.value) && 
    isFinite(item.value) && 
    typeof item.label === 'string' && 
    item.label.trim() !== ''
  )
  
  if (validData.length === 0) {
    return (
      <div className={className}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
        )}
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No valid data to display</p>
        </div>
      </div>
    )
  }
  
  // Ensure chart dimensions are positive
  if (chartWidth <= 0 || chartHeight <= 0) {
    return (
      <div className={className}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
        )}
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Invalid chart dimensions</p>
        </div>
      </div>
    )
  }
  
  const maxVal = maxValue || Math.max(...validData.map(d => d.value))
  const barWidth = chartWidth / validData.length * 0.7
  const barSpacing = chartWidth / validData.length * 0.3

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h3>
      )}
      <ChartContainer width={width} height={height}>
        {/* Background gradient */}
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={barColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={barColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Grid */}
        {showGrid && (
          <ChartGrid
            width={chartWidth}
            height={chartHeight}
            horizontalLines={5}
            color="#e5e7eb"
          />
        )}
        
        {/* Axes */}
        <ChartAxis
          width={chartWidth}
          height={chartHeight}
          color="#374151"
        />
        
        {/* Bars */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {validData.map((item, index) => {
            const barHeight = (item.value / maxVal) * chartHeight
            const x = index * (barWidth + barSpacing) + barSpacing / 2
            const y = chartHeight - barHeight
            
            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx="4"
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                >
                  <title>{`${item.label}: ${item.value}`}</title>
                </rect>
                
                {/* Value on top of bar */}
                {showValues && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-700"
                  >
                    {item.value}
                  </text>
                )}
                
                {/* Label below bar */}
                <text
                  x={x + barWidth / 2}
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