/**
 * ReportsModal Component
 * 
 * Modal for generating and viewing various reports:
 * - Employee performance reports
 * - Task completion statistics
 * - Department analytics
 * - Export functionality
 * 
 * @component
 * @param {boolean} isOpen - Modal visibility state
 * @param {function} onClose - Modal close handler
 * @param {Array} employees - List of employees for reporting
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../../../services/apiService';

const ReportsModal = ({ isOpen, onClose, employees = [] }) => {
  // ===============================
  // State Management
  // ===============================
  const [activeTab, setActiveTab] = useState('overview');
  const [reportData, setReportData] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    failedTasks: 0,
    departmentStats: {},
    topPerformers: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0]
  });

  // ===============================
  // Data Fetching
  // ===============================
  
  useEffect(() => {
    if (isOpen) {
      fetchReportData();
    }
  }, [isOpen, dateRange]);

  /**
   * Fetch report data from API
   */
  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Generate report data from employees
      const totalEmployees = employees.length;
      let totalTasks = 0;
      let completedTasks = 0;
      let activeTasks = 0;
      let failedTasks = 0;
      const departmentStats = {};
      const performanceData = [];

      employees.forEach(employee => {
        // Department statistics
        const dept = employee.department || 'Unassigned';
        if (!departmentStats[dept]) {
          departmentStats[dept] = { employees: 0, tasks: 0, completed: 0 };
        }
        departmentStats[dept].employees++;

        // Task statistics
        if (employee.tasks && employee.tasks.length > 0) {
          employee.tasks.forEach(task => {
            totalTasks++;
            departmentStats[dept].tasks++;
            
            if (task.completed) {
              completedTasks++;
              departmentStats[dept].completed++;
            } else if (task.active) {
              activeTasks++;
            } else if (task.failed) {
              failedTasks++;
            }
          });
        }

        // Performance data
        const completionRate = employee.taskCounts ? 
          Math.round((employee.taskCounts.completed / (employee.taskCounts.completed + employee.taskCounts.active + employee.taskCounts.failed)) * 100) || 0 : 0;
        
        performanceData.push({
          name: employee.firstName || 'Unknown',
          email: employee.email,
          department: dept,
          totalTasks: employee.taskCounts ? employee.taskCounts.completed + employee.taskCounts.active + employee.taskCounts.failed : 0,
          completedTasks: employee.taskCounts ? employee.taskCounts.completed : 0,
          completionRate
        });
      });

      // Get top performers
      const topPerformers = performanceData
        .filter(emp => emp.totalTasks > 0)
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 5);

      setReportData({
        totalEmployees,
        totalTasks,
        completedTasks,
        activeTasks,
        failedTasks: totalTasks - completedTasks - activeTasks,
        departmentStats,
        topPerformers,
        recentActivity: [] // Would need API endpoint for recent activity
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export report data as CSV
   */
  const exportToCsv = () => {
    const csvData = [
      ['Employee Report'],
      ['Generated on:', new Date().toLocaleDateString()],
      ['Date Range:', `${dateRange.startDate} to ${dateRange.endDate}`],
      [''],
      ['Summary Statistics'],
      ['Total Employees', reportData.totalEmployees],
      ['Total Tasks', reportData.totalTasks],
      ['Completed Tasks', reportData.completedTasks],
      ['Active Tasks', reportData.activeTasks],
      ['Failed Tasks', reportData.failedTasks],
      [''],
      ['Top Performers'],
      ['Name', 'Email', 'Department', 'Total Tasks', 'Completed', 'Completion Rate'],
      ...reportData.topPerformers.map(emp => [
        emp.name, emp.email, emp.department, emp.totalTasks, emp.completedTasks, `${emp.completionRate}%`
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Report exported successfully!');
  };

  if (!isOpen) return null;

  const completionRate = reportData.totalTasks > 0 ? 
    Math.round((reportData.completedTasks / reportData.totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
            <p className="text-blue-200 text-sm">Performance insights and statistics</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="p-6 border-b border-white/20 bg-white/5">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1">From</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1">To</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="ml-auto">
              <button
                onClick={exportToCsv}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm">Total Employees</p>
                      <p className="text-2xl font-bold text-white">{reportData.totalEmployees}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm">Total Tasks</p>
                      <p className="text-2xl font-bold text-white">{reportData.totalTasks}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm">Completed Tasks</p>
                      <p className="text-2xl font-bold text-white">{reportData.completedTasks}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm">Completion Rate</p>
                      <p className="text-2xl font-bold text-white">{completionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Statistics */}
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Department Statistics</h3>
                <div className="space-y-3">
                  {Object.entries(reportData.departmentStats).map(([dept, stats]) => (
                    <div key={dept} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{dept}</p>
                        <p className="text-blue-200 text-sm">{stats.employees} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{stats.completed}/{stats.tasks} tasks</p>
                        <p className="text-green-400 text-sm">
                          {stats.tasks > 0 ? Math.round((stats.completed / stats.tasks) * 100) : 0}% completion
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {reportData.topPerformers.map((performer, index) => (
                    <div key={performer.email} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-yellow-900' :
                          index === 1 ? 'bg-gray-400 text-gray-900' :
                          index === 2 ? 'bg-orange-500 text-orange-900' :
                          'bg-blue-500 text-blue-900'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{performer.name}</p>
                          <p className="text-blue-200 text-sm">{performer.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{performer.completedTasks}/{performer.totalTasks}</p>
                        <p className="text-green-400 text-sm">{performer.completionRate}% completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
