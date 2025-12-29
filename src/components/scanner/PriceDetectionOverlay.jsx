import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';

const PriceDetectionOverlay = ({ price, onAccept, onReject, method }) => {
  const getMethodInfo = (methodName) => {
    const methods = {
      'ocrspace': { name: 'OCR.space', icon: '🌐', color: 'text-blue-600' },
      'tesseract': { name: 'Tesseract', icon: '📖', color: 'text-purple-600' },
    };
    return methods[methodName] || { name: 'OCR', icon: '🔍', color: 'text-gray-600' };
  };

  const methodInfo = getMethodInfo(method);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 animate-scale-in shadow-2xl">
        <div className="text-center">
          {/* Badge del método usado */}
          {method && (
            <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs mb-3">
              <span>{methodInfo.icon}</span>
              <span className={`font-medium ${methodInfo.color}`}>
                {methodInfo.name}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div className="text-sm text-gray-600">Precio detectado:</div>
          </div>
          
          <div className="text-5xl font-bold text-indigo-600 mb-4">
            ${price.toFixed(2)}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onReject}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <button
              onClick={onAccept}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-md"
            >
              <Check className="w-5 h-5" />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDetectionOverlay;