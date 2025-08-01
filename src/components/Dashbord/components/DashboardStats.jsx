/**
 * DashboardStats Component
 * 
 * Displays key dashboard statistics in a clean card layout:
 * - Total employees
 * - Total tasks
 * - Completed tasks
 * - Pending tasks
 * - Success rate
 * 
 * @component
 * @param {Object} stats - Dashboard statistics object
 */

import React from 'react';

const DashboardStats = ({ stats }) => {
  // Default stats if none provided
  const defaultStats = {
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    activeTasks: 0,
    failedTasks: 0
  };

  const dashboardStats = stats || defaultStats;

  /**
   * Calculate success rate percentage
   */
  const getSuccessRate = () => {
    if (dashboardStats.totalTasks === 0) return 0;
    return Math.round((dashboardStats.completedTasks / dashboardStats.totalTasks) * 100);
  };

  /**
   * Get color class based on success rate
   */
  const getSuccessRateColor = (rate) => {
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Stats configuration for cards
  const statsConfig = [
    {
      id: 'employees',
      title: 'Total Employees',
      value: dashboardStats.totalEmployees,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'totalTasks',
      title: 'Total Tasks',
      value: dashboardStats.totalTasks,
      icon: '📋',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30'
    },
    {
      id: 'completedTasks',
      title: 'Completed Tasks',
      value: dashboardStats.completedTasks,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30'
    },
    {
      id: 'pendingTasks',
      title: 'Pending Tasks',
      value: dashboardStats.pendingTasks || dashboardStats.activeTasks,
      icon: '⏳',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30'
    },
    {
      id: 'failedTasks',
      title: 'Failed Tasks',
      value: dashboardStats.failedTasks,
      icon: '❌',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/30'
    },
    {
      id: 'successRate',
      title: 'Success Rate',
      value: `${getSuccessRate()}%`,
      icon: '📈',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-400/30',
      valueColor: getSuccessRateColor(getSuccessRate())
    }
  ];

  return (
    <div className="mb-6 lg:mb-8 w-full">
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-blue-200">Key metrics and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
        {statsConfig.map((stat) => (
          <div
            key={stat.id}
            className={`${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-xl p-4 lg:p-6 hover:scale-105 transition-all duration-200 w-full`}
          >
            {/* Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              
              {/* Trend indicator - placeholder for future enhancement */}
              <div className="text-green-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </div>
            </div>

            {/* Value */}
            <div className="mb-2">
              <p className={`text-3xl font-bold ${stat.valueColor || 'text-white'}`}>
                {stat.value}
              </p>
            </div>

            {/* Title */}
            <div>
              <p className="text-blue-200 text-sm font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Insights */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Summary */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Task Completion Rate</span>
              <span className={`font-bold ${getSuccessRateColor(getSuccessRate())}`}>
                {getSuccessRate()}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${
                  getSuccessRate() >= 80 ? 'from-green-400 to-green-500' :
                  getSuccessRate() >= 60 ? 'from-yellow-400 to-yellow-500' :
                  'from-red-400 to-red-500'
                }`}
                style={{ width: `${getSuccessRate()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Insights</h3>
          <div className="space-y-2 text-sm">
            <p className="text-blue-200">
              • Average of {dashboardStats.totalEmployees > 0 ? Math.round(dashboardStats.totalTasks / dashboardStats.totalEmployees) : 0} tasks per employee
            </p>
            <p className="text-blue-200">
              • {dashboardStats.pendingTasks || dashboardStats.activeTasks} tasks currently in progress
            </p>
            <p className="text-blue-200">
              • {dashboardStats.failedTasks} tasks need attention
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
