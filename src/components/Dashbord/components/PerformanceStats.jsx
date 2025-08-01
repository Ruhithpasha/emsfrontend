/**
 * PerformanceStats Component
 * 
 * Comprehensive performance analytics featuring:
 * - Visual charts and progress indicators
 * - Performance metrics and trends
 * - Task completion analysis
 * - Time-based performance tracking
 * - Goal setting and achievement tracking
 * 
 * @component
 * @param {Object} taskCounts - Object containing task counts by status
 * @param {Array} tasks - Array of task objects for detailed analysis
 */

import React, { useMemo } from 'react';

const PerformanceStats = ({ taskCounts, tasks }) => {
  // ===============================
  // Computed Performance Metrics
  // ===============================
  
  /**
   * Calculate overall performance metrics
   */
  const performanceMetrics = useMemo(() => {
    const total = (taskCounts?.newTask || 0) + (taskCounts?.active || 0) + 
                  (taskCounts?.completed || 0) + (taskCounts?.failed || 0);
    const completed = taskCounts?.completed || 0;
    const failed = taskCounts?.failed || 0;
    const active = taskCounts?.active || 0;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const failureRate = total > 0 ? Math.round((failed / total) * 100) : 0;
    const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;
    const efficiency = total > 0 ? Math.round(((completed) / (completed + failed)) * 100) : 0;
    
    return {
      total,
      completed,
      failed,
      active,
      completionRate,
      failureRate,
      activeRate,
      efficiency: isNaN(efficiency) ? 0 : efficiency
    };
  }, [taskCounts]);

  /**
   * Analyze task categories performance
   */
  const categoryPerformance = useMemo(() => {
    const categoryStats = {};
    
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          total: 0,
          completed: 0,
          failed: 0,
          active: 0,
          newTask: 0
        };
      }
      
      categoryStats[category].total++;
      if (task.completed) categoryStats[category].completed++;
      else if (task.failed) categoryStats[category].failed++;
      else if (task.active) categoryStats[category].active++;
      else categoryStats[category].newTask++;
    });

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      ...stats,
      completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));
  }, [tasks]);

  /**
   * Get performance level based on completion rate
   */
  const getPerformanceLevel = (rate) => {
    if (rate >= 90) return { level: 'Exceptional', color: 'text-green-400', icon: '🌟' };
    if (rate >= 80) return { level: 'Excellent', color: 'text-green-400', icon: '🎯' };
    if (rate >= 70) return { level: 'Good', color: 'text-yellow-400', icon: '👍' };
    if (rate >= 60) return { level: 'Fair', color: 'text-yellow-400', icon: '📈' };
    return { level: 'Needs Improvement', color: 'text-red-400', icon: '⚠️' };
  };

  /**
   * Calculate weekly progress (mock data for demonstration)
   */
  const weeklyProgress = useMemo(() => {
    // In a real app, this would be calculated from actual task completion dates
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      completed: Math.floor(Math.random() * 5) + 1, // Mock data
      target: 3
    }));
  }, []);

  const currentPerformance = getPerformanceLevel(performanceMetrics.completionRate);

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Performance Analytics</h2>
        <p className="text-blue-200">Track your productivity and achievements</p>
      </div>

      {/* Overall Performance Card */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{currentPerformance.icon}</div>
          <h3 className={`text-2xl font-bold ${currentPerformance.color} mb-2`}>
            {currentPerformance.level}
          </h3>
          <p className="text-blue-200">Overall Performance Rating</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{performanceMetrics.completionRate}%</div>
            <div className="text-blue-200 text-sm">Completion Rate</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${performanceMetrics.completionRate}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{performanceMetrics.efficiency}%</div>
            <div className="text-blue-200 text-sm">Efficiency</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${performanceMetrics.efficiency}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{performanceMetrics.active}</div>
            <div className="text-blue-200 text-sm">Active Tasks</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${performanceMetrics.activeRate}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{performanceMetrics.failureRate}%</div>
            <div className="text-blue-200 text-sm">Failure Rate</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-red-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${performanceMetrics.failureRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Weekly Progress</h3>
        <div className="space-y-4">
          {weeklyProgress.map((day, index) => (
            <div key={day.day} className="flex items-center space-x-4">
              <div className="w-12 text-blue-200 text-sm font-medium">{day.day}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm">Completed: {day.completed}</span>
                  <span className="text-blue-200 text-sm">Target: {day.target}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      day.completed >= day.target ? 'bg-green-400' : 'bg-yellow-400'
                    }`}
                    style={{ width: `${Math.min((day.completed / day.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xl">
                {day.completed >= day.target ? '🎯' : '📈'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Performance by Category</h3>
        {categoryPerformance.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No category data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryPerformance.map((category) => (
              <div key={category.category} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{category.category}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.completionRate >= 80 ? 'bg-green-500/20 text-green-400' :
                    category.completionRate >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {category.completionRate}%
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center text-sm mb-3">
                  <div>
                    <div className="text-white font-medium">{category.total}</div>
                    <div className="text-gray-400">Total</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-medium">{category.completed}</div>
                    <div className="text-gray-400">Done</div>
                  </div>
                  <div>
                    <div className="text-yellow-400 font-medium">{category.active}</div>
                    <div className="text-gray-400">Active</div>
                  </div>
                  <div>
                    <div className="text-red-400 font-medium">{category.failed}</div>
                    <div className="text-gray-400">Failed</div>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      category.completionRate >= 80 ? 'bg-green-400' :
                      category.completionRate >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${category.completionRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Goals */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Performance Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Goal */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Monthly Completion Goal</h4>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">85%</div>
            <div className="text-blue-200 text-sm mb-3">Target completion rate</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  performanceMetrics.completionRate >= 85 ? 'bg-green-400' : 'bg-yellow-400'
                }`}
                style={{ width: `${Math.min((performanceMetrics.completionRate / 85) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-blue-200 mt-1">
              Current: {performanceMetrics.completionRate}%
            </div>
          </div>

          {/* Quality Goal */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Quality Standard</h4>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">&lt;10%</div>
            <div className="text-blue-200 text-sm mb-3">Maximum failure rate</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  performanceMetrics.failureRate <= 10 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(performanceMetrics.failureRate * 10, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-blue-200 mt-1">
              Current: {performanceMetrics.failureRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">🏆 Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">
              {performanceMetrics.completionRate >= 90 ? '🌟' : '⭐'}
            </div>
            <div className="text-white text-sm font-medium">
              {performanceMetrics.completionRate >= 90 ? 'Superstar' : 'Rising Star'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">
              {performanceMetrics.completed >= 10 ? '🎯' : '🎪'}
            </div>
            <div className="text-white text-sm font-medium">
              {performanceMetrics.completed >= 10 ? 'Task Master' : 'Getting Started'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">
              {performanceMetrics.failureRate <= 5 ? '💎' : '🔧'}
            </div>
            <div className="text-white text-sm font-medium">
              {performanceMetrics.failureRate <= 5 ? 'Quality Expert' : 'Improving'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">
              {performanceMetrics.efficiency >= 80 ? '⚡' : '🚀'}
            </div>
            <div className="text-white text-sm font-medium">
              {performanceMetrics.efficiency >= 80 ? 'Speed Demon' : 'Building Up'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;
