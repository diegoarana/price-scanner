import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatTotalAR } from '../../utils/priceFormatter';

const SessionCard = ({ session, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar esta compra?')) {
      onDelete();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {session.name}
          </h2>
          <div className="flex">
            <div className="flex-1 text-lg font-bold text-indigo-600 mr-1">
              ${formatTotalAR(session.total)}
            </div>
            <div className="flex justify-end text-sm text-gray-600 mt-1">
                {" | "}{session.itemCount} producto{session.itemCount !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(session.date)}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Ocultar detalles
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Ver detalles
          </>
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          {session.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">{item.name} | {item.quantity > 1 ? `${item.price} X ${item.quantity}` : 'X 1'}</span>
              <span className="text-sm font-medium text-gray-800">
                ${item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionCard;