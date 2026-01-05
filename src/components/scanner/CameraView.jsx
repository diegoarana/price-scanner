import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle, Settings } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { hybridOCRService } from '../../services/hybridOCRService';
import PriceDetectionOverlay from './PriceDetectionOverlay';
import MultiplePricesSelector from './MultiplePricesSelector';

const CameraView = ({ onPriceDetected }) => {
  const { videoRef, isActive, error, startCamera, stopCamera, captureFrame } = useCamera();
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedPrice, setDetectedPrice] = useState(null);
  const [multiplePrices, setMultiplePrices] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [ocrError, setOcrError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [ocrMethod, setOcrMethod] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = async () => {
    setIsProcessing(true);
    setOcrError(null);
    setDebugInfo('Iniciando...');
    setOcrMethod('');
    
    try {
      setDebugInfo('Capturando imagen...');
      const imageData = captureFrame();
      if (!imageData) {
        throw new Error('No se pudo capturar la imagen');
      }
      console.log('✓ Imagen capturada');

      // SIN preprocesamiento - enviar imagen original
      setDebugInfo('Analizando precio...');
      const result = await hybridOCRService.recognizePrice(imageData);
      
      console.log('Resultado OCR:', result);
      setOcrMethod(result.method);
      
      if (result.allPrices && result.allPrices.length > 1) {
        // Múltiples precios detectados - mostrar selector
        console.log('✓ Múltiples precios detectados:', result.allPrices);
        setMultiplePrices({
          prices: result.allPrices,
          method: result.method,
          descriptions: result.descriptions || [],
          productName: result.productName || ''
        });
        setDebugInfo('');
      } else if (result.price) {
        // Un solo precio detectado
        console.log('✓ Precio detectado:', result.price);
        console.log('✓ Producto:', result.productName);
        setDetectedPrice({
          price: result.price,
          productName: result.productName || ''
        });
        setDebugInfo('');
      } else {
        const message = result.text 
          ? `No se detectó precio válido.\n\nTexto reconocido: "${result.text}"\n\nMétodo: ${result.method}\nConfianza: ${result.confidence}%`
          : `No se reconoció ningún texto.\n\nMétodo usado: ${result.method}\n\n${result.error || 'Intenta mejorar la iluminación o acercar más la cámara.'}`;
        
        setOcrError(message);
        console.log('✗ No se detectó precio');
      }
    } catch (err) {
      console.error('Error al procesar imagen:', err);
      setOcrError(err.message || 'Error desconocido');
    } finally {
      setIsProcessing(false);
      setDebugInfo('');
    }
  };

  const handleAcceptPrice = () => {
    if (detectedPrice && onPriceDetected) {
      onPriceDetected(detectedPrice.price, detectedPrice.productName);
      setDetectedPrice(null);
      setProcessedImage(null);
      setOcrMethod('');
    }
  };

  const handleRejectPrice = () => {
    setDetectedPrice(null);
    setProcessedImage(null);
    setOcrMethod('');
  };

  const handleSelectMultiplePrice = (selectedPrice) => {
    if (onPriceDetected && multiplePrices) {
      onPriceDetected(selectedPrice, multiplePrices.productName || '');
      setMultiplePrices(null);
      setProcessedImage(null);
      setOcrMethod('');
    }
  };

  const handleCancelMultiplePrice = () => {
    setMultiplePrices(null);
    setProcessedImage(null);
    setOcrMethod('');
  };

  const handleCloseError = () => {
    setOcrError(null);
    setProcessedImage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative bg-gray-900 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Guía visual */}
        {isActive && !detectedPrice && !multiplePrices && !isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-4 border-indigo-500 rounded-lg w-3/4 h-1/3 opacity-50">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm bg-black bg-opacity-70 px-3 py-1 rounded">
                📱 Centra el precio aquí
              </div>
            </div>
          </div>
        )}
        
        {/* Loading overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mb-4"></div>
            <p className="text-white text-lg font-medium">{debugInfo || 'Procesando...'}</p>
            <p className="text-white text-sm mt-2 opacity-75">Usando los mejores métodos de OCR...</p>
          </div>
        )}
        
        {!isActive && !error && (
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
              <AlertCircle className="w-12 h-12 mx-auto mb-3" />
              <p className="font-semibold mb-2">Error al acceder a la cámara</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={startCamera}
                className="mt-4 bg-white text-red-900 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Selector de precio único */}
        {detectedPrice && (
          <PriceDetectionOverlay
            price={detectedPrice.price}
            productName={detectedPrice.productName}
            onAccept={handleAcceptPrice}
            onReject={handleRejectPrice}
            method={ocrMethod}
          />
        )}

        {/* Selector de múltiples precios */}
        {multiplePrices && (
          <MultiplePricesSelector
            prices={multiplePrices.prices}
            productName={multiplePrices.productName}
            method={multiplePrices.method}
            onSelect={handleSelectMultiplePrice}
            onCancel={handleCancelMultiplePrice}
          />
        )}

        {/* Error overlay */}
        {ocrError && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">No se detectó el precio</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{ocrError}</p>
                </div>
              </div>
              <button
                onClick={handleCloseError}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>

      {isActive && (
        <div className="p-4 space-y-2">
          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Procesando...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Escanear Precio
              </>
            )}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={stopCamera}
              disabled={isProcessing}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Detener Cámara
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              title="Configuración OCR"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {/* Settings panel */}
          {showSettings && (
            <OCRSettings onClose={() => setShowSettings(false)} />
          )}
          
          {/* Debug */}
          {processedImage && !isProcessing && (
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">
                🔍 Ver imagen procesada {ocrMethod && `(método: ${ocrMethod})`}
              </summary>
              <img src={processedImage} alt="Procesada" className="mt-2 w-full border rounded" />
            </details>
          )}
        </div>
      )}

      {/* Tips */}
      {isActive && !isProcessing && !ocrError && !showSettings && (
        <div className="px-4 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 Tips para mejor detección:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Centra el precio en el recuadro azul</li>
              <li>Mantén la cámara estable</li>
              <li>Asegura buena iluminación sin reflejos</li>
              <li>Si detecta varios precios, podrás elegir el correcto</li>
              <li>Usando: Google Vision → OCR.space → Tesseract</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de configuración OCR
const OCRSettings = ({ onClose }) => {
  const [settings, setSettings] = React.useState(hybridOCRService.getStatus());

  const handleToggle = (service) => { 
    const newSettings = { ...settings };
    const key = service.toLowerCase();
    
    if (key === 'googlevision') {
      newSettings.googleVision = newSettings.googleVision === 'enabled' ? 'disabled' : 'enabled';
      hybridOCRService.configure({ useGoogleVision: newSettings.googleVision === 'enabled' });
    } else if (key === 'tesseract') {
      newSettings.tesseract = newSettings.tesseract === 'enabled' ? 'disabled' : 'enabled';
      hybridOCRService.configure({ useTesseract: newSettings.tesseract === 'enabled' });
    } else if (key === 'ocrspace') {
      newSettings.ocrspace = newSettings.ocrspace === 'enabled' ? 'disabled' : 'enabled';
      hybridOCRService.configure({ useOCRSpace: newSettings.ocrspace === 'enabled' });
    }
    
    setSettings(newSettings);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800">⚙️ Configuración OCR</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      
      <div className="space-y-2">
        <ToggleItem
          label="Google Cloud Vision"
          description="Más preciso (requiere backend)"
          enabled={settings.googleVision === 'enabled'}
          onToggle={() => handleToggle('googleVision')}
        />
        <ToggleItem
          label="OCR.space"
          description="Rápido (25K/mes gratis)"
          enabled={settings.ocrspace === 'enabled'}
          onToggle={() => handleToggle('ocrspace')}
        />
        <ToggleItem
          label="Tesseract"
          description="Offline (siempre disponible)"
          enabled={settings.tesseract === 'enabled'}
          onToggle={() => handleToggle('tesseract')}
        />
      </div>
      
      <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
        💡 Google Vision (mejor) → OCR.space → Tesseract. Se usa el primero disponible.
      </div>
    </div>
  );
};

const ToggleItem = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-800">{label}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-indigo-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default CameraView;