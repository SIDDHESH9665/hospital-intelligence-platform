// Initialize with a default value
let API_BASE_URL = 'http://localhost:5002';

// Function to initialize the API base URL
export const initializeAPI = async () => {
  try {
    // Try to fetch server info from the backend
    console.log('Initializing API...');
    
    // Check if we're accessing from localhost or local network
    const currentHost = window.location.hostname;
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
    const isLocalNetwork = /^192\.168\./.test(currentHost);
    
    // Use appropriate URL based on the access method
    if (isLocalhost) {
      API_BASE_URL = 'http://localhost:5002';
    } else if (isLocalNetwork) {
      API_BASE_URL = `http://${currentHost}:5002`;
    } else {
      API_BASE_URL = `https://${currentHost}`;  // For production
    }
    
    console.log('Using server URL:', API_BASE_URL);
    
    // Test the API connection
    const testResponse = await fetch(`${API_BASE_URL}/api/test`);
    if (!testResponse.ok) {
      throw new Error(`API test failed: ${testResponse.status}`);
    }
    console.log('API test successful');
    
    return API_BASE_URL;
  } catch (error) {
    console.error('Error initializing API:', error);
    // Fallback based on the current hostname
    const currentHost = window.location.hostname;
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
    const isLocalNetwork = /^192\.168\./.test(currentHost);
    
    API_BASE_URL = isLocalhost 
      ? 'http://localhost:5002'
      : isLocalNetwork 
        ? `http://${currentHost}:5002`
        : `https://${currentHost}`;
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