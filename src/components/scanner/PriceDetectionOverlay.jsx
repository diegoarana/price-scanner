import React from 'react';
import { X, Check } from 'lucide-react';

const PriceDetectionOverlay = ({ price, onAccept, onReject }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 animate-scale-in">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">Precio detectado:</div>
          <div className="text-4xl font-bold text-indigo-600 mb-4">
            ${price.toFixed(2)}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onReject}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={onAccept}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDetectionOverlay;