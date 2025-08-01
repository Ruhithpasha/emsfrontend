/**
 * TaskBoard Component
 * 
 * Interactive task management board featuring:
 * - Kanban-style task organization
 * - Drag-and-drop functionality (future enhancement)
 * - Task status updates with confirmation
 * - Detailed task cards with actions
 * - Filtering and search capabilities
 * 
 * @component
 * @param {Array} tasks - Array of task objects
 * @param {function} onTaskUpdate - Function to handle task status updates
 * @param {function} onTaskSelect - Function to handle task selection
 * @param {boolean} loading - Loading state indicator
 */

import React, { useState, useMemo } from 'react';

const TaskBoard = ({ tasks, onTaskUpdate, onTaskSelect, loading }) => {
  // ===============================
  // State Management
  // ===============================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // ===============================
  // Computed Values
  // ===============================
  
  /**
   * Get unique categories from tasks
   */
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(tasks.map(task => task.category).filter(Boolean))];
    return uniqueCategories;
  }, [tasks]);

  /**
   * Filter tasks based on search and category
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, searchTerm, filterCategory]);

  /**
   * Organize tasks by status
   */
  const taskColumns = useMemo(() => {
    const organized = {
      newTask: [],
      active: [],
      completed: [],
      failed: []
    };

    filteredTasks.forEach(task => {
      if (task.newTask) organized.newTask.push(task);
      else if (task.active) organized.active.push(task);
      else if (task.completed) organized.completed.push(task);
      else if (task.failed) organized.failed.push(task);
      else organized.newTask.push(task); // Default to newTask
    });

    return organized;
  }, [filteredTasks]);

  // ===============================
  // Event Handlers
  // ===============================
  
  /**
   * Handle task status change with confirmation
   */
  const handleStatusChange = async (task, newStatus) => {
    const statusLabels = {
      newTask: 'New',
      active: 'In Progress',
      completed: 'Completed',
      failed: 'Failed'
    };

    const actionLabels = {
      newTask: 'reset',
      active: 'start working on',
      completed: 'mark as completed',
      failed: 'mark as failed'
    };

    const confirmMessage = `Are you sure you want to ${actionLabels[newStatus]} "${task.taskTitle}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await onTaskUpdate(task._id, newStatus);
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task status. Please try again.');
      }
    }
  };

  /**
   * Get task priority color
   */
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-blue-500';
    }
  };

  /**
   * Format task date
   */
  const formatTaskDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  /**
   * Get date color based on urgency
   */
  const getDateColor = (dateString) => {
    if (!dateString) return 'text-gray-400';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-400';
    if (diffDays <= 1) return 'text-yellow-400';
    return 'text-blue-200';
  };

  // ===============================
  // Column Configuration
  // ===============================
  const columns = [
    {
      id: 'newTask',
      title: 'New Tasks',
      icon: '📝',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-400/20',
      headerColor: 'text-blue-400',
      count: taskColumns.newTask.length
    },
    {
      id: 'active',
      title: 'In Progress',
      icon: '⚡',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-400/20',
      headerColor: 'text-yellow-400',
      count: taskColumns.active.length
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: '✅',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-400/20',
      headerColor: 'text-green-400',
      count: taskColumns.completed.length
    },
    {
      id: 'failed',
      title: 'Failed',
      icon: '❌',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-400/20',
      headerColor: 'text-red-400',
      count: taskColumns.failed.length
    }
  ];

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">My Tasks</h2>
          <p className="text-blue-200">Manage and track your assigned tasks</p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg">
            <span className="text-blue-400 text-sm font-medium">Total:</span>
            <span className="text-white font-bold">{filteredTasks.length}</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
            <span className="text-yellow-400 text-sm font-medium">Active:</span>
            <span className="text-white font-bold">{taskColumns.active.length}</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-400/30 rounded-lg">
            <span className="text-green-400 text-sm font-medium">Done:</span>
            <span className="text-white font-bold">{taskColumns.completed.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-blue-200 text-sm">
          💡 Click on any task card to see available actions (Accept, Start, Complete, etc.)
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="admin-dropdown">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer shadow-lg hover:shadow-xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px'
              }}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`${column.bgColor} border ${column.borderColor} rounded-xl p-4`}>
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{column.icon}</span>
                <h3 className={`font-semibold ${column.headerColor}`}>{column.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${column.headerColor} bg-white/10`}>
                {column.count}
              </span>
            </div>

            {/* Task Cards */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {taskColumns[column.id].length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No tasks in this column</p>
                </div>
              ) : (
                taskColumns[column.id].map((task) => (
                  <div
                    key={task._id}
                    className={`bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all duration-200 cursor-pointer border-l-4 ${getPriorityColor(task.priority)}`}
                    onClick={() => {
                      setSelectedTaskId(selectedTaskId === task._id ? null : task._id);
                      onTaskSelect(task);
                    }}
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm leading-tight">
                        {task.taskTitle}
                      </h4>
                      <div className="flex items-center space-x-1 ml-2">
                        {task.priority && (
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {task.priority?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Task Description */}
                    <p className="text-blue-200 text-xs mb-3 line-clamp-2">
                      {task.taskDescription}
                    </p>

                    {/* Task Meta */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{task.category}</span>
                      <span className={getDateColor(task.taskDate)}>
                        {formatTaskDate(task.taskDate)}
                      </span>
                    </div>

                    {/* Expanded Actions */}
                    {selectedTaskId === task._id && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <div className="flex flex-wrap gap-2">
                          {column.id === 'newTask' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(task, 'active');
                                }}
                                disabled={loading}
                                className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded text-green-400 text-xs font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                              >
                                <span>✅</span>
                                <span>Accept & Start</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to decline "${task.taskTitle}"? This will mark it as failed.`)) {
                                    handleStatusChange(task, 'failed');
                                  }
                                }}
                                disabled={loading}
                                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded text-red-400 text-xs font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                              >
                                <span>❌</span>
                                <span>Decline</span>
                              </button>
                            </>
                          )}
                          
                          {column.id === 'active' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(task, 'completed');
                                }}
                                disabled={loading}
                                className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded text-green-400 text-xs font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                              >
                                <span>✅</span>
                                <span>Mark Complete</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to mark "${task.taskTitle}" as failed? You can reopen it later if needed.`)) {
                                    handleStatusChange(task, 'failed');
                                  }
                                }}
                                disabled={loading}
                                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded text-red-400 text-xs font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                              >
                                <span>❌</span>
                                <span>Mark Failed</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(task, 'newTask');
                                }}
                                disabled={loading}
                                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded text-blue-400 text-xs font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                              >
                                <span>⏸️</span>
                                <span>Pause</span>
                              </button>
                            </>
                          )}
                          
                          {(column.id === 'completed' || column.id === 'failed') && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(task, 'active');
                                }}
                                disabled={loading}
                                className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded text-yellow-400 text-xs font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                              >
                                <span>🔄</span>
                                <span>Reopen Task</span>
                              </button>
                              {column.id === 'failed' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(task, 'newTask');
                                  }}
                                  disabled={loading}
                                  className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded text-blue-400 text-xs font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
                                >
                                  <span>📝</span>
                                  <span>Reset to New</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {filteredTasks.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
