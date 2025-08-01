/**
 * TaskAssignmentModal Component
 * 
 * Modal for creating and assigning tasks to employees with:
 * - Task details form (title, description, date, priority)
 * - Employee assignment dropdown
 * - Form validation
 * - API integration for task creation
 * 
 * @component
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Close modal handler
 * @param {Array} employees - List of employees for assignment
 * @param {Object} editingTask - Task being edited (null for new task)
 * @param {function} onSuccess - Success callback after task creation/update
 */

import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';

const TaskAssignmentModal = ({ isOpen, onClose, employees, editingTask = null, onSuccess }) => {
  // ===============================
  // State Management
  // ===============================
  const [formData, setFormData] = useState({
    taskTitle: '',
    taskDescription: '',
    taskDate: '',
    category: '',
    priority: 'medium',
    assignedTo: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ===============================
  // Effect Hooks
  // ===============================
  useEffect(() => {
    if (editingTask) {
      setFormData({
        taskTitle: editingTask.taskTitle || '',
        taskDescription: editingTask.taskDescription || '',
        taskDate: editingTask.taskDate ? new Date(editingTask.taskDate).toISOString().split('T')[0] : '',
        category: editingTask.category || '',
        priority: editingTask.priority || 'medium',
        assignedTo: editingTask.assignedTo || ''
      });
    } else {
      // Reset form for new task
      setFormData({
        taskTitle: '',
        taskDescription: '',
        taskDate: '',
        category: '',
        priority: 'medium',
        assignedTo: ''
      });
    }
    setErrors({});
  }, [editingTask, isOpen]);

  // ===============================
  // Form Handlers
  // ===============================
  
  /**
   * Handle input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.taskTitle.trim()) {
      newErrors.taskTitle = 'Task title is required';
    }

    if (!formData.taskDescription.trim()) {
      newErrors.taskDescription = 'Task description is required';
    }

    if (!formData.taskDate) {
      newErrors.taskDate = 'Task date is required';
    } else {
      // Check if date is in the past
      const selectedDate = new Date(formData.taskDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.taskDate = 'Task date cannot be in the past';
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign the task to an employee';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (editingTask) {
        // Update existing task - this would need to be implemented in API
        console.log('Update task functionality needs to be implemented');
        alert('Task update functionality will be implemented soon!');
      } else {
        // Create new task
        await apiService.assignTask(formData.assignedTo, {
          taskTitle: formData.taskTitle,
          taskDescription: formData.taskDescription,
          taskDate: formData.taskDate,
          category: formData.category,
          priority: formData.priority
        });

        // Success notification
        alert('Task assigned successfully!');
        
        // Reset form
        setFormData({
          taskTitle: '',
          taskDescription: '',
          taskDate: '',
          category: '',
          priority: 'medium',
          assignedTo: ''
        });

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }

        // Close modal
        onClose();
      }
    } catch (error) {
      console.error('Error creating/updating task:', error);
      alert(error.message || 'Failed to assign task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!loading) {
      setFormData({
        taskTitle: '',
        taskDescription: '',
        taskDate: '',
        category: '',
        priority: 'medium',
        assignedTo: ''
      });
      setErrors({});
      onClose();
    }
  };

  // ===============================
  // Render Guard
  // ===============================
  if (!isOpen) return null;

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.taskTitle ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Enter task title..."
              disabled={loading}
            />
            {errors.taskTitle && (
              <p className="text-red-400 text-sm mt-1">{errors.taskTitle}</p>
            )}
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Task Description *
            </label>
            <textarea
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.taskDescription ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Describe the task in detail..."
              disabled={loading}
            />
            {errors.taskDescription && (
              <p className="text-red-400 text-sm mt-1">{errors.taskDescription}</p>
            )}
          </div>

          {/* Row: Date and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Date */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                name="taskDate"
                value={formData.taskDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.taskDate ? 'border-red-500' : 'border-white/20'
                }`}
                disabled={loading}
              />
              {errors.taskDate && (
                <p className="text-red-400 text-sm mt-1">{errors.taskDate}</p>
              )}
            </div>

            {/* Priority */}
            <div className="admin-dropdown">
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer shadow-lg hover:shadow-xl"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
                disabled={loading}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Row: Category and Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="e.g., Development, Design, Testing"
                disabled={loading}
              />
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Assign To */}
            <div className="admin-dropdown">
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Assign To *
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer shadow-lg hover:shadow-xl ${
                  errors.assignedTo ? 'border-red-500' : 'border-white/20'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
                disabled={loading}
              >
                <option value="">Select an employee...</option>
                {employees.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} ({employee.email})
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="text-red-400 text-sm mt-1">{errors.assignedTo}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{loading ? 'Creating...' : (editingTask ? 'Update Task' : 'Create Task')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskAssignmentModal;
