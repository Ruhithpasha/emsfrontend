import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from './context/AuthProvider'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ForgotPassword from './components/Auth/ForgotPassword'
import ResetPassword from './components/Auth/ResetPassword'
import AdminDashboard from './components/Dashbord/AdminDashboard'
import EmployeeDashboard from './components/Dashbord/EmployeeDashboard'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { userData, loading } = useContext(AuthContext)
  
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    )
  }
  
  if (!userData) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && userData.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Auth Layout Component for handling authentication navigation
const AuthLayout = ({ children }) => {
  const navigate = useNavigate()
  const { userData } = useContext(AuthContext)
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (userData) {
      if (userData.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (userData.role === 'employee') {
        navigate('/employee/dashboard')
      }
    }
  }, [userData, navigate])
  
  if (userData) {
    return null // Don't render auth components if logged in
  }
  
  return children
}

const App = () => {
  const { userData, login, registerEmployee, registerAdmin, logout, loading } = useContext(AuthContext)

  const LoginHandler = async (email, password) => {
    try {
      const result = await login(email, password)
      
      if (result.success) {
        console.log(`${result.user.role} logged in successfully`)
        // Navigation will be handled by useEffect in AuthLayout
      } else {
        alert(result.message || "Invalid credentials")
      }
    } catch (error) {
      console.error('Login error:', error)
      alert("Login failed. Please try again.")
    }
  }

  const RegisterHandler = async (userData, userType) => {
    try {
      let result
      if (userType === 'admin') {
        result = await registerAdmin(userData)
      } else {
        result = await registerEmployee(userData)
      }
      
      if (result.success) {
        alert(result.message || `${userType} registered successfully!`)
        console.log(`${result.user.role} registered and logged in successfully`)
        // Navigation will be handled by useEffect in AuthLayout
      } else {
        alert(result.message || "Registration failed")
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert("Registration failed. Please try again.")
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login' // Force redirect to login
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthLayout>
            <Login LoginHandler={LoginHandler} />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout>
            <Register onRegister={RegisterHandler} />
          </AuthLayout>
        } />
        <Route path="/forgot-password" element={
          <AuthLayout>
            <ForgotPassword />
          </AuthLayout>
        } />
        <Route path="/reset-password" element={
          <AuthLayout>
            <ResetPassword />
          </AuthLayout>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard changeUser={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/employee/dashboard" element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeDashboard data={userData?.data} changeUser={handleLogout} />
          </ProtectedRoute>
        } />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
          },
        }}
      />
    </Router>
  )
}

export default App
