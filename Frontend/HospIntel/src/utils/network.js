export const getCurrentIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    // Fallback to localhost if IP fetch fails
    return 'localhost';
  }
};

export const getLocalIP = () => {
  try {
    // Try to get local IP using WebRTC
    return new Promise((resolve) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      pc.createDataChannel('');
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(() => resolve('localhost'));

      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const match = ipRegex.exec(event.candidate.candidate);
        if (match) {
          pc.close();
          resolve(match[1]);
        }
      };
    });
  } catch (error) {
    console.error('Error getting local IP:', error);
    return 'localhost';
  }
}; 