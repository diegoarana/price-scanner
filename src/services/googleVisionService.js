// Cliente para el backend de Google Cloud Vision

class GoogleVisionService {
  constructor() {
    // URL del backend local (cambiar en producción)
    this.apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }

  async recognizeText(imageDataUrl) {
    try {
      console.log('🔧 Llamando a Google Cloud Vision backend...');
      
      const response = await fetch(`${this.apiUrl}/api/ocr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageDataUrl
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error ${response.status}`);
      }

      const result = await response.json();
      
      console.log('✅ Google Vision resultado:', result);

      // Extraer nombre del producto
      // Usar la primera descripción o la primera línea del texto completo
      const productName = result.descriptions && result.descriptions.length > 0
        ? result.descriptions[0]
        : result.fullText.split('\n')[0]?.trim() || '';
      return {
        text: result.fullText || '',
        productName: productName,
        prices: result.prices || [],
        descriptions: result.descriptions || [],
        confidence: 95, // Google Vision es muy confiable
        method: 'google-vision'
      };
    } catch (error) {
      console.error('💥 Error en Google Vision:', error);
      throw error;
    }
  }

  async recognizePriceOnly(imageDataUrl) {
    try {
      const result = await this.recognizeText(imageDataUrl);
      
      return {
        text: result.text,
        prices: result.prices,
        descriptions: result.descriptions,
        confidence: result.confidence,
        method: 'google-vision-price'
      };
    } catch (error) {
      throw error;
    }
  }

  isConfigured() {
    // En desarrollo local siempre está configurado
    // En producción verificar que el backend esté disponible
    return true;
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.apiUrl}/api/health`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('Backend no disponible:', error);
      return false;
    }
  }

  getInfo() {
    return {
      configured: this.isConfigured(),
      apiUrl: this.apiUrl,
      service: 'Google Cloud Vision'
    };
  }
}

export const googleVisionService = new GoogleVisionService();