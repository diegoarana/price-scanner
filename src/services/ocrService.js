import { createWorker } from 'tesseract.js';

class OCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.worker = await createWorker('spa', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`Progreso OCR: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Error al inicializar OCR:', error);
      throw error;
    }
  }

  async recognizeText(imageData) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const { data } = await this.worker.recognize(imageData);
      return data.text;
    } catch (error) {
      console.error('Error en reconocimiento OCR:', error);
      throw error;
    }
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

// Singleton instance
export const ocrService = new OCRService();