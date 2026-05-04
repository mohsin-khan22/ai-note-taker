import React from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

const QueryBoundary = ({ isLoading, isError, error, children, loadingFallback }) => {
  if (isLoading) {
    return loadingFallback || (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted animate-pulse font-medium">Processing your meeting...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-error/10 border border-error/20 rounded-xl space-y-3">
        <AlertCircle className="w-10 h-10 text-error" />
        <h3 className="text-lg font-bold text-white">Analysis Failed</h3>
        <p className="text-muted text-center max-w-md">{error?.message || 'Unknown error occurred'}</p>
      </div>
    )
  }

  return children
}

export default QueryBoundary
