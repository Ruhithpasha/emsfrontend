// API Configuration
const config = {
  // Base URL for API requests
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // Environment (determined by Vite automatically)
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // API endpoints
  endpoints: {
    // Auth endpoints
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password',
      logout: '/api/auth/logout',
      refreshToken: '/api/auth/refresh-token'
    },
    
    // User endpoints
    users: {
      profile: '/api/users/profile',
      updateProfile: '/api/users/profile',
      getAllUsers: '/api/users',
      getUserById: '/api/users/:id',
      deleteUser: '/api/users/:id'
    },
    
    // Task endpoints
    tasks: {
      getAllTasks: '/api/tasks',
      createTask: '/api/tasks',
      getTaskById: '/api/tasks/:id',
      updateTask: '/api/tasks/:id',
      deleteTask: '/api/tasks/:id',
      assignTask: '/api/tasks/:id/assign',
      acceptTask: '/api/tasks/:id/accept',
      completeTask: '/api/tasks/:id/complete',
      getTasksByStatus: '/api/tasks/status/:status',
      getUserTasks: '/api/tasks/user/:userId'
    },
    
    // Dashboard endpoints
    dashboard: {
      stats: '/api/dashboard/stats',
      employeeStats: '/api/dashboard/employee/:id/stats',
      reports: '/api/dashboard/reports'
    }
  },
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default config;
