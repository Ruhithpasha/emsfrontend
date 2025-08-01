/**
 * TaskManagement Component
 * 
 * Comprehensive task management interface with:
 * - Task list with filtering and sorting
 * - Task assignment and tracking
 * - Create/Edit/Delete task functionality
 * - Task analytics and progress monitoring
 * 
 * @component
 * @param {Array} tasks - List of tasks
 * @param {Array} employees - List of employees for assignment
 * @param {function} onRefresh - Refresh data handler
 */

import React, { useState, useMemo } from 'react';
import apiService from '../../../services/apiService';
import TaskAssignmentModal from './TaskAssignmentModal';

const TaskManagement = ({ tasks, employees, onRefresh }) => {
  // ===============================
  // State Management
  // ===============================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, newTask, active, completed, failed
  const [filterPriority, setFilterPriority] = useState('all'); // all, high, medium, low
  const [filterAssignee, setFilterAssignee] = useState('all'); // all, unassigned, or employee ID
  const [sortBy, setSortBy] = useState('taskDate'); // taskDate, priority, title, status
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Computed Values
  // ===============================
  
  /**
   * Filter and sort tasks based on current criteria
   */
  const filteredAndSortedTasks = useMemo(() => {
    // Handle undefined or null tasks
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }
    
    let filtered = tasks.filter(task => {
      // Search filter
      const matchesSearch = task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || task.taskStatus === filterStatus;
      
      // Priority filter
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      // Assignee filter
      const matchesAssignee = filterAssignee === 'all' || 
                             (filterAssignee === 'unassigned' && !task.assignedTo) ||
                             task.assignedTo === filterAssignee;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle special sorting cases
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
      } else if (sortBy === 'taskDate') {
        aValue = new Date(a.taskDate);
        bValue = new Date(b.taskDate);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, searchTerm, filterStatus, filterPriority, filterAssignee, sortBy, sortOrder]);

  /**
   * Get task statistics
   */
  const taskStats = useMemo(() => {
    // Handle undefined or null tasks
    if (!tasks || !Array.isArray(tasks)) {
      return { total: 0, newTasks: 0, active: 0, completed: 0, failed: 0 };
    }
    
    const total = tasks.length;
    const newTasks = tasks.filter(task => task.taskStatus === 'newTask').length;
    const active = tasks.filter(task => task.taskStatus === 'active').length;
    const completed = tasks.filter(task => task.taskStatus === 'completed').length;
    const failed = tasks.filter(task => task.taskStatus === 'failed').length;
    
    return { total, newTasks, active, completed, failed };
  }, [tasks]);

  // ===============================
  // Event Handlers
  // ===============================

  /**
   * Handle task selection for bulk actions
   */
  const handleTaskSelection = (taskId, isSelected) => {
    if (isSelected) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  /**
   * Select all tasks
   */
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedTasks(filteredAndSortedTasks.map(task => task._id));
    } else {
      setSelectedTasks([]);
    }
  };

  /**
   * Delete task
   */
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteTask(taskId);
      onRefresh();
      alert('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)?`)) {
      return;
    }

    try {
      setLoading(true);
      await Promise.all(selectedTasks.map(id => apiService.deleteTask(id)));
      setSelectedTasks([]);
      onRefresh();
      alert('Tasks deleted successfully!');
    } catch (error) {
      console.error('Error deleting tasks:', error);
      alert('Failed to delete some tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update task status
   */
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      setLoading(true);
      await apiService.updateTaskStatus(taskId, { taskStatus: newStatus });
      onRefresh();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get employee name by ID
   */
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? employee.firstName : 'Unassigned';
  };

  /**
   * Get status color classes
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'newTask': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'active': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  /**
   * Get priority color classes
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Task Management</h2>
          <p className="text-blue-200">Create, assign, and track tasks across your team</p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{taskStats.total}</p>
          <p className="text-blue-200 text-sm">Total Tasks</p>
        </div>
        <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{taskStats.newTasks}</p>
          <p className="text-blue-200 text-sm">New Tasks</p>
        </div>
        <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{taskStats.active}</p>
          <p className="text-blue-200 text-sm">Active</p>
        </div>
        <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{taskStats.completed}</p>
          <p className="text-blue-200 text-sm">Completed</p>
        </div>
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{taskStats.failed}</p>
          <p className="text-blue-200 text-sm">Failed</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-blue-200 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="admin-dropdown">
            <label className="block text-sm font-medium text-blue-200 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer shadow-lg hover:shadow-xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px'
              }}
            >
              <option value="all">All Status</option>
              <option value="newTask">New</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="admin-dropdown">
            <label className="block text-sm font-medium text-blue-200 mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer shadow-lg hover:shadow-xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px'
              }}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="admin-dropdown">
            <label className="block text-sm font-medium text-blue-200 mb-2">Assignee</label>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer shadow-lg hover:shadow-xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px'
              }}
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.firstName}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="admin-dropdown">
            <label className="block text-sm font-medium text-blue-200 mb-2">Sort</label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer shadow-lg hover:shadow-xl"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
              >
                <option value="taskDate">Date</option>
                <option value="taskTitle">Title</option>
                <option value="priority">Priority</option>
                <option value="taskStatus">Status</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <p className="text-blue-200">
                {selectedTasks.length} task(s) selected
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedTasks([])}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-white/5 px-6 py-4 border-b border-white/10">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedTasks.length === filteredAndSortedTasks.length && filteredAndSortedTasks.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="col-span-3">
              <span className="text-sm font-medium text-blue-200">Task</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-medium text-blue-200">Assignee</span>
            </div>
            <div className="col-span-1">
              <span className="text-sm font-medium text-blue-200">Priority</span>
            </div>
            <div className="col-span-1">
              <span className="text-sm font-medium text-blue-200">Status</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-medium text-blue-200">Due Date</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-medium text-blue-200">Actions</span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/10">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <div key={task._id} className="px-6 py-4 hover:bg-white/5 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Selection */}
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task._id)}
                      onChange={(e) => handleTaskSelection(task._id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Task Info */}
                  <div className="col-span-3">
                    <div>
                      <h4 className="text-white font-medium truncate">{task.taskTitle}</h4>
                      <p className="text-blue-200 text-sm truncate">{task.taskDescription}</p>
                    </div>
                  </div>

                  {/* Assignee */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {getEmployeeName(task.assignedTo).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white text-sm">{getEmployeeName(task.assignedTo)}</span>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority?.toUpperCase() || 'LOW'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.taskStatus)}`}>
                      {task.taskStatus === 'newTask' ? 'NEW' : task.taskStatus?.toUpperCase()}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2">
                    <p className="text-white text-sm">
                      {new Date(task.taskDate).toLocaleDateString()}
                    </p>
                    <p className="text-blue-200 text-xs">
                      {new Date(task.taskDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setViewingTask(task)}
                        className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg transition-all duration-200"
                        title="View Task"
                      >
                        <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="p-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg transition-all duration-200"
                        title="Edit Task"
                      >
                        <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        disabled={loading}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Delete Task"
                      >
                        <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modals */}
      <TaskAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        employees={employees}
        onSuccess={() => {
          onRefresh();
        }}
      />

      <TaskAssignmentModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        employees={employees}
        editingTask={editingTask}
        onSuccess={() => {
          onRefresh();
        }}
      />

      {/* View Task Modal - Placeholder */}
      {viewingTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Task Details</h3>
              <button
                onClick={() => setViewingTask(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 text-blue-200">
              <div>
                <h4 className="text-white font-medium text-lg">{viewingTask.taskTitle}</h4>
                <p className="text-sm mt-1">{viewingTask.taskDescription}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm"><span className="text-white">Status:</span> {viewingTask.taskStatus}</p>
                  <p className="text-sm"><span className="text-white">Priority:</span> {viewingTask.priority}</p>
                </div>
                <div>
                  <p className="text-sm"><span className="text-white">Assignee:</span> {getEmployeeName(viewingTask.assignedTo)}</p>
                  <p className="text-sm"><span className="text-white">Due Date:</span> {new Date(viewingTask.taskDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewingTask(null)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
