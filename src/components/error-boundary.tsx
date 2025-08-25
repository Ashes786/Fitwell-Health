"use client"

import { Component, ReactNode, ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Check if it's a chunk loading error
    if (
      error.message.includes('ChunkLoadError') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch dynamically imported module')
    ) {
      console.log('Chunk loading error detected, attempting recovery...')
      
      // Try to reload the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message.includes('ChunkLoadError') ||
                          this.state.error?.message.includes('Loading chunk') ||
                          this.state.error?.message.includes('Failed to fetch dynamically imported module')

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isChunkError ? 'Loading Issue' : 'Oops! Something went wrong'}
              </h1>
              <p className="text-gray-600 mb-6">
                {isChunkError 
                  ? 'We\'re having trouble loading some parts of the application. This might be due to a temporary network issue or outdated cache.'
                  : 'We encountered an unexpected error. Please try refreshing the page.'
                }
              </p>
              
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-red-800 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              {isChunkError && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-blue-800">
                    💡 This usually resolves itself automatically. If it persists, try clearing your browser cache or using a different browser.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleReload}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isChunkError ? 'Retry Loading' : 'Refresh Page'}
              </Button>
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>
            
            {isChunkError && (
              <div className="mt-6 text-sm text-gray-500">
                <p>Auto-reloading in 2 seconds...</p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}