# Environment Configuration

This project uses environment variables to manage configuration for different environments (development, production, etc.).

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your specific configuration:
   ```env
   # Backend API Configuration
   VITE_API_BASE_URL=https://emsbackend-92zu.onrender.com
   
   # Environment
   NODE_ENV=production
   ```

## Environment Variables

- `VITE_API_BASE_URL`: The base URL for your backend API
- `NODE_ENV`: The current environment (development/production)

## Configuration Files

- `src/config/config.js`: Main configuration file that reads from environment variables
- `src/utils/ApiUtils.js`: Utility functions for API operations
- `src/services/apiService.js`: Main API service (original)
- `src/services/apiServiceV2.js`: Enhanced API service with config-based endpoints
- `src/constants/apiConstants.js`: API constants and enums

## Usage

```javascript
import config from './config/config.js';
import apiService from './services/apiService.js';

// The API service automatically uses the configured backend URL
const response = await apiService.login(email, password);
```

## Development vs Production

The configuration automatically switches between development and production based on the `NODE_ENV` variable:

- **Development**: Uses localhost or development server URL
- **Production**: Uses the production backend URL (https://emsbackend-92zu.onrender.com)

## Build Process

When building for production, make sure your `.env` file contains the production configuration:

```bash
npm run build
```

The build process will automatically include the environment variables prefixed with `VITE_`.
