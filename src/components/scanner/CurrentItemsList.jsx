import React from 'react';
import { Trash2 } from 'lucide-react';
import { useShoppingContext } from '../../context/ShoppingContext';

const CurrentItemsList = () => {
  const { currentItems, removeItem, finishShopping } = useShoppingContext();

  if (currentItems.length === 0) {
    return null;
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const handleFinish = () => {
    const success = finishShopping();
    if (success) {
      alert('¡Compra guardada en el historial!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3">
        Productos actuales ({currentItems.length})
      </h3>
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {currentItems.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-500">{formatDate(item.timestamp)}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-bold text-indigo-600">
                ${item.price}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleFinish}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Finalizar Compra
      </button>
    </div>
  );
};

export default CurrentItemsList;