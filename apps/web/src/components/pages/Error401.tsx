import { Link } from 'react-router-dom'

const Error401 = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-6">
          {/* 401 Number */}
          <div className="relative">
            <h1 className="select-none text-9xl font-bold text-red-200">401</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-700">Access Denied</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              You don't have permission to access this resource. Please check your credentials or
              contact an administrator for assistance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Link
              to="/dashboard"
              className="inline-flex transform items-center rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-orange-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

            <div className="text-sm">
              <Link
                to="/login"
                className="font-medium text-red-600 transition-colors duration-200 hover:text-red-500"
              >
                Try logging in again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error401
