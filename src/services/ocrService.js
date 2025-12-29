import Tesseract from 'tesseract.js';

class OCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
    this.isProcessing = false;
  }

  async initialize() {
    if (this.isInitialized && this.worker) {
      console.log('OCR ya inicializado');
      return;
    }

    // Si ya está inicializando, esperar
    if (this.isProcessing) {
      console.log('OCR ya está inicializando, esperando...');
      await this.waitForInit();
      return;
    }

    this.isProcessing = true;

    try {
      console.log('Inicializando Tesseract...');
      
      // Terminar worker anterior si existe
      if (this.worker) {
        try {
          await this.worker.terminate();
        } catch (e) {
          console.warn('Error al terminar worker anterior:', e);
        }
        this.worker = null;
      }

      // Crear nuevo worker
      this.worker = await Tesseract.createWorker('spa', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR: ${Math.round(m.progress * 100)}%`);
          }
        },
        errorHandler: (err) => {
          console.error('Error en Tesseract:', err);
        }
      });

      // Configurar para reconocer mejor números y símbolos de precios
      await this.worker.setParameters({
        tessedit_char_whitelist: '0123456789$.,', // Solo números, $, punto y coma
        tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT, // Texto disperso
        preserve_interword_spaces: '0',
      });

      this.isInitialized = true;
      this.isProcessing = false;
      console.log('✓ OCR inicializado correctamente');
    } catch (error) {
      this.isProcessing = false;
      this.isInitialized = false;
      console.error('✗ Error al inicializar OCR:', error);
      throw new Error('No se pudo inicializar el OCR: ' + error.message);
    }
  }

  async waitForInit(maxWait = 10000) {
    const startTime = Date.now();
    while (this.isProcessing && !this.isInitialized) {
      if (Date.now() - startTime > maxWait) {
        throw new Error('Timeout esperando inicialización del OCR');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async recognizeText(imageData) {
    if (!this.isInitialized || !this.worker) {
      await this.initialize();
    }

    if (!this.worker) {
      throw new Error('Worker no disponible');
    }

    try {
      console.log('Iniciando reconocimiento...');
      const { data } = await this.worker.recognize(imageData);
      
      console.log('Texto OCR raw:', data.text);
      console.log('Confianza:', data.confidence);
      
      return {
        text: data.text.trim(),
        confidence: data.confidence || 0
      };
    } catch (error) {
      console.error('✗ Error en reconocimiento OCR:', error);
      
      // Si falla, intentar reinicializar
      this.isInitialized = false;
      throw new Error('Error al escanear: ' + error.message);
    }
  }

  async terminate() {
    if (this.worker) {
      try {
        console.log('Terminando worker...');
        await this.worker.terminate();
        this.worker = null;
        this.isInitialized = false;
        this.isProcessing = false;
        console.log('✓ Worker terminado');
      } catch (error) {
        console.error('Error al terminar worker:', error);
      }
    }
  }

  // Método para reiniciar completamente el OCR
  async restart() {
    console.log('Reiniciando OCR...');
    await this.terminate();
    await this.initialize();
  }
}

// Singleton instance
export const ocrService = new OCRService();

// Limpiar al cerrar la página
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ocrService.terminate();
  });
}