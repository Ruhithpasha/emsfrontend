/**
 * TaskOverview Component
 * 
 * Task statistics overview featuring:
 * - Visual task count cards with animations
 * - Progress indicators and percentages
 * - Interactive cards that can trigger view changes
 * - Responsive grid layout
 * 
 * @component
 * @param {Object} taskCounts - Object containing task counts by status
 * @param {function} onViewChange - Function to change active view
 */

import React from 'react';

const TaskOverview = ({ taskCounts, onViewChange }) => {
  // ===============================
  // Helper Functions
  // ===============================
  
  /**
   * Calculate completion rate
   */
  const getCompletionRate = () => {
    const total = taskCounts?.total || 0;
    const completed = taskCounts?.completed || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  /**
   * Calculate active progress rate
   */
  const getActiveRate = () => {
    const total = taskCounts?.total || 0;
    const active = taskCounts?.active || 0;
    return total > 0 ? Math.round((active / total) * 100) : 0;
  };

  // Task cards configuration
  const taskCards = [
    {
      id: 'new',
      title: 'New Tasks',
      count: taskCounts?.newTask || 0,
      icon: '📝',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30',
      iconBg: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400',
      description: 'Pending tasks to start'
    },
    {
      id: 'active',
      title: 'In Progress',
      count: taskCounts?.active || 0,
      icon: '⚡',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30',
      iconBg: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-400',
      description: 'Currently working on'
    },
    {
      id: 'completed',
      title: 'Completed',
      count: taskCounts?.completed || 0,
      icon: '✅',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30',
      iconBg: 'from-green-500 to-green-600',
      textColor: 'text-green-400',
      description: 'Successfully finished'
    },
    {
      id: 'failed',
      title: 'Failed',
      count: taskCounts?.failed || 0,
      icon: '❌',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/30',
      iconBg: 'from-red-500 to-red-600',
      textColor: 'text-red-400',
      description: 'Need attention'
    }
  ];

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Task Overview</h2>
        <p className="text-blue-200">Your current task status and progress</p>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {taskCards.map((card) => (
          <div
            key={card.id}
            className={`${card.bgColor} backdrop-blur-sm border ${card.borderColor} rounded-xl p-6 hover:scale-105 transition-all duration-200 cursor-pointer group`}
            onClick={() => onViewChange('tasks')}
          >
            {/* Icon */}
            <div className={`w-12 h-12 bg-gradient-to-r ${card.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
              <span className="text-xl">{card.icon}</span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{card.title}</h3>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <div className={`text-3xl font-bold ${card.textColor} mb-2`}>
                {card.count}
              </div>
              
              <p className="text-blue-200 text-sm">{card.description}</p>
            </div>

            {/* Progress indicator for active cards */}
            {card.id === 'active' && card.count > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Active Rate</span>
                  <span>{getActiveRate()}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${getActiveRate()}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Progress indicator for completed cards */}
            {card.id === 'completed' && card.count > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Completion Rate</span>
                  <span>{getCompletionRate()}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-green-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionRate()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Tasks */}
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {(taskCounts?.newTask || 0) + (taskCounts?.active || 0) + (taskCounts?.completed || 0) + (taskCounts?.failed || 0)}
            </div>
            <div className="text-blue-200 text-sm">Total Tasks</div>
          </div>

          {/* Completion Rate */}
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {getCompletionRate()}%
            </div>
            <div className="text-blue-200 text-sm">Completion Rate</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionRate()}%` }}
              ></div>
            </div>
          </div>

          {/* Performance Status */}
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              getCompletionRate() >= 80 ? 'text-green-400' :
              getCompletionRate() >= 60 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {getCompletionRate() >= 80 ? '🌟' : 
               getCompletionRate() >= 60 ? '👍' : '⚠️'}
            </div>
            <div className="text-blue-200 text-sm">
              {getCompletionRate() >= 80 ? 'Excellent Performance' :
               getCompletionRate() >= 60 ? 'Good Performance' : 'Needs Improvement'}
            </div>
          </div>
        </div>
      </div>

      {/* Task Management Guide */}
      {(taskCounts?.newTask || 0) > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="text-white font-semibold mb-2">You have {taskCounts.newTask} new task{taskCounts.newTask !== 1 ? 's' : ''} to review!</h3>
              <p className="text-blue-200 text-sm mb-3">
                New tasks need to be accepted before you can start working on them. Click "View All Tasks" to see them.
              </p>
              <div className="text-blue-300 text-xs space-y-1">
                <div>• <strong>Accept & Start:</strong> Begin working on a task immediately</div>
                <div>• <strong>Decline:</strong> Mark task as failed if you cannot complete it</div>
                <div>• <strong>Mark Complete:</strong> Finish tasks when done</div>
                <div>• <strong>Reopen:</strong> Resume previously completed or failed tasks</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => onViewChange('tasks')}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span>View All Tasks</span>
        </button>

        <button
          onClick={() => onViewChange('performance')}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>View Performance</span>
        </button>
      </div>
    </div>
  );
};

export default TaskOverview;
