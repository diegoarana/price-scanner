import React, { useState } from 'react';
import { Check, X, DollarSign } from 'lucide-react';

const MultiplePricesSelector = ({ prices, productName, onSelect, onCancel, method }) => {
  const [selectedPrice, setSelectedPrice] = useState(null);

  const handleConfirm = () => {
    if (selectedPrice !== null) {
      onSelect(selectedPrice);
    }
  };

  const getMethodInfo = (methodName) => {
    const methods = {
      'google-vision': { name: 'Google Vision', icon: '☁️', color: 'text-green-600' },
      'ocrspace': { name: 'OCR.space', icon: '🌐', color: 'text-blue-600' },
      'tesseract': { name: 'Tesseract', icon: '📖', color: 'text-purple-600' },
    };
    return methods[methodName] || { name: 'OCR', icon: '🔍', color: 'text-gray-600' };
  };

  const methodInfo = getMethodInfo(method);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 animate-scale-in shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800">
              Múltiples precios detectados
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Badge del método usado */}
          {method && (
            <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs">
              <span>{methodInfo.icon}</span>
              <span className={`font-medium ${methodInfo.color}`}>
                {methodInfo.name}
              </span>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mt-3">
            {productName && (
              <span className="italic block mb-2">"{productName}"</span>
            )}
            Selecciona el precio correcto:
          </p>
        </div>

        {/* Lista de precios */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {prices.length > 3 && (
            <div className="text-xs text-center text-gray-500 mb-2">
              📊 {prices.length} precios detectados
            </div>
          )}
          {prices.map((price, index) => {
            const isHighest = price === Math.max(...prices) && prices.length > 1;
            const isLowest = price === Math.min(...prices) && prices.length > 1;
            const isMostCommon = prices.filter(p => p === price).length > 1;
            
            return (
              <button
                key={index}
                onClick={() => setSelectedPrice(price)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPrice === price
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                      selectedPrice === price
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedPrice === price && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-gray-800">
                        ${price}
                      </div>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {isHighest && (
                          <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            ⬆️ Más alto
                          </div>
                        )}
                        {isLowest && (
                          <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            ⬇️ Más bajo
                          </div>
                        )}
                        {isMostCommon && (
                          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            🔁 Repetido
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <DollarSign className={`w-6 h-6 flex-shrink-0 ml-2 ${
                    selectedPrice === price ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer con acciones */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <X className="w-5 h-5" />
              Ninguno
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedPrice === null}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              Confirmar
            </button>
          </div>
          
          {selectedPrice !== null ? (
            <div className="text-center text-sm text-gray-600">
              Agregarás <strong className="text-indigo-600">${selectedPrice}</strong> al total
            </div>
          ) : (
            <div className="text-center text-xs text-gray-500">
              Selecciona un precio o usa el botón "Ninguno" para escanear de nuevo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiplePricesSelector;