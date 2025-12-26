import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useShoppingContext } from '../../context/ShoppingContext';

const Header = () => {
  const { currentTotal, currentItems } = useShoppingContext();

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <ShoppingCart className="w-7 h-7" />
          Escáner de Precios
        </h1>
        <div className="mt-2 text-3xl font-bold text-gray-800">
          ${currentTotal.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">
          {currentItems.length} producto{currentItems.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default Header;