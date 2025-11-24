export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md animate-pulse">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          </div>

          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>

          {/* Form fields skeleton */}
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 bg-blue-200 rounded mt-6"></div>
          </div>

          {/* Bottom links skeleton */}
          <div className="mt-6 text-center">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
