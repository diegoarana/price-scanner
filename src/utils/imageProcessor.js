/**
 * Redimensiona la imagen si es muy grande (mejora rendimiento)
 * @param {string} imageDataUrl - Data URL de la imagen
 * @param {number} maxWidth - Ancho máximo
 * @returns {Promise<string>} - Data URL de la imagen redimensionada
 */
export const resizeImage = async (imageDataUrl, maxWidth = 1280) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;
      
      // Redimensionar si es muy grande
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Recorta la región central de la imagen (donde suele estar el precio)
 * @param {string} imageDataUrl - Data URL de la imagen
 * @param {number} cropPercent - Porcentaje a mantener (0.5 = 50% central)
 * @returns {Promise<string>} - Data URL de la imagen recortada
 */
export const cropCenter = async (imageDataUrl, cropPercent = 0.5) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const cropWidth = img.width * cropPercent;
      const cropHeight = img.height * cropPercent;
      const x = (img.width - cropWidth) / 2;
      const y = (img.height - cropHeight) / 2;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      ctx.drawImage(img, x, y, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Convierte a escala de grises y aplica threshold (blanco/negro)
 * @param {string} imageDataUrl - Data URL de la imagen
 * @param {number} threshold - Umbral (128 recomendado)
 * @returns {Promise<string>} - Data URL de la imagen procesada
 */
export const applyThreshold = async (imageDataUrl, threshold = 128) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Convertir a blanco y negro
      for (let i = 0; i < data.length; i += 4) {
        // Escala de grises
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        
        // Threshold binario
        const value = gray > threshold ? 255 : 0;
        
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 1.0));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Aumenta el contraste de la imagen
 * @param {string} imageDataUrl - Data URL de la imagen
 * @param {number} amount - Cantidad de contraste (1.0 = sin cambio, 2.0 = mucho contraste)
 * @returns {Promise<string>} - Data URL con contraste aumentado
 */
export const increaseContrast = async (imageDataUrl, amount = 1.5) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const factor = (259 * (amount * 255 + 255)) / (255 * (259 - amount * 255));
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Pipeline optimizado de preprocesamiento para OCR
 * @param {string} imageDataUrl - Data URL de la imagen original
 * @returns {Promise<string>} - Data URL de la imagen procesada
 */
export const preprocessForOCR = async (imageDataUrl) => {
  console.log('1/4 Redimensionando...');
  // 1. Redimensionar para mejor rendimiento
  let processed = await resizeImage(imageDataUrl, 1280);
  
  console.log('2/4 Recortando centro...');
  // 2. Recortar región central (donde suele estar el precio)
  processed = await cropCenter(processed, 0.6);
  
  console.log('3/4 Aumentando contraste...');
  // 3. Aumentar contraste
  processed = await increaseContrast(processed, 1.8);
  
  console.log('4/4 Aplicando threshold...');
  // 4. Convertir a blanco y negro
  processed = await applyThreshold(processed, 140);
  
  console.log('✓ Preprocesamiento completo');
  return processed;
};