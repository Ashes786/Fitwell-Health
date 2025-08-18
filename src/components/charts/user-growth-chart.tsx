import { LineChart } from '@/components/ui/line-chart'
import { TrendingUp, Users } from 'lucide-react'

interface UserGrowthChartProps {
  className?: string
  data?: {
    january: number
    february: number
    march: number
    april: number
    may: number
  }
}

export function UserGrowthChart({ className, data }: UserGrowthChartProps) {
  // Default data based on the document: Jan 990, Feb 1020, Mar 1060, Apr 1120, May 1350
  const defaultData = {
    january: 990,
    february: 1020,
    march: 1060,
    april: 1120,
    may: 1350
  }

  const chartData = data || defaultData

  const lineChartData = [
    { label: 'Jan', value: chartData.january },
    { label: 'Feb', value: chartData.february },
    { label: 'Mar', value: chartData.march },
    { label: 'Apr', value: chartData.april },
    { label: 'May', value: chartData.may }
  ]

  const totalGrowth = chartData.may - chartData.january
  const growthPercentage = Math.round((totalGrowth / chartData.january) * 100)
  const averageMonthlyGrowth = Math.round(totalGrowth / 4)

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-[#3b82f6]" />
          <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">+{growthPercentage}%</span>
        </div>
      </div>
      
      <LineChart
        data={lineChartData}
        width={600}
        height={350}
        lineColor="#3b82f6"
        pointColor="#1d4ed8"
        areaColor="#3b82f6"
        showGrid={true}
        showPoints={true}
        showArea={true}
        showValues={true}
        smooth={true}
        className="w-full"
      />
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600">Total Users</div>
          <div className="text-lg font-semibold text-gray-900">{chartData.may.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600">Growth</div>
          <div className="text-lg font-semibold text-green-600">+{totalGrowth}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600">Avg/Month</div>
          <div className="text-lg font-semibold text-gray-900">+{averageMonthlyGrowth}</div>
        </div>
      </div>
    </div>
  )
}