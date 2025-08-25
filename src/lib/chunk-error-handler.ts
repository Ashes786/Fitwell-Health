// Chunk loading error handler for webpack chunk loading issues
export function setupChunkErrorHandler() {
  if (typeof window !== 'undefined') {
    // Handle chunk loading errors
    window.addEventListener('error', (event) => {
      if (
        event.message?.includes('ChunkLoadError') ||
        event.message?.includes('Loading chunk') ||
        event.message?.includes('Failed to fetch dynamically imported module') ||
        event.message?.includes('Module build failed') ||
        event.message?.includes('Unexpected token')
      ) {
        console.error('Chunk loading error detected:', event.message)
        
        // Prevent default error handling
        event.preventDefault()
        event.stopPropagation()
        
        // Show user-friendly message
        const errorMessage = document.createElement('div')
        errorMessage.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="
              background: white;
              color: black;
              padding: 2rem;
              border-radius: 12px;
              max-width: 500px;
              text-align: center;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            ">
              <div style="
                width: 48px;
                height: 48px;
                background: #ef4444;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
              ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 style="margin: 0 0 1rem 0; color: #1f2937; font-size: 1.5rem;">Loading Issue</h2>
              <p style="margin: 0 0 1.5rem 0; color: #6b7280; line-height: 1.5;">
                We're having trouble loading some parts of the application. 
                This might be due to a temporary network issue or browser cache.
              </p>
              <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f3f4f6; border-radius: 8px; text-align: left;">
                <p style="margin: 0; color: #4b5563; font-size: 0.875rem;">
                  <strong>Troubleshooting tips:</strong><br>
                  • Clear your browser cache<br>
                  • Disable browser extensions<br>
                  • Try a different browser<br>
                  • Check your internet connection
                </p>
              </div>
              <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="window.location.reload()" style="
                  background: #3b82f6;
                  color: white;
                  border: none;
                  padding: 0.75rem 1.5rem;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 1rem;
                  font-weight: 500;
                ">
                  Refresh Now
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                  background: #f3f4f6;
                  color: #374151;
                  border: none;
                  padding: 0.75rem 1.5rem;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 1rem;
                  font-weight: 500;
                ">
                  Dismiss
                </button>
              </div>
              <div style="margin-top: 1rem; font-size: 0.875rem; color: #9ca3af;">
                Auto-reloading in <span id="countdown">5</span> seconds...
              </div>
            </div>
          </div>
        `
        document.body.appendChild(errorMessage)
        
        // Countdown timer
        let countdown = 5
        const countdownElement = errorMessage.querySelector('#countdown')
        const timer = setInterval(() => {
          countdown--
          if (countdownElement) {
            countdownElement.textContent = countdown.toString()
          }
          if (countdown <= 0) {
            clearInterval(timer)
            window.location.reload()
          }
        }, 1000)
        
        // Auto-reload after 5 seconds
        setTimeout(() => {
          window.location.reload()
        }, 5000)
      }
    }, true) // Use capture phase

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (
        event.reason?.message?.includes('ChunkLoadError') ||
        event.reason?.message?.includes('Loading chunk') ||
        event.reason?.message?.includes('Failed to fetch dynamically imported module') ||
        event.reason?.message?.includes('Module build failed')
      ) {
        console.error('Chunk loading promise rejection:', event.reason)
        event.preventDefault()
        
        // Clear any existing error messages
        const existingMessages = document.querySelectorAll('[data-chunk-error]')
        existingMessages.forEach(msg => msg.remove())
        
        // Trigger reload with a shorter delay
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    })

    // Handle resource loading errors
    window.addEventListener('load', () => {
      // Check for failed resources
      const resources = performance.getEntriesByType('resource')
      const failedResources = resources.filter(resource => {
        const entry = resource as PerformanceResourceTiming
        return entry.duration === 0 && entry.startTime > 0
      })
      
      if (failedResources.length > 0) {
        console.warn('Some resources failed to load:', failedResources)
      }
    })
  }
}

// Enhanced window reload with cache busting
export function forceReload() {
  if (typeof window !== 'undefined') {
    // Add cache busting parameter
    const url = new URL(window.location.href)
    url.searchParams.set('_t', Date.now().toString())
    window.location.href = url.toString()
  }
}

// Call this function on app initialization
if (typeof window !== 'undefined') {
  setupChunkErrorHandler()
}