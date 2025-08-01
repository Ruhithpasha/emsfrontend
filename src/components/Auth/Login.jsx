import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = ({LoginHandler}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const SubmitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate loading for better UX
    setTimeout(() => {
      console.log("Email is", email)
      console.log("password is", password)
      LoginHandler(email, password)
      setEmail("")
      setPassword("")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4'>
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className='relative z-10 w-full max-w-md'>
        {/* Company Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3'>
              <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'/>
              </svg>
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
              KGN IT Solutions
            </h1>
          </div>
          <p className='text-gray-400 text-sm'>Employee Management Portal</p>
        </div>

        {/* Login Card */}
        <div className='backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl'>
          <div className='text-center mb-6'>
            <h2 className='text-2xl font-semibold text-white mb-2'>Welcome Back</h2>
            <p className='text-gray-300 text-sm'>Sign in to access your dashboard</p>
          </div>

          <form onSubmit={SubmitHandler} className='space-y-6'>
            {/* Email Input */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                </svg>
              </div>
              <input
                required
                type="email" 
                placeholder='Enter your email address'
                value={email}
                className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
              </div>
              <input
                required
                type="password" 
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between text-sm'>
              <label className='flex items-center text-gray-300'>
                <input type='checkbox' className='mr-2 rounded border-gray-300' />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className='text-blue-400 hover:text-blue-300 transition-colors duration-200'
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <p className='text-xs text-gray-400'>
              © 2025 KGN IT Solutions. All rights reserved.
            </p>
          </div>
        </div>

        {/* Switch to Register */}
        <div className='mt-6 text-center'>
          <p className='text-gray-400 text-sm'>
            Don't have an account?{' '}
            <Link
              to="/register"
              className='text-blue-400 hover:text-blue-300 transition-colors duration-200 underline'
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-500'>
            Need help? Contact IT Support: support@kgn-it.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login