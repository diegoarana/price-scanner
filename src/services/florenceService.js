// Servicio para usar Florence-2 a través de proxy API (sin CORS)

class FlorenceService {
  constructor(apiKey) {
    // API key de Hugging Face
    this.apiKey = apiKey || import.meta.env.VITE_HF_API_KEY || '';
    
    // URL de la API proxy - SIEMPRE usar el proxy, nunca llamar directo a HF
    this.proxyEndpoint = '/api/florence';
    
    this.model = 'microsoft/Florence-2-base';
  }

  async recognizeText(imageDataUrl) {
    try {
      console.log('🔧 Usando proxy endpoint:', this.proxyEndpoint);
      
      // Convertir data URL a base64 puro (sin prefijo)
      const base64Image = imageDataUrl.includes(',') 
        ? imageDataUrl.split(',')[1] 
        : imageDataUrl;

      const prompt = "<OCR>";

      // IMPORTANTE: Llamar al proxy, NO a Hugging Face directamente
      const response = await fetch(this.proxyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          prompt: prompt,
          apiKey: this.apiKey
        })
      });

      console.log('📡 Respuesta del proxy:', response.status);

      const result = await response.json();

      // Manejar errores de la API
      if (!response.ok) {
        console.error('❌ Error del proxy:', result);
        
        if (response.status === 503) {
          throw new Error('Modelo cargando, intenta de nuevo en 20 segundos');
        }
        if (response.status === 401) {
          throw new Error('API key inválida. Configura VITE_HF_API_KEY en Vercel');
        }
        if (response.status === 400) {
          throw new Error(result.message || 'Request inválido');
        }
        throw new Error(result.message || result.error || `Error ${response.status}`);
      }

      // Extraer texto de la respuesta
      let extractedText = '';
      if (result.success && result.data) {
        if (Array.isArray(result.data) && result.data[0]?.generated_text) {
          extractedText = result.data[0].generated_text;
        } else if (result.data.generated_text) {
          extractedText = result.data.generated_text;
        } else if (typeof result.data === 'string') {
          extractedText = result.data;
        }
      }

      // Limpiar los tags del prompt
      extractedText = extractedText
        .replace(/<OCR>/g, '')
        .replace(/<\/OCR>/g, '')
        .trim();

      console.log('✅ Florence-2 texto extraído:', extractedText);

      return {
        text: extractedText,
        confidence: 90,
        method: 'florence-2'
      };
    } catch (error) {
      console.error('💥 Error en Florence-2:', error);
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
        method: 'florence-2-price'
      };
    } catch (error) {
      throw error;
    }
  }

  async recognizeWithRegions(imageDataUrl) {
    try {
      const base64Image = imageDataUrl.includes(',')
        ? imageDataUrl.split(',')[1]
        : imageDataUrl;

      const prompt = "<OCR_WITH_REGION>";

      const response = await fetch(this.proxyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          prompt: prompt,
          apiKey: this.apiKey
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || `Error ${response.status}`);
      }

      console.log('Florence-2 con regiones:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error en Florence-2 (regiones):', error);
      throw error;
    }
  }

  isConfigured() {
    const configured = !!this.apiKey && this.apiKey.startsWith('hf_');
    console.log('🔑 Florence-2 configurado:', configured, this.apiKey ? `(key: ${this.apiKey.substring(0, 10)}...)` : '(no key)');
    return configured;
  }

  getInfo() {
    return {
      configured: this.isConfigured(),
      model: this.model,
      proxyEndpoint: this.proxyEndpoint,
      hasApiKey: !!this.apiKey
    };
  }
}

// Singleton
export const florenceService = new FlorenceService();