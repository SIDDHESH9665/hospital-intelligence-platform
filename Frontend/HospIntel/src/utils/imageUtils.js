// Base64 encoded images - fallback images in case loading fails
export const BASE64_IMAGES = {
  logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  pan: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  gst: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  epfo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  dollar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  case: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  criminal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  civil: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  nabh: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  jci: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  rohini: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  pmjay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
};

// Function to convert image URL to base64
export const convertImageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    const timeoutId = setTimeout(() => {
      reject(new Error('Image load timeout'));
    }, 5000); // 5 second timeout

    img.onload = () => {
      clearTimeout(timeoutId);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      clearTimeout(timeoutId);
      reject(error);
    };
    
    img.src = url;
  });
};

// Function to load all images and convert them to base64
export const loadAllImages = async () => {
  const images = {
    logo: '/img/bajaj-logo2.png',
    pan: '/img/pan-card.png',
    gst: '/img/gst.png',
    epfo: '/img/epfo.png',
    dollar: '/img/dollar.png',
    case: '/img/case.png',
    criminal: '/img/criminal.png',
    civil: '/img/civil.png',
    nabh: '/img/nabh.png',
    jci: '/img/jci.png',
    rohini: '/img/rohini.png',
    pmjay: '/img/pmjay.png'
  };

  const base64Images = { ...BASE64_IMAGES }; // Start with fallback images
  
  try {
    await Promise.all(
      Object.entries(images).map(async ([key, url]) => {
        try {
          const base64 = await convertImageToBase64(url);
          base64Images[key] = base64;
        } catch (error) {
          console.warn(`Failed to load image ${key}, using fallback:`, error);
          // Keep the fallback image from BASE64_IMAGES
        }
      })
    );
    return base64Images;
  } catch (error) {
    console.error('Error loading images:', error);
    return base64Images; // Return fallback images if loading fails
  }
}; 