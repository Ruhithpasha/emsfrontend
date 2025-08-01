/**
 * ErrorMessage Component
 * 
 * Reusable error message component with optional action button
 * 
 * @component
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @param {string} actionText - Action button text
 * @param {function} onAction - Action button handler
 */

import React from 'react';

const ErrorMessage = ({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred.", 
  actionText = null, 
  onAction = null 
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm border border-red-200/20 rounded-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Error Content */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-300">{message}</p>
          </div>

          {/* Action Button */}
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {actionText}
            </button>
          )}
        </div>

        {/* Additional help text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            If this problem persists, please contact IT support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
