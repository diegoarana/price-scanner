import React from 'react';
import { ShoppingCart, Download } from 'lucide-react';
import { useShoppingContext } from '../../context/ShoppingContext';

const Header = ({ onInstallClick, showInstallButton }) => {
  const { currentTotal, currentItems } = useShoppingContext();

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              <ShoppingCart className="w-7 h-7" />
              Escáner de Precios
            </h1>
            <div className="mt-2 text-3xl font-bold text-gray-800">
              ${currentTotal}
            </div>
            <div className="text-sm text-gray-500">
              {currentItems.length} producto{currentItems.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Botón de instalación en el header */}
          {showInstallButton && onInstallClick && (
            <button
              onClick={onInstallClick}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Instalar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;