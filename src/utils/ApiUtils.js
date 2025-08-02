import config from '../config/config.js';

/**
 * Utility functions for API operations
 */
export class ApiUtils {
  /**
   * Build full API URL from endpoint
   * @param {string} endpoint - The API endpoint
   * @returns {string} - Full API URL
   */
  static buildUrl(endpoint) {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${config.API_BASE_URL}/${cleanEndpoint}`;
  }

  /**
   * Build URL with path parameters
   * @param {string} endpoint - The API endpoint with placeholders (e.g., '/users/:id')
   * @param {object} params - Object with parameter values
   * @returns {string} - Endpoint with replaced parameters
   */
  static buildEndpointWithParams(endpoint, params = {}) {
    let builtEndpoint = endpoint;
    
    Object.keys(params).forEach(key => {
      builtEndpoint = builtEndpoint.replace(`:${key}`, params[key]);
    });
    
    return builtEndpoint;
  }

  /**
   * Get default request headers with auth token if available
   * @param {string} token - Auth token
   * @returns {object} - Headers object
   */
  static getHeaders(token = null) {
    const headers = { ...config.defaultHeaders };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Check if the API is in development mode
   * @returns {boolean}
   */
  static isDevelopment() {
    return config.NODE_ENV === 'development';
  }

  /**
   * Check if the API is in production mode
   * @returns {boolean}
   */
  static isProduction() {
    return config.NODE_ENV === 'production';
  }

  /**
   * Get the base API URL
   * @returns {string}
   */
  static getBaseUrl() {
    return config.API_BASE_URL;
  }
}

export default ApiUtils;
