import React, { createContext, useEffect, useState } from 'react'
import apiService from '../services/apiService'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('authToken')
        const loggedInUser = localStorage.getItem('loggedInUser')
        
        if (token && loggedInUser) {
            try {
                const parsedUser = JSON.parse(loggedInUser)
                setUserData(parsedUser)
            } catch (error) {
                console.error('Error parsing logged in user:', error)
                // Clear invalid data
                localStorage.removeItem('authToken')
                localStorage.removeItem('loggedInUser')
                apiService.clearToken()
            }
        }
        
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await apiService.login(email, password)
            
            if (response.success) {
                const userData = {
                    role: response.user.role,
                    data: response.user
                }
                
                setUserData(userData)
                localStorage.setItem('loggedInUser', JSON.stringify(userData))
                
                return { success: true, user: response.user }
            }
            
            return { success: false, message: response.message }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, message: error.message || 'Login failed' }
        }
    }

    const registerEmployee = async (userData) => {
        try {
            const response = await apiService.registerEmployee(userData)
            
            if (response.success) {
                const userLoginData = {
                    role: response.user.role,
                    data: response.user
                }
                
                setUserData(userLoginData)
                localStorage.setItem('loggedInUser', JSON.stringify(userLoginData))
                
                return { success: true, user: response.user, message: response.message }
            }
            
            return { success: false, message: response.message }
        } catch (error) {
            console.error('Employee registration error:', error)
            return { success: false, message: error.message || 'Registration failed' }
        }
    }

    const registerAdmin = async (userData) => {
        try {
            const response = await apiService.registerAdmin(userData)
            
            if (response.success) {
                const userLoginData = {
                    role: response.user.role,
                    data: response.user
                }
                
                setUserData(userLoginData)
                localStorage.setItem('loggedInUser', JSON.stringify(userLoginData))
                
                return { success: true, user: response.user, message: response.message }
            }
            
            return { success: false, message: response.message }
        } catch (error) {
            console.error('Admin registration error:', error)
            return { success: false, message: error.message || 'Registration failed' }
        }
    }

    const logout = () => {
        apiService.logout()
        setUserData(null)
        localStorage.removeItem('loggedInUser')
    }

    const contextValue = {
        userData,
        setUserData,
        login,
        registerEmployee,
        registerAdmin,
        logout,
        loading
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider