import React, { useState } from 'react';
import { ShoppingProvider, useShoppingContext } from './context/ShoppingContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import CameraView from './components/scanner/CameraView';
import ManualPriceInput from './components/scanner/ManualPriceInput';
import CurrentItemsList from './components/scanner/CurrentItemsList';
import HistoryView from './components/history/HistoryView';

const AppContent = () => {
  const [activeView, setActiveView] = useState('scanner');
  const { addItem } = useShoppingContext();

  const handlePriceDetected = (price) => {
    addItem(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeView === 'scanner' ? (
          <div className="space-y-4">
            <CameraView onPriceDetected={handlePriceDetected} />
            <ManualPriceInput onAddPrice={handlePriceDetected} />
            <CurrentItemsList />
          </div>
        ) : (
          <HistoryView />
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ShoppingProvider>
      <AppContent />
    </ShoppingProvider>
  );
};

export default App;