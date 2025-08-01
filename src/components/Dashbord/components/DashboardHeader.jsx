/**
 * DashboardHeader Component
 * 
 * Header component for the admin dashboard containing:
 * - Welcome message with user name
 * - Logout button
 * - Refresh button
 * - Current date/time
 * 
 * @component
 * @param {Object} userData - Current user data
 * @param {function} onLogout - Logout handler
 * @param {function} onRefresh - Refresh handler
 */

import React, { useState, useEffect } from 'react';

const DashboardHeader = ({ userData, onLogout, onRefresh }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Get appropriate greeting based on time of day
   */
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  /**
   * Format current date for display
   */
  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Format current time for display
   */
  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mb-8">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          {/* Welcome Section */}
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              {/* User Avatar */}
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {userData?.data?.firstName ? userData.data.firstName.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>

              {/* Greeting and User Info */}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {getGreeting()}, {userData?.data?.firstName || 'Admin'}! 👋
                </h1>
                <p className="text-blue-200 text-sm">
                  Welcome back to your dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Date/Time and Actions */}
          <div className="flex items-center space-x-4">
            {/* Current Date/Time */}
            <div className="text-right hidden md:block">
              <p className="text-white font-medium">{formatDate()}</p>
              <p className="text-blue-200 text-sm">{formatTime()}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 group"
                title="Refresh Dashboard"
              >
                <svg className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 hover:text-white rounded-lg transition-all duration-200 flex items-center space-x-2 group"
              >
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Company Branding */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <span className="text-blue-200 font-medium">KGN IT Solutions</span>
              <span className="text-blue-300 text-sm">• Employee Management System</span>
            </div>
            
            <div className="text-blue-200 text-sm">
              Admin Dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
