import { Link } from 'react-router-dom'

const Error404 = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-6">
          {/* 404 Number */}
          <div className="relative">
            <h1 className="select-none text-9xl font-bold text-slate-200">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m-3 8a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-700">Page Not Found</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Sorry, we couldn't find the page you're looking for. The page might have been moved,
              deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link
              to="/dashboard"
              className="inline-flex transform items-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error404
