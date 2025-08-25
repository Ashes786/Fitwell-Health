'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    </div>
  )
}

interface LoadingCardProps {
  title?: string
  lines?: number
  className?: string
}

export function LoadingCard({ title, lines = 3, className }: LoadingCardProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-6', className)}>
      {title && (
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'bg-gray-200 rounded animate-pulse',
              i === lines - 1 ? 'h-4 w-3/4' : 'h-4 w-full'
            )}
          />
        ))}
      </div>
    </div>
  )
}

interface LoadingChartProps {
  className?: string
}

export function LoadingChart({ className }: LoadingChartProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-6', className)}>
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
      <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
    </div>
  )
}

interface LoadingTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function LoadingTable({ rows = 5, columns = 4, className }: LoadingTableProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg overflow-hidden', className)}>
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={cn(
                  'h-4 bg-gray-200 rounded animate-pulse',
                  colIndex === 0 ? 'w-3/4' : 'w-full'
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner size="lg" text={message} />
      </div>
    </div>
  )
}

// Hook for managing loading states
export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const setLoading = (key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }))
  }

  const isLoading = (key: string) => loadingStates[key] || false
  const isAnyLoading = Object.values(loadingStates).some(Boolean)

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates
  }
}