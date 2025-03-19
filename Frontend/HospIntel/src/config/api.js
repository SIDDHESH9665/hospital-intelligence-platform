// API configuration
let API_BASE_URL = '';

export const initializeAPI = async () => {
  try {
    // In production (Vercel), use the deployment URL
    if (import.meta.env.PROD) {
      API_BASE_URL = window.location.origin;
    } else {
      // In development, the API calls will be proxied through Vite
      API_BASE_URL = '';
    }
    
    // Test the API connection
    const response = await fetch(`${API_BASE_URL}/api/test`);
    const data = await response.json();
    console.log('API Test Response:', data);
    
    if (data.status !== 'ok') {
      throw new Error('API test failed');
    }
    
    console.log('API initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize API:', error);
    return false;
  }
};

export const getAPIBaseURL = () => API_BASE_URL;

export const getEndpointURL = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export const makeAPIRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(getEndpointURL(endpoint), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const API_ENDPOINTS = {
    CLAIMS_ANALYSIS: (partnerId) => getEndpointURL(`/api/claims-analysis/${partnerId}`),
    MEMBERS: getEndpointURL('/api/members'),
    SERVER_INFO: getEndpointURL('/api/server-info'),
    TEST: getEndpointURL('/api/test')
};

export default API_BASE_URL;