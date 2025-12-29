import { ocrService } from './ocrService';
import { ocrSpaceService } from './ocrSpaceService';
import { findMostLikelyPrice, getAllValidPrices } from './priceParser';

class HybridOCRService {
  constructor() {
    this.useOCRSpace = true;      // Primero: OCR.space (rápido y preciso)
    this.useTesseract = true;     // Fallback: Tesseract (offline)
    this.confidenceThreshold = 60;
  }

  async recognizePrice(imageData) {
    let result = null;
    
    // Intento 1: OCR.space (rápido, confiable, 25K/mes gratis)
    if (this.useOCRSpace) {
      try {
        console.log('🌐 Intentando con OCR.space...');
        result = await this.tryOCRSpace(imageData);
        
        if (result && result.price) {
          console.log('✅ OCR.space exitoso:', result);
          return result;
        }
        
        console.log('⚠️ OCR.space no detectó precio');
      } catch (error) {
        console.error('❌ OCR.space falló:', error.message);
      }
    }

    // Intento 2: Tesseract (offline, siempre disponible)
    if (this.useTesseract) {
      try {
        console.log('📖 Intentando con Tesseract...');
        result = await this.tryTesseract(imageData);
        
        if (result && result.price) {
          console.log('✅ Tesseract exitoso:', result);
          return result;
        }
        
        console.log('⚠️ Tesseract no detectó precio');
      } catch (error) {
        console.error('❌ Tesseract falló:', error);
      }
    }

    // Si ninguno funcionó
    return result || {
      price: null,
      allPrices: [],
      text: '',
      confidence: 0,
      method: 'none',
      error: 'No se pudo detectar el precio con ningún método'
    };
  }

  async tryTesseract(imageData) {
    await ocrService.initialize();
    const ocrResult = await ocrService.recognizeText(imageData);
    const price = findMostLikelyPrice(ocrResult.text);
    const allPrices = getAllValidPrices(ocrResult.text);
    
    return {
      price: price,
      allPrices: allPrices,
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      method: 'tesseract'
    };
  }

  async tryOCRSpace(imageData) {
    const ocrResult = await ocrSpaceService.recognizeText(imageData);
    const price = findMostLikelyPrice(ocrResult.text);
    const allPrices = getAllValidPrices(ocrResult.text);
    
    return {
      price: price,
      allPrices: allPrices,
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      method: 'ocrspace'
    };
  }

  // Configurar qué servicios usar
  configure(options = {}) {
    if (options.useTesseract !== undefined) {
      this.useTesseract = options.useTesseract;
    }
    if (options.useOCRSpace !== undefined) {
      this.useOCRSpace = options.useOCRSpace;
    }
    if (options.confidenceThreshold !== undefined) {
      this.confidenceThreshold = options.confidenceThreshold;
    }
  }

  // Obtener estado de servicios
  getStatus() {
    return {
      ocrspace: this.useOCRSpace ? 'enabled' : 'disabled',
      tesseract: this.useTesseract ? 'enabled' : 'disabled',
      confidenceThreshold: this.confidenceThreshold
    };
  }
}

export const hybridOCRService = new HybridOCRService();