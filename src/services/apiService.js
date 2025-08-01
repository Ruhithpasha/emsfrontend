const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async registerEmployee(userData) {
    const response = await this.request('/auth/register/employee', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      this.setToken(response.token);
    }

    return response;
  }

  async registerAdmin(userData) {
    const response = await this.request('/auth/register/admin', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      this.setToken(response.token);
    }

    return response;
  }

  // Employee endpoints
  async getEmployeeProfile() {
    return this.request('/employee/profile');
  }

  async updateEmployeeTaskStatus(taskId, statusData) {
    return this.request(`/employee/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  // Admin endpoints
  async getAllEmployees() {
    return this.request('/admin/employees');
  }

  async createEmployee(employeeData) {
    return this.request('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async assignTask(employeeId, taskData) {
    return this.request(`/admin/employees/${employeeId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async deleteEmployee(employeeId) {
    return this.request(`/admin/employees/${employeeId}`, {
      method: 'DELETE',
    });
  }

  async getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  async getAllTasks() {
    return this.request('/admin/tasks');
  }

  async updateAdminTaskStatus(taskId, statusData) {
    return this.request(`/admin/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async deleteTask(taskId) {
    return this.request(`/admin/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  logout() {
    this.clearToken();
    localStorage.removeItem('loggedInUser');
  }

  // Forgot Password
  async forgotPassword(email) {
    const requestData = { email };
    
    return this.request('/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
  }

  // Reset Password
  async resetPassword(token, newPassword) {
    const requestData = { token, newPassword };
    
    return this.request('/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
  }
}

export default new ApiService();
