import config from '../config/config.js';
import ApiUtils from '../utils/ApiUtils.js';

class ApiServiceV2 {
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
    const url = ApiUtils.buildUrl(endpoint);
    const requestConfig = {
      headers: ApiUtils.getHeaders(this.token),
      timeout: config.timeout,
      ...options,
      headers: {
        ...ApiUtils.getHeaders(this.token),
        ...options.headers,
      }
    };

    try {
      const response = await fetch(url, requestConfig);
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
    const response = await this.request(config.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(userData) {
    return this.request(config.endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(email) {
    return this.request(config.endpoints.auth.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, newPassword) {
    return this.request(config.endpoints.auth.resetPassword, {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request(config.endpoints.users.profile);
  }

  async updateUserProfile(userData) {
    return this.request(config.endpoints.users.updateProfile, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getAllUsers() {
    return this.request(config.endpoints.users.getAllUsers);
  }

  async getUserById(userId) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.users.getUserById,
      { id: userId }
    );
    return this.request(endpoint);
  }

  async deleteUser(userId) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.users.deleteUser,
      { id: userId }
    );
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Task endpoints
  async getAllTasks() {
    return this.request(config.endpoints.tasks.getAllTasks);
  }

  async createTask(taskData) {
    return this.request(config.endpoints.tasks.createTask, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTaskById(taskId) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.tasks.getTaskById,
      { id: taskId }
    );
    return this.request(endpoint);
  }

  async updateTask(taskId, taskData) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.tasks.updateTask,
      { id: taskId }
    );
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.tasks.deleteTask,
      { id: taskId }
    );
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  async assignTask(taskId, assignmentData) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.tasks.assignTask,
      { id: taskId }
    );
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async acceptTask(taskId) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.tasks.acceptTask,
      { id: taskId }
    );
    return this.request(endpoint, {
      method: 'PUT',
    });
  }

  async completeTask(taskId, completionData = {}) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.tasks.completeTask,
      { id: taskId }
    );
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(completionData),
    });
  }

  async getTasksByStatus(status) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.tasks.getTasksByStatus,
      { status }
    );
    return this.request(endpoint);
  }

  async getUserTasks(userId) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.tasks.getUserTasks,
      { userId }
    );
    return this.request(endpoint);
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request(config.endpoints.dashboard.stats);
  }

  async getEmployeeStats(employeeId) {
    const endpoint = ApiUtils.buildEndpointWithParams(
      config.endpoints.dashboard.employeeStats,
      { id: employeeId }
    );
    return this.request(endpoint);
  }

  async getDashboardReports() {
    return this.request(config.endpoints.dashboard.reports);
  }

  // Utility methods
  logout() {
    this.clearToken();
    localStorage.removeItem('loggedInUser');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

export default new ApiServiceV2();
