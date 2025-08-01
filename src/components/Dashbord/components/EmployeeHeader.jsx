/**
 * EmployeeHeader Component
 * 
 * Header component for employee dashboard featuring:
 * - Welcome message with employee name
 * - Current time and date display
 * - Quick action buttons (refresh, profile)
 * - Responsive design with modern styling
 * 
 * @component
 * @param {Object} userData - Employee data object
 * @param {function} onRefresh - Refresh data handler function
 * @param {function} onProfileToggle - Profile sidebar toggle handler
 * @param {boolean} loading - Loading state indicator
 */

import React, { useState, useEffect } from 'react';

const EmployeeHeader = ({ userData, onRefresh, onProfileToggle, loading }) => {
  // ===============================
  // State Management
  // ===============================
  const [currentTime, setCurrentTime] = useState(new Date());

  // ===============================
  // Effect Hooks
  // ===============================
  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ===============================
  // Helper Functions
  // ===============================
  
  /**
   * Get greeting based on current time
   */
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  /**
   * Format time for display
   */
  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  /**
   * Format date for display
   */
  const formatDate = () => {
    return currentTime.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section - Greeting and Time */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
            {/* Greeting */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {getGreeting()}, {userData?.firstName || 'Employee'}! 👋
              </h1>
              <p className="text-blue-200 mt-1">
                Welcome back to your dashboard
              </p>
            </div>

            {/* Time and Date */}
            <div className="mt-3 lg:mt-0 lg:text-right">
              <div className="text-2xl font-mono font-bold text-cyan-300">
                {formatTime()}
              </div>
              <div className="text-sm text-blue-200">
                {formatDate()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 group ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            title="Refresh Data"
          >
            <svg 
              className={`w-5 h-5 text-blue-300 group-hover:text-white transition-colors ${
                loading ? 'animate-spin' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>

          {/* User Avatar (Display Only) */}
          <div className="flex items-center space-x-2 p-2 bg-white/10 border border-white/20 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {userData?.firstName?.charAt(0).toUpperCase() || 'E'}
              </span>
            </div>
            <span className="hidden lg:block text-blue-300">
              {userData?.firstName || 'Employee'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
          
          {userData?.email && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <span>{userData.email}</span>
            </div>
          )}
        </div>

        <div className="text-blue-200">
          <span>Employee ID: </span>
          <span className="font-mono text-cyan-300">
            {userData?._id?.slice(-8).toUpperCase() || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeader;
