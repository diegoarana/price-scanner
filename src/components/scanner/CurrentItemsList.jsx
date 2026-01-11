import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useShoppingContext } from '../../context/ShoppingContext';

const CurrentItemsList = () => {
  const { currentItems, removeItem, finishShopping } = useShoppingContext();

  const [isFinishOpen, setFinishOpen] = useState(false)
  const [shoppingListName, setShoppingListName] = useState('');

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

  const saveShoppingList = (name) => {
    const success = finishShopping(name);
    if (success) {
      alert('¡Compra guardada en el historial!');
    }
  }

  const handleFinish = () => {
    setFinishOpen(true);
  };

  const handleOnCancel = () => {
    setShoppingListName('');
    setFinishOpen(false);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      { !isFinishOpen ? (
            <>
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
            </>
        ) : 
        (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Nombre de la lista de compras
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Ingrese nombre del supermercado"
                value={shoppingListName}
                onChange={(e) => setShoppingListName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleOnCancel}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => saveShoppingList(shoppingListName)}
                  disabled={!shoppingListName || shoppingListName === ''}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )
        }
    </div>
  );
};

export default CurrentItemsList;