import {Spinner} from './Spinner'

interface FallbackLoadingProps {
  message?: string
  fullScreen?: boolean
}

export function FallbackLoading({message = 'Loading...', fullScreen = false}: FallbackLoadingProps) {
  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50'
    : 'flex items-center justify-center p-12'

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8 text-blue-600" />
        {message && <p className="text-sm text-gray-600 animate-pulse">{message}</p>}
      </div>
    </div>
  )
}
