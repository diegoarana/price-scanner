import React from 'react';
import { Camera, History } from 'lucide-react';

const Navigation = ({ activeView, onViewChange }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 mt-4">
      <div className="flex gap-2 bg-white rounded-lg p-1 shadow">
        <button
          onClick={() => onViewChange('scanner')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
            activeView === 'scanner' 
              ? 'bg-indigo-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Camera className="w-5 h-5" />
          Escáner
        </button>
        <button
          onClick={() => onViewChange('history')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
            activeView === 'history' 
              ? 'bg-indigo-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <History className="w-5 h-5" />
          Historial
        </button>
      </div>
    </div>
  );
};

export default Navigation;