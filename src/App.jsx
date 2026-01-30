import React, { useState, useEffect } from 'react';
import { ShoppingProvider, useShoppingContext } from './context/ShoppingContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import InstallPWAButton from './components/layout/InstallPWAButton';
import AppVersion from './components/layout/AppVersion';
import CameraView from './components/scanner/CameraView';
import ManualPriceInput from './components/scanner/ManualPriceInput';
import CurrentItemsList from './components/scanner/CurrentItemsList';
import HistoryView from './components/history/HistoryView';

const AppContent = () => {
  const [activeView, setActiveView] = useState('scanner');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const { addItem } = useShoppingContext();

  // Manejar el evento de instalación PWA
  useEffect(() => {
    // Verificar si ya está instalada
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isInstalled) {
      console.log('App ya instalada');
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log('PWA lista para instalar');
    };

    const handleAppInstalled = () => {
      console.log('App instalada exitosamente');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Instalación: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handlePriceDetected = (price, quantity, productName = '') => {
    addItem(price, quantity, productName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header 
        onInstallClick={handleInstallClick} 
        showInstallButton={showInstallButton}
      />
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
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

      {/* Banner de instalación flotante */}
      <InstallPWAButton />
      
      {/* Versión de la app */}
      <AppVersion />
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