import { ocrService } from './ocrService';
import { ocrSpaceService } from './ocrSpaceService';
import { googleVisionService } from './googleVisionService';

class HybridOCRService {
  constructor() {
    this.useGoogleVision = false;  // Primero: Google Cloud Vision (más preciso)
    this.useOCRSpace = true;      // Fallback: OCR.space
    this.useTesseract = true;     // Último recurso: Tesseract
    this.confidenceThreshold = 60;
  }

  async recognizePrice(imageData) {
    let result = null;
    
    // Intento 1: Google Cloud Vision (más preciso)
    if (this.useGoogleVision) {
      try {
        console.log('☁️ Intentando con Google Cloud Vision...');
        result = await this.tryGoogleVision(imageData);
        
        if (result && result.allPrices && result.allPrices.length > 0) {
          console.log('✅ Google Vision exitoso:', result);
          return result;
        }
        
        console.log('⚠️ Google Vision no detectó precios');
      } catch (error) {
        console.error('❌ Google Vision falló:', error.message);
        // Si falla el backend, intentar con otros métodos
        this.useGoogleVision = false;
      }
    }

    // Intento 2: OCR.space
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
        console.error('❌ OCR.space falló:', error);
      }
    }

    // Intento 3: Tesseract
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
      descriptions: [],
      text: '',
      confidence: 0,
      method: 'none',
      error: 'No se pudo detectar el precio con ningún método'
    };
  }

  async tryGoogleVision(imageData) {
    const ocrResult = await googleVisionService.recognizePriceOnly(imageData);
    
    // Google Vision ya devuelve los precios parseados
    const allPrices = ocrResult.prices || [];
    const price = allPrices.length > 0 ? allPrices[0] : null;
    
    return {
      price: price,
      allPrices: allPrices,
      productName: ocrResult.productName || '',
      descriptions: ocrResult.descriptions || [],
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      method: 'google-vision'
    };
  }

  async tryTesseract(imageData) {
    await ocrService.initialize();
    const ocrResult = await ocrService.recognizeText(imageData);
    
    // Importar funciones de parser
    const { findMostLikelyPrice, getAllValidPrices } = await import('./priceParser.js');
    const price = findMostLikelyPrice(ocrResult.text);
    const allPrices = getAllValidPrices(ocrResult.text);
    
    return {
      price: price,
      allPrices: allPrices,
      productName: ocrResult.productName || '',
      descriptions: [],
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      method: 'tesseract'
    };
  }

  async tryOCRSpace(imageData) {
    const ocrResult = await ocrSpaceService.recognizeText(imageData);
    
    const { findMostLikelyPrice, getAllValidPrices } = await import('./priceParser.js');
    const price = findMostLikelyPrice(ocrResult.text);
    const allPrices = getAllValidPrices(ocrResult.text);
    
    return {
      price: price,
      allPrices: allPrices,
      productName: ocrResult.productName || '',
      descriptions: [],
      text: ocrResult.text,
      confidence: ocrResult.confidence,
      method: 'ocrspace'
    };
  }

  configure(options = {}) {
    if (options.useGoogleVision !== undefined) {
      this.useGoogleVision = options.useGoogleVision;
    }
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

  getStatus() {
    return {
      googleVision: this.useGoogleVision ? 'enabled' : 'disabled',
      ocrspace: this.useOCRSpace ? 'enabled' : 'disabled',
      tesseract: this.useTesseract ? 'enabled' : 'disabled',
      confidenceThreshold: this.confidenceThreshold
    };
  }
}

export const hybridOCRService = new HybridOCRService();