import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'employee', // 'employee' or 'admin'
    adminKey: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    const minPasswordLength = formData.userType === 'admin' ? 8 : 6
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < minPasswordLength) {
      newErrors.password = `Password must be at least ${minPasswordLength} characters long`
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.userType === 'admin' && !formData.adminKey.trim()) {
      newErrors.adminKey = 'Admin key is required for admin registration'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const registrationData = {
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password
      }

      if (formData.userType === 'admin') {
        registrationData.adminKey = formData.adminKey
      }

      await onRegister(registrationData, formData.userType)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4'>
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className='relative z-10 w-full max-w-md'>
        {/* Company Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3'>
              <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z'/>
              </svg>
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent'>
              KGN IT Solutions
            </h1>
          </div>
          <p className='text-gray-400 text-sm'>Create New Account</p>
        </div>

        {/* Registration Card */}
        <div className='backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl'>
          <div className='text-center mb-6'>
            <h2 className='text-2xl font-semibold text-white mb-2'>Join Our Team</h2>
            <p className='text-gray-300 text-sm'>Register to get started</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* User Type Selection */}
            <div className='flex space-x-4 mb-6'>
              <label className='flex items-center cursor-pointer'>
                <input
                  type='radio'
                  name='userType'
                  value='employee'
                  checked={formData.userType === 'employee'}
                  onChange={handleChange}
                  className='mr-2'
                />
                <span className='text-white'>Employee</span>
              </label>
              <label className='flex items-center cursor-pointer'>
                <input
                  type='radio'
                  name='userType'
                  value='admin'
                  checked={formData.userType === 'admin'}
                  onChange={handleChange}
                  className='mr-2'
                />
                <span className='text-white'>Admin</span>
              </label>
            </div>

            {/* First Name Input */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
              <input
                required
                type="text"
                name="firstName"
                placeholder='Enter your first name'
                value={formData.firstName}
                className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                onChange={handleChange}
              />
              {errors.firstName && <p className='text-red-400 text-xs mt-1'>{errors.firstName}</p>}
            </div>

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
                name="email"
                placeholder='Enter your email address'
                value={formData.email}
                className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                onChange={handleChange}
              />
              {errors.email && <p className='text-red-400 text-xs mt-1'>{errors.email}</p>}
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
                name="password"
                placeholder={`Enter password (min ${formData.userType === 'admin' ? '8' : '6'} chars)`}
                value={formData.password}
                onChange={handleChange}
                className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
              />
              {errors.password && <p className='text-red-400 text-xs mt-1'>{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <input
                required
                type="password"
                name="confirmPassword"
                placeholder='Confirm your password'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
              />
              {errors.confirmPassword && <p className='text-red-400 text-xs mt-1'>{errors.confirmPassword}</p>}
            </div>

            {/* Admin Key Input (only for admin) */}
            {formData.userType === 'admin' && (
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                  </svg>
                </div>
                <input
                  required
                  type="password"
                  name="adminKey"
                  placeholder='Enter admin registration key'
                  value={formData.adminKey}
                  onChange={handleChange}
                  className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200'
                />
                {errors.adminKey && <p className='text-red-400 text-xs mt-1'>{errors.adminKey}</p>}
                <p className='text-xs text-gray-400 mt-1'>Contact IT support for admin registration key</p>
              </div>
            )}

            {/* Register Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                `Register as ${formData.userType === 'admin' ? 'Admin' : 'Employee'}`
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className='mt-6 text-center'>
            <p className='text-gray-400 text-sm'>
              Already have an account?{' '}
              <Link
                to="/login"
                className='text-green-400 hover:text-green-300 transition-colors duration-200 underline'
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <p className='text-xs text-gray-400'>
              © 2025 KGN IT Solutions. All rights reserved.
            </p>
          </div>
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

export default Register
