import { BarChart } from '@/components/ui/bar-chart'
import { Calendar } from 'lucide-react'

interface WeeklyAppointmentsChartProps {
  className?: string
  data?: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
    saturday: number
    sunday: number
  }
}

export function WeeklyAppointmentsChart({ className, data }: WeeklyAppointmentsChartProps) {
  // Default data based on the document: Mon 65, Tue 80, Wed 83, Thu 73, Fri 93, Sat 47, Sun 32
  const defaultData = {
    monday: 65,
    tuesday: 80,
    wednesday: 83,
    thursday: 73,
    friday: 93,
    saturday: 47,
    sunday: 32
  }

  const chartData = data || defaultData

  const barChartData = [
    { label: 'Mon', value: chartData.monday },
    { label: 'Tue', value: chartData.tuesday },
    { label: 'Wed', value: chartData.wednesday },
    { label: 'Thu', value: chartData.thursday },
    { label: 'Fri', value: chartData.friday },
    { label: 'Sat', value: chartData.saturday },
    { label: 'Sun', value: chartData.sunday }
  ]

  const totalAppointments = Object.values(chartData).reduce((sum, val) => sum + val, 0)
  const averageAppointments = Math.round(totalAppointments / 7)
  const peakDay = Object.entries(chartData).reduce((max, [day, count]) => 
    count > max.count ? { day, count } : max, { day: '', count: 0 }
  )

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-[#2ba664]" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Appointments</h3>
        </div>
        <div className="text-sm text-gray-500">
          Total: {totalAppointments}
        </div>
      </div>
      
      <BarChart
        data={barChartData}
        width={600}
        height={350}
        barColor="#2ba664"
        showGrid={true}
        showValues={true}
        className="w-full"
      />
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600">Average</div>
          <div className="text-lg font-semibold text-gray-900">{averageAppointments}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600">Peak Day</div>
          <div className="text-lg font-semibold text-gray-900 capitalize">
            {peakDay.day.slice(0, 3)}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600">Peak Count</div>
          <div className="text-lg font-semibold text-gray-900">{peakDay.count}</div>
        </div>
      </div>
    </div>
  )
}