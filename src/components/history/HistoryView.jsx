import React from 'react';
import { useShoppingContext } from '../../context/ShoppingContext';
import SessionCard from './SessionCard';
import EmptyHistoryState from './EmptyHistoryState';

const HistoryView = () => {
  const { scanHistory, deleteSession } = useShoppingContext();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Historial de Compras
        </h2>
        
        {scanHistory.length === 0 ? (
          <EmptyHistoryState />
        ) : (
          <div className="space-y-3">
            {scanHistory.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={() => deleteSession(session.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;