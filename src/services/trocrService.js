// Servicio alternativo usando TrOCR (compatible con Inference API)

class TrOCRService {
  constructor(apiKey) {
    this.apiKey = apiKey || import.meta.env.VITE_HF_API_KEY || '';
    // TrOCR modelo soportado por Inference API
    this.model = 'microsoft/trocr-large-printed';
    this.endpoint = `https://api-inference.huggingface.co/models/${this.model}`;
  }

  async recognizeText(imageDataUrl) {
    try {
      console.log('🔧 Usando TrOCR modelo:', this.model);
      
      // Convertir data URL a blob
      const blob = await this.dataURLtoBlob(imageDataUrl);

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: blob
      });

      console.log('📡 Respuesta de TrOCR:', response.status);

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('Modelo cargando, intenta de nuevo en 20 segundos');
        }
        if (response.status === 401) {
          throw new Error('API key inválida');
        }
        const error = await response.json();
        throw new Error(error.error || `Error ${response.status}`);
      }

      const result = await response.json();
      
      // TrOCR retorna array de resultados
      let extractedText = '';
      if (Array.isArray(result) && result.length > 0) {
        extractedText = result[0].generated_text || '';
      } else if (result.generated_text) {
        extractedText = result.generated_text;
      }

      console.log('✅ TrOCR texto extraído:', extractedText);

      return {
        text: extractedText.trim(),
        confidence: 85,
        method: 'trocr'
      };
    } catch (error) {
      console.error('💥 Error en TrOCR:', error);
      throw error;
    }
  }

  async recognizePriceOnly(imageDataUrl) {
    try {
      const result = await this.recognizeText(imageDataUrl);
      
      // Filtrar solo números y símbolos de precio
      const cleanText = result.text
        .split('\n')
        .map(line => line.trim())
        .filter(line => /[0-9$.,]/.test(line))
        .join(' ');

      return {
        text: cleanText,
        confidence: result.confidence,
        method: 'trocr-price'
      };
    } catch (error) {
      throw error;
    }
  }

  async dataURLtoBlob(dataURL) {
    const response = await fetch(dataURL);
    return response.blob();
  }

  isConfigured() {
    return !!this.apiKey && this.apiKey.startsWith('hf_');
  }

  getInfo() {
    return {
      configured: this.isConfigured(),
      model: this.model,
      endpoint: this.endpoint
    };
  }
}

export const trocrService = new TrOCRService();