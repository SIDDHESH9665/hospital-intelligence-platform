// Initialize with a default value
let API_BASE_URL = 'http://localhost:5002';

// Function to initialize the API base URL
export const initializeAPI = async () => {
  try {
    // Try to fetch server info from the backend
    console.log('Initializing API...');
    
    // First try to get the server IP from the current hostname
    const currentHost = window.location.hostname;
    const serverUrl = currentHost === 'localhost' ? 'http://localhost:5002' : `http://${currentHost}:5002`;
    
    const response = await fetch(`${serverUrl}/api/server-info`);
    if (!response.ok) {
      throw new Error(`Failed to fetch server info: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Server info:', data);
    
    // Use the server's base URL
    API_BASE_URL = data.base_url;
    console.log('API Base URL initialized:', API_BASE_URL);
    
    // Test the API connection
    const testResponse = await fetch(`${API_BASE_URL}/api/test`);
    if (!testResponse.ok) {
      throw new Error(`API test failed: ${testResponse.status}`);
    }
    console.log('API test successful');
    
    return API_BASE_URL;
  } catch (error) {
    console.error('Error initializing API:', error);
    // Fallback to using the current hostname
    const currentHost = window.location.hostname;
    API_BASE_URL = currentHost === 'localhost' ? 'http://localhost:5002' : `http://${currentHost}:5002`;
    return API_BASE_URL;
  }
};

// Function to get the current API base URL
export const getAPIBaseURL = () => API_BASE_URL;

// Function to get the full URL for an endpoint
export const getEndpointURL = (endpoint) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making request to:', url);
  return url;
};

export const API_ENDPOINTS = {
    CLAIMS_ANALYSIS: (partnerId) => getEndpointURL(`/api/claims-analysis/${partnerId}`),
    MEMBERS: getEndpointURL('/api/members'),
    SERVER_INFO: getEndpointURL('/api/server-info'),
    TEST: getEndpointURL('/api/test')
};

export default API_BASE_URL; 