/**
 * AdminDashboard Component
 * 
 * Main dashboard component for admin users that provides:
 * - Dashboard overview with statistics
 * - Employee management functionality
 * - Task creation and management
 * - Clean, modular architecture
 * 
 * @component
 */

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';

// Import modular dashboard components
import DashboardHeader from './components/DashboardHeader';
import DashboardStats from './components/DashboardStats';
import EmployeeManagement from './components/EmployeeManagement';
import TaskManagement from './components/TaskManagement';
import QuickActions from './components/QuickActions';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

// Import services
import apiService from '../../services/apiService';

const AdminDashboard = ({ changeUser }) => {
  // ===============================
  // State Management
  // ===============================
  const { userData, loading: authLoading } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    employees: [],
    tasks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, employees, tasks

  // ===============================
  // Data Fetching
  // ===============================
  useEffect(() => {
    if (userData && userData.role === 'admin') {
      fetchDashboardData();
    }
  }, [userData]);

  /**
   * Fetches all dashboard data including stats, employees, and tasks
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard statistics, employees, and tasks in parallel
      const [statsResponse, employeesResponse, tasksResponse] = await Promise.all([
        apiService.getDashboardStats().catch(() => ({ totalEmployees: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0 })),
        apiService.getAllEmployees().catch(() => []),
        apiService.getAllTasks().catch(() => [])
      ]);

      setDashboardData({
        stats: statsResponse,
        employees: employeesResponse,
        tasks: tasksResponse
      });

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes dashboard data
   */
  const refreshDashboard = () => {
    fetchDashboardData();
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

  if (!userData || userData.role !== 'admin') {
    return (
      <ErrorMessage 
        title="Access Denied"
        message="You don't have permission to access the admin dashboard."
        actionText="Go to Login"
        onAction={() => handleLogout()}
      />
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Dashboard Error"
        message={error}
        actionText="Try Again"
        onAction={refreshDashboard}
      />
    );
  }

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6 w-full">
        {/* Dashboard Header */}
        <DashboardHeader 
          userData={userData}
          onLogout={handleLogout}
          onRefresh={refreshDashboard}
        />

        {/* Navigation Tabs */}
        <div className="mb-6 lg:mb-8">
          <nav className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'employees', label: '👥 Employees', icon: '👥' },
              { id: 'tasks', label: '📋 Tasks', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
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
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Dashboard Statistics */}
              <DashboardStats stats={dashboardData.stats} />
              
              {/* Quick Actions */}
              <QuickActions 
                onRefresh={refreshDashboard} 
                employees={dashboardData.employees}
                onNavigate={setActiveTab}
              />
            </>
          )}

          {activeTab === 'employees' && (
            <EmployeeManagement 
              employees={dashboardData.employees}
              onRefresh={refreshDashboard}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskManagement 
              tasks={dashboardData.tasks}
              employees={dashboardData.employees}
              onRefresh={refreshDashboard}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;