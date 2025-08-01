/**
 * EmployeeDashboard Component
 * 
 * Modern, redesigned employee dashboard with:
 * - Clean, responsive UI with gradient backgrounds
 * - Modular component architecture
 * - Task management with status updates
 * - Performance analytics
 * - Profile management
 * 
 * @component
 * @param {Object} data - Employee data including tasks and profile info
 * @param {function} changeUser - Function to handle user logout
 */

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';

// Import modular dashboard components
import EmployeeHeader from './components/EmployeeHeader';
import TaskOverview from './components/TaskOverview';
import TaskBoard from './components/TaskBoard';
import PerformanceStats from './components/PerformanceStats';
import ProfilePanel from './components/ProfilePanel';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { ToastContainer, useToast } from '../common/Toast';

// Import services
import apiService from '../../services/apiService';

const EmployeeDashboard = ({ data, changeUser }) => {
  // ===============================
  // State Management
  // ===============================
  const { userData, loading: authLoading } = useContext(AuthContext);
  const [employeeData, setEmployeeData] = useState(data || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // overview, tasks, profile
  const [selectedTask, setSelectedTask] = useState(null);
  const { toasts, removeToast, success, error: showError } = useToast();

  // ===============================
  // Data Fetching
  // ===============================
  useEffect(() => {
    if (!data && userData && userData.role === 'employee') {
      fetchEmployeeData();
    }
  }, [userData, data]);

  /**
   * Fetches employee data and tasks
   */
  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const profile = await apiService.getEmployeeProfile();
      setEmployeeData(profile);

    } catch (error) {
      console.error('❌ Error fetching employee data:', error);
      setError('Failed to load employee data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes employee data
   */
  const refreshData = () => {
    if (data) {
      // If data prop is provided, we can't refresh it (needs parent to handle)
      window.location.reload();
    } else {
      fetchEmployeeData();
    }
  };

  /**
   * Handles task status updates
   */
  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      setLoading(true);
      
      // Convert status to the format expected by backend
      const statusUpdate = {
        newTask: newStatus === 'newTask',
        active: newStatus === 'active', 
        completed: newStatus === 'completed',
        failed: newStatus === 'failed'
      };
      
      console.log('🔄 Updating task status:', { taskId, newStatus, statusUpdate });
      
      await apiService.updateEmployeeTaskStatus(taskId, statusUpdate);
      
      // Refresh data to get updated task counts
      await fetchEmployeeData();
      
      // Success notification
      const statusLabels = {
        newTask: 'New',
        active: 'In Progress', 
        completed: 'Completed',
        failed: 'Failed'
      };
      
      success(`Task status updated to "${statusLabels[newStatus]}" successfully!`);
      
    } catch (error) {
      console.error('❌ Error updating task status:', error);
      showError(error.message || 'Failed to update task status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles logout functionality
   */
  const handleLogout = () => {
    if (changeUser) {
      changeUser();
    }
  };

  // ===============================
  // Render Guards
  // ===============================
  if (authLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!userData || userData.role !== 'employee') {
    return (
      <ErrorMessage 
        title="Access Denied"
        message="You don't have permission to access the employee dashboard."
        actionText="Go to Login"
        onAction={() => handleLogout()}
      />
    );
  }

  if (loading && !employeeData) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Dashboard Error"
        message={error}
        actionText="Try Again"
        onAction={refreshData}
      />
    );
  }

  if (!employeeData) {
    return (
      <ErrorMessage 
        title="No Data Available"
        message="Unable to load employee data."
        actionText="Refresh"
        onAction={refreshData}
      />
    );
  }

  // ===============================
  // Render Component  
  // ===============================
  return (
    <div className="min-h-screen max-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex h-screen max-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <EmployeeHeader 
            userData={employeeData}
            onRefresh={refreshData}
            onProfileToggle={() => {}} // No longer needed for permanent profile
            loading={loading}
          />

          {/* Navigation Tabs */}
          <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-4">
            <nav className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
              {[
                { id: 'overview', label: '📊 Overview', icon: '📊' },
                { id: 'tasks', label: '📋 My Tasks', icon: '📋' },
                { id: 'performance', label: '📈 Performance', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeView === tab.id
                      ? 'bg-white text-blue-900 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 px-4 lg:px-6 pb-4 overflow-auto">
            {activeView === 'overview' && (
              <div className="space-y-6">
                {/* Task Overview */}
                <TaskOverview 
                  taskCounts={employeeData.taskCounts}
                  onViewChange={setActiveView}
                />
                
                {/* Recent Tasks Preview */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Tasks</h2>
                    <button
                      onClick={() => setActiveView('tasks')}
                      className="text-blue-300 hover:text-white transition-colors text-sm"
                    >
                      View All →
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {employeeData.tasks?.slice(0, 3).map((task, index) => (
                      <div 
                        key={task._id || index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div>
                          <h4 className="text-white font-medium">{task.taskTitle}</h4>
                          <p className="text-blue-200 text-sm">{task.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.completed ? 'bg-green-500/20 text-green-400' :
                            task.active ? 'bg-yellow-500/20 text-yellow-400' :
                            task.failed ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {task.completed ? 'Completed' :
                             task.active ? 'Active' :
                             task.failed ? 'Failed' : 'New'}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {(!employeeData.tasks || employeeData.tasks.length === 0) && (
                      <div className="text-center py-8 text-gray-400">
                        <p>No tasks assigned yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'tasks' && (
              <TaskBoard 
                tasks={employeeData.tasks || []}
                onTaskUpdate={handleTaskStatusUpdate}
                onTaskSelect={setSelectedTask}
                loading={loading}
              />
            )}

            {activeView === 'performance' && (
              <PerformanceStats 
                taskCounts={employeeData.taskCounts}
                tasks={employeeData.tasks || []}
              />
            )}
          </div>
        </div>

        {/* Permanent Profile Panel - Hidden on mobile */}
        <div className="hidden lg:block">
          <ProfilePanel 
            userData={employeeData}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner message="Updating..." />
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default EmployeeDashboard;