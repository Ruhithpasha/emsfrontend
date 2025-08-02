/**
 * EmployeeManagement Component - Responsive Version
 * 
 * Comprehensive employee management interface with:
 * - Employee list with search and filter
 * - Responsive card/table layout
 * - Employee details and task statistics
 * 
 * @component
 * @param {Array} employees - List of employees
 * @param {function} onRefresh - Refresh data handler
 */

import React, { useState, useMemo } from 'react';
import apiService from '../../../services/apiService';

const EmployeeManagement = ({ employees, onRefresh }) => {
  // ===============================
  // State Management
  // ===============================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Computed Values
  // ===============================
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || true;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'totalTasks') {
        aValue = a.taskCounts?.total || 0;
        bValue = b.taskCounts?.total || 0;
      } else if (sortBy === 'completedTasks') {
        aValue = a.taskCounts?.completed || 0;
        bValue = b.taskCounts?.completed || 0;
      }

      if (typeof aValue === 'string') {
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
  }, [employees, searchTerm, filterStatus, sortBy, sortOrder]);

  // ===============================
  // Event Handlers
  // ===============================
  const handleEmployeeSelection = (employeeId, isSelected) => {
    if (isSelected) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedEmployees(filteredAndSortedEmployees.map(emp => emp._id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteEmployee(employeeId);
      onRefresh();
      alert('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedEmployees.length} employee(s)?`)) {
      return;
    }

    try {
      setLoading(true);
      await Promise.all(selectedEmployees.map(id => apiService.deleteEmployee(id)));
      setSelectedEmployees([]);
      onRefresh();
      alert('Employees deleted successfully!');
    } catch (error) {
      console.error('Error deleting employees:', error);
      alert('Failed to delete some employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Render Component
  // ===============================
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Employee Management</h2>
          <p className="text-blue-200 text-sm sm:text-base">Manage your team members and their tasks</p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 font-medium text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-blue-200 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <svg className="absolute left-2 sm:left-3 top-2 sm:top-2.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-blue-200 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            >
              <option value="all">All Employees</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-blue-200 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            >
              <option value="firstName">Name</option>
              <option value="email">Email</option>
              <option value="totalTasks">Total Tasks</option>
              <option value="completedTasks">Completed Tasks</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-blue-200 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedEmployees.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <p className="text-blue-200 text-sm sm:text-base">
                {selectedEmployees.length} employee(s) selected
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkDelete}
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedEmployees([])}
                  className="px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 text-sm sm:text-base"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee List - Responsive Card Layout */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
        {filteredAndSortedEmployees.length === 0 ? (
          <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
            <div className="text-gray-400">
              <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-base sm:text-lg font-medium">No employees found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredAndSortedEmployees.map((employee) => (
              <div key={employee._id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start space-x-3">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee._id)}
                    onChange={(e) => handleEmployeeSelection(employee._id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />

                  {/* Employee Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {employee.firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Employee Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <p className="text-white font-medium text-base sm:text-lg">{employee.firstName}</p>
                        <p className="text-blue-200 text-sm truncate">{employee.email}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingEmployee(employee)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm"
                          title="Edit Employee"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee._id)}
                          disabled={loading}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 text-sm"
                          title="Delete Employee"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-white font-medium">{employee.taskCounts?.total || 0}</p>
                        <p className="text-blue-200">Total</p>
                      </div>
                      <div className="bg-blue-500/20 rounded-lg p-2 text-center">
                        <p className="text-blue-400 font-medium">{employee.taskCounts?.newTask || 0}</p>
                        <p className="text-blue-200">New</p>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-2 text-center">
                        <p className="text-green-400 font-medium">{employee.taskCounts?.completed || 0}</p>
                        <p className="text-blue-200">Done</p>
                      </div>
                      <div className="bg-yellow-500/20 rounded-lg p-2 text-center">
                        <p className="text-yellow-400 font-medium">{employee.taskCounts?.active || 0}</p>
                        <p className="text-blue-200">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white">{filteredAndSortedEmployees.length}</p>
            <p className="text-blue-200 text-xs sm:text-sm">Total Employees</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-green-400">
              {filteredAndSortedEmployees.reduce((sum, emp) => sum + (emp.taskCounts?.completed || 0), 0)}
            </p>
            <p className="text-blue-200 text-xs sm:text-sm">Completed Tasks</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">
              {filteredAndSortedEmployees.reduce((sum, emp) => sum + (emp.taskCounts?.active || 0), 0)}
            </p>
            <p className="text-blue-200 text-xs sm:text-sm">Active Tasks</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-red-400">
              {filteredAndSortedEmployees.reduce((sum, emp) => sum + (emp.taskCounts?.failed || 0), 0)}
            </p>
            <p className="text-blue-200 text-xs sm:text-sm">Failed Tasks</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modals */}
      {(isAddModalOpen || editingEmployee) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingEmployee(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-blue-200 mb-6">
              <p>Employee management forms will be implemented here.</p>
              <p className="text-sm mt-2">This will include forms for adding and editing employee details.</p>
            </div>
            
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingEmployee(null);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
