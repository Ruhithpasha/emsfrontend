/**
 * QuickActions Component
 * 
 * Provides quick action buttons for common admin tasks:
 * - Navigate to employee management (Add Employee)
 * - Navigate to task management (Create Task)
 * - View reports modal
 * - Migrate task data
 * 
 * @component
 * @param {function} onRefresh - Refresh dashboard handler
 * @param {Array} employees - List of employees for reports
 * @param {function} onNavigate - Navigation handler for tab switching
 */

import React, { useState } from 'react';
import ReportsModal from './ReportsModal';
import { toast } from 'react-hot-toast';

const QuickActions = ({ onRefresh, employees = [], onNavigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'reports'

  /**
   * Handle quick action clicks
   */
  const handleQuickAction = async (action) => {
    console.log('QuickAction clicked:', action); // Debug log
    const toastConfig = {
      duration: 3000,
      position: 'top-right',
      style: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        color: 'white',
      },
    };

    switch (action) {
      case 'employee':
        // Navigate to employees tab
        if (onNavigate) {
          onNavigate('employees');
          toast.success('Redirected to Employee Management', toastConfig);
        } else {
          toast.error('Navigation not available', toastConfig);
        }
        break;
      case 'task':
        // Navigate to tasks tab
        if (onNavigate) {
          onNavigate('tasks');
          toast.success('Redirected to Task Management', toastConfig);
        } else {
          toast.error('Navigation not available', toastConfig);
        }
        break;
      case 'report':
        // Open reports modal (this one makes sense as a modal)
        setModalType('reports');
        setIsModalOpen(true);
        break;
      case 'refresh':
        // Refresh dashboard data
        if (onRefresh) {
          onRefresh();
          toast.success('Dashboard refreshed!', toastConfig);
        }
        break;
      case 'migrate':
        try {
          const response = await fetch('http://localhost:5000/api/admin/migrate-tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            toast.success(`Migration complete! Fixed ${data.tasksFixed} tasks`, toastConfig);
            onRefresh(); // Refresh the dashboard
          } else {
            toast.error('Migration failed: ' + data.message, toastConfig);
          }
        } catch (error) {
          toast.error('Migration failed: Network error', toastConfig);
        }
        break;
      default:
        toast.success('Action triggered!', toastConfig);
    }
  };

  /**
   * Handle data export
   */
  const handleExportData = () => {
    // TODO: Implement data export functionality
    alert('Export functionality will be implemented soon!');
  };

  /**
   * Handle task migration (fix existing task statuses)
   */
  const handleTaskMigration = async () => {
    if (window.confirm('This will fix any tasks with conflicting statuses. Continue?')) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/migrate-tasks', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert(`Migration completed! Updated ${data.updatedCount} employees.`);
          onRefresh(); // Refresh the dashboard
        } else {
          alert('Migration failed: ' + data.message);
        }
      } catch (error) {
        console.error('Migration error:', error);
        alert('Migration failed. Please try again.');
      }
    }
  };

  /**
   * Close modal
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  // Quick actions configuration
  const quickActions = [
    {
      id: 'employee',
      title: 'Add Employee',
      description: 'Register a new employee',
      icon: '👤',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30',
      hoverColor: 'hover:bg-blue-500/30'
    },
    {
      id: 'task',
      title: 'Create Task',
      description: 'Assign a new task',
      icon: '📝',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30',
      hoverColor: 'hover:bg-green-500/30'
    },
    {
      id: 'report',
      title: 'View Reports',
      description: 'Generate performance reports',
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30',
      hoverColor: 'hover:bg-purple-500/30'
    },
    {
      id: 'export',
      title: 'Export Data',
      description: 'Download CSV/Excel reports',
      icon: '📤',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30',
      hoverColor: 'hover:bg-yellow-500/30'
    }
  ];

  return (
    <div className="mb-6 lg:mb-8 w-full">
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Quick Actions</h2>
        <p className="text-blue-200">Frequently used admin functions</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action.id)}
            className={`${action.bgColor} ${action.hoverColor} backdrop-blur-sm border ${action.borderColor} rounded-xl p-4 lg:p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg group text-left w-full`}
          >
            {/* Icon */}
            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
              <span className="text-xl">{action.icon}</span>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-white font-semibold mb-1">{action.title}</h3>
              <p className="text-blue-200 text-sm">{action.description}</p>
            </div>

            {/* Arrow indicator */}
            <div className="mt-4 flex justify-end">
              <svg className="w-5 h-5 text-blue-300 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Additional Actions Row */}
      <div className="flex flex-wrap gap-2 lg:gap-3">
        <button
          onClick={() => handleQuickAction('refresh')}
          className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 text-white text-sm lg:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh Data</span>
        </button>

        <button
          className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 text-white text-sm lg:text-base"
          onClick={() => alert('Settings panel coming soon!')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>

        <button
          className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-200 text-white text-sm lg:text-base"
          onClick={() => alert('Help documentation coming soon!')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Help</span>
        </button>

        <button
          onClick={() => handleQuickAction('migrate')}
          className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 rounded-lg transition-all duration-200 text-orange-300 hover:text-white text-sm lg:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Fix Tasks</span>
        </button>
      </div>

      {/* Reports Modal - Only this one remains as a modal */}
      <ReportsModal
        isOpen={isModalOpen && modalType === 'reports'}
        onClose={closeModal}
        employees={employees}
      />
    </div>
  );
};

export default QuickActions;
