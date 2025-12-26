import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { ocrService } from '../../services/ocrService';
import { findMostLikelyPrice } from '../../services/priceParser';
import PriceDetectionOverlay from './PriceDetectionOverlay';

const CameraView = ({ onPriceDetected }) => {
  const { videoRef, isActive, error, startCamera, stopCamera, captureFrame } = useCamera();
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedPrice, setDetectedPrice] = useState(null);

  const handleCapture = async () => {
    setIsProcessing(true);
    
    try {
      const imageData = captureFrame();
      if (!imageData) {
        throw new Error('No se pudo capturar la imagen');
      }

      // Inicializar OCR si es necesario
      await ocrService.initialize();
      
      // Reconocer texto
      const text = await ocrService.recognizeText(imageData);
      console.log('Texto reconocido:', text);
      
      // Extraer precio
      const price = findMostLikelyPrice(text);
      
      if (price) {
        setDetectedPrice(price);
      } else {
        alert('No se detectó ningún precio. Intenta de nuevo o ingresa manualmente.');
      }
    } catch (err) {
      console.error('Error al procesar imagen:', err);
      alert('Error al procesar la imagen: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptPrice = () => {
    if (detectedPrice && onPriceDetected) {
      onPriceDetected(detectedPrice);
      setDetectedPrice(null);
    }
  };

  const handleRejectPrice = () => {
    setDetectedPrice(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative bg-gray-900 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <button
              onClick={startCamera}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Activar Cámara
            </button>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-90">
            <div className="text-white text-center px-4">
              <p className="font-semibold mb-2">Error al acceder a la cámara</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {detectedPrice && (
          <PriceDetectionOverlay
            price={detectedPrice}
            onAccept={handleAcceptPrice}
            onReject={handleRejectPrice}
          />
        )}
      </div>

      {isActive && (
        <div className="p-4 space-y-2">
          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Procesando...' : 'Escanear Precio'}
          </button>
          <button
            onClick={stopCamera}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Detener Cámara
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraView;