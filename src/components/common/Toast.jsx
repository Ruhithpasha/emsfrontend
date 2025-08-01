/**
 * Toast Component
 * 
 * Simple toast notification system for user feedback:
 * - Success notifications
 * - Error notifications
 * - Auto-dismiss functionality
 * - Multiple toast support
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';

let toastContainer;

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 border-green-400/30 text-green-100';
      case 'error':
        return 'bg-red-500/90 border-red-400/30 text-red-100';
      case 'warning':
        return 'bg-yellow-500/90 border-yellow-400/30 text-yellow-100';
      case 'info':
        return 'bg-blue-500/90 border-blue-400/30 text-blue-100';
      default:
        return 'bg-gray-500/90 border-gray-400/30 text-gray-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className={`${getToastColor()} backdrop-blur-sm border rounded-lg p-4 mb-2 shadow-lg animate-slide-in-right flex items-center space-x-3 min-w-80 max-w-md`}>
      <span className="text-lg">{getIcon()}</span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Toast Service
class ToastService {
  constructor() {
    this.toasts = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  show(message, type = 'success', duration = 3000) {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    this.toasts.push(toast);
    this.notify();

    return id;
  }

  remove(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// Create singleton instance
const toastService = new ToastService();

// Hook for using toast service
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastService.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    toastService.remove(id);
  };

  return {
    toasts,
    removeToast,
    showToast: toastService.show.bind(toastService),
    success: toastService.success.bind(toastService),
    error: toastService.error.bind(toastService),
    warning: toastService.warning.bind(toastService),
    info: toastService.info.bind(toastService)
  };
};

export { ToastContainer };
export default toastService;
