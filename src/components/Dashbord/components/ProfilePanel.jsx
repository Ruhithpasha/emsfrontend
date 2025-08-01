/**
 * ProfilePanel Component
 * 
 * Permanent profile panel for the employee dashboard featuring:
 * - Employee profile information display
 * - Profile picture placeholder
 * - Contact information and stats
 * - Quick actions and settings
 * - Sign out functionality
 * - Compact design for sidebar layout
 * 
 * @component
 * @param {Object} userData - Employee data object
 * @param {function} onLogout - Sign out handler function
 */

import React from 'react';

const ProfilePanel = ({ userData, onLogout }) => {
  // ===============================
  // Helper Functions
  // ===============================
  
  /**
   * Get user initials for avatar
   */
  const getUserInitials = () => {
    if (!userData?.firstName) return 'E';
    return userData.firstName.charAt(0).toUpperCase();
  };

  /**
   * Format member since date
   */
  const getMemberSince = () => {
    if (!userData?.createdAt) return 'Recently';
    const date = new Date(userData.createdAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  /**
   * Calculate task completion percentage
   */
  const getCompletionPercentage = () => {
    const completed = userData?.taskCounts?.completed || 0;
    const total = (userData?.taskCounts?.newTask || 0) + 
                  (userData?.taskCounts?.active || 0) + 
                  (userData?.taskCounts?.completed || 0) + 
                  (userData?.taskCounts?.failed || 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="w-80 h-full bg-white/10 backdrop-blur-sm border-l border-white/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <h2 className="text-lg font-bold text-white">Profile</h2>
      </div>

      {/* Profile Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Avatar and Basic Info */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white">
            {getUserInitials()}
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {userData?.firstName || 'Employee'}
          </h3>
          <p className="text-blue-200 text-sm mb-2">
            {userData?.email || 'employee@company.com'}
          </p>
          <p className="text-gray-400 text-xs">
            Member since {getMemberSince()}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 text-sm">Task Statistics</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-blue-200 text-xs">Completion Rate</span>
              <span className="text-white font-bold text-sm">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-center">
              <div className="text-green-400 font-bold text-sm">
                {userData?.taskCounts?.completed || 0}
              </div>
              <div className="text-gray-400 text-xs">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-sm">
                {userData?.taskCounts?.active || 0}
              </div>
              <div className="text-gray-400 text-xs">Active</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 text-sm">Contact Info</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-blue-200 text-xs truncate">
                {userData?.email || 'Not provided'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-blue-200 text-xs">
                {userData?.department || 'General'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm">Quick Actions</h4>
          
          <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Edit Profile</p>
              <p className="text-blue-200 text-xs">Update information</p>
            </div>
          </button>

          <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
            <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Settings</p>
              <p className="text-blue-200 text-xs">Preferences</p>
            </div>
          </button>

          <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
            <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Help</p>
              <p className="text-blue-200 text-xs">Get support</p>
            </div>
          </button>
        </div>
      </div>

      {/* Footer - Sign Out */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-200 text-red-300 hover:text-white group"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel;
