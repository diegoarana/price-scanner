import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const ManualPriceInput = ({ onAddPrice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    const numPrice = parseFloat(price);
    if (numPrice > 0) {
      onAddPrice(numPrice);
      setPrice('');
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 text-indigo-600 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar precio manualmente
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="number"
            step="0.01"
            placeholder="Ingrese el precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setPrice('');
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!price || parseFloat(price) <= 0}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualPriceInput;