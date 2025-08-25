// Utility for dynamic imports with retry mechanism
export async function dynamicImportWithRetry<T>(
  importFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await importFn()
    } catch (error) {
      lastError = error as Error
      
      // Check if it's a chunk loading error
      if (
        error instanceof Error && (
          error.message.includes('ChunkLoadError') ||
          error.message.includes('Loading chunk') ||
          error.message.includes('Failed to fetch dynamically imported module')
        )
      ) {
        console.warn(`Chunk loading failed (attempt ${attempt}/${maxRetries}):`, error.message)
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const waitTime = delay * Math.pow(2, attempt - 1)
          console.log(`Retrying in ${waitTime}ms...`)
          
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
      }
      
      // If it's not a chunk error or we've exhausted retries, throw the error
      throw error
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Unknown error occurred during dynamic import')
}

// Wrapper for Next.js dynamic imports
export function createDynamicImportWithRetry<P extends Record<string, any>, T>(
  importFn: () => Promise<{ default: T }>,
  options: {
    maxRetries?: number
    delay?: number
    loading?: React.ComponentType<P>
    error?: React.ComponentType<{ error: Error }>
    ssr?: boolean
  } = {}
) {
  const { maxRetries = 3, delay = 1000, ...nextOptions } = options
  
  return async (): Promise<{ default: T }> => {
    try {
      return await dynamicImportWithRetry(importFn, maxRetries, delay)
    } catch (error) {
      console.error('Dynamic import failed after retries:', error)
      throw error
    }
  }
}