import React from 'react';
import { History } from 'lucide-react';

const EmptyHistoryState = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p className="text-lg font-medium">No hay compras registradas aún</p>
      <p className="text-sm mt-2">
        Realiza tu primera compra para verla aquí
      </p>
    </div>
  );
};

export default EmptyHistoryState;