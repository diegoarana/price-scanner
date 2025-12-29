// API gratuita de OCR con buenos resultados
// Plan gratuito: 25,000 requests/mes
// Registro: https://ocr.space/ocrapi

class OCRSpaceService {
  constructor(apiKey) {
    this.apiKey = apiKey || import.meta.env.VITE_OCR_SPACE_KEY; // API Key de prueba (limitada)
    this.endpoint = 'https://api.ocr.space/parse/image';
  }

  async recognizeText(imageDataUrl) {
    try {
      const formData = new FormData();
      
      // Convertir dataURL a Blob
      const blob = await this.dataURLtoBlob(imageDataUrl);
      formData.append('file', blob, 'image.jpg');
      formData.append('apikey', this.apiKey);
      formData.append('language', 'spa'); // Español
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true'); // Mejorar resolución
      formData.append('OCREngine', '2'); // Motor 2 es mejor para precios

      const response = await fetch(this.endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`OCR.space API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.ParsedResults && data.ParsedResults.length > 0) {
        const text = data.ParsedResults[0].ParsedText;
        const exitCode = data.ParsedResults[0].FileParseExitCode;
        
        return {
          text: text,
          confidence: exitCode === 1 ? 85 : 50, // 1 = success
          error: data.ErrorMessage
        };
      }

      return {
        text: '',
        confidence: 0,
        error: data.ErrorMessage || 'No text detected'
      };
    } catch (error) {
      console.error('Error en OCR.space:', error);
      throw error;
    }
  }

  // Convertir dataURL a Blob
  dataURLtoBlob(dataURL) {
    return fetch(dataURL).then(res => res.blob());
  }
}

// Exportar servicio con API key de prueba
// Registrate en https://ocr.space/ocrapi para obtener tu propia key
export const ocrSpaceService = new OCRSpaceService();

// Para usar tu propia API key:
// export const ocrSpaceService = new OCRSpaceService('TU_API_KEY_AQUI');