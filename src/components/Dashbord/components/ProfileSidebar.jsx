/**
 * ProfileSidebar Component
 * 
 * Sliding sidebar panel for user profile management featuring:
 * - Employee profile information display
 * - Profile picture placeholder
 * - Contact information
 * - Account settings access
 * - Quick logout functionality
 * - Smooth slide-in/out animations
 * 
 * @component
 * @param {boolean} isOpen - Whether the sidebar is open
 * @param {function} onClose - Close sidebar handler function
 * @param {Object} userData - Employee data object
 * @param {function} onLogout - Logout handler function
 */

import React from 'react';

const ProfileSidebar = ({ isOpen, onClose, userData, onLogout }) => {
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
      month: 'long' 
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
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 right-0 h-full w-80 bg-white/10 backdrop-blur-sm border-l border-white/20 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Avatar and Basic Info */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white">
              {getUserInitials()}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {userData?.firstName || 'Employee'}
            </h3>
            <p className="text-blue-200 text-sm">Employee</p>
            <div className="mt-2 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full inline-block">
              <span className="text-green-400 text-xs font-medium">● Active</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Contact Information</h4>
            
            <div className="space-y-3">
              {userData?.email && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">Email</p>
                    <p className="text-white text-sm font-medium">{userData.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 118 0v2m-4 0a2 2 0 104 0m-4 0v2m0 0v2" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Employee ID</p>
                  <p className="text-white text-sm font-medium font-mono">
                    {userData?._id?.slice(-8).toUpperCase() || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h8m-8 0v13a2 2 0 002 2h4a2 2 0 002-2V7" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Member Since</p>
                  <p className="text-white text-sm font-medium">{getMemberSince()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Performance Summary</h4>
            
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Completion Rate</span>
                <span className="text-white font-semibold">{getCompletionPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    getCompletionPercentage() >= 80 ? 'bg-green-400' :
                    getCompletionPercentage() >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">
                    {userData?.taskCounts?.completed || 0}
                  </div>
                  <div className="text-blue-200 text-xs">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {userData?.taskCounts?.active || 0}
                  </div>
                  <div className="text-blue-200 text-xs">Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Quick Actions</h4>
            
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Edit Profile</p>
                  <p className="text-blue-200 text-xs">Update your information</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Settings</p>
                  <p className="text-blue-200 text-xs">Preferences & privacy</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Help & Support</p>
                  <p className="text-blue-200 text-xs">Get assistance</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Logout */}
        <div className="p-6 border-t border-white/20 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-200 text-red-300 hover:text-white group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
