import { Platform } from 'react-native';

// Development URL - use this when testing locally
const DEV_URL = 'http://128.61.121.211:8000';  // Your actual physical IP address

// Production URL - replace this with your deployed server URL when ready
const PROD_URL = 'https://your-production-server.com';

// Current environment
const isDevelopment = __DEV__;

// Base URL for the API
export const API_BASE_URL = isDevelopment ? DEV_URL : PROD_URL;

// API endpoints
export const API_ENDPOINTS = {
  chat: '/chat',
};

// Full URLs for each endpoint
export const API_URLS = {
  chat: `${API_BASE_URL}${API_ENDPOINTS.chat}`,
};

// Helper function to update the base URL at runtime if needed
export const updateBaseUrl = (newUrl) => {
  // Update all API URLs with the new base URL
  Object.keys(API_ENDPOINTS).forEach(key => {
    API_URLS[key] = `${newUrl}${API_ENDPOINTS[key]}`;
  });
}; 