import React from 'react';
import config from '../config/config.js';

const ConfigTest = () => {
  const testConfig = () => {
    console.log('=== Configuration Test ===');
    console.log('API_BASE_URL:', config.API_BASE_URL);
    console.log('NODE_ENV:', config.NODE_ENV);
    console.log('Environment variables:');
    console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('MODE:', import.meta.env.MODE);
    console.log('All env vars:', import.meta.env);
    alert(`API Base URL: ${config.API_BASE_URL}`);
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
      <button 
        onClick={testConfig}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Config
      </button>
    </div>
  );
};

export default ConfigTest;
