import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevenir el mini-infobar automático en móviles
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e);
      // Mostrar nuestro botón personalizado
      setShowInstallPrompt(true);
      console.log('PWA instalable detectada');
    };

    // Escuchar cuando la app es instalada
    const handleAppInstalled = () => {
      console.log('PWA instalada exitosamente');
      setShowInstallPrompt(false);
      setIsInstalled(true);
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
    if (!deferredPrompt) {
      console.log('No hay prompt disponible');
      return;
    }

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Usuario respondió: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
    } else {
      console.log('Usuario rechazó la instalación');
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Recordar que el usuario cerró el banner (opcional)
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // No mostrar nada si ya está instalada o no hay prompt
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <>
      {/* Banner flotante */}
      <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-2xl p-4 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-2 flex-shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1">Instalar aplicación</h3>
              <p className="text-sm text-white text-opacity-90 mb-3">
                Instala la app en tu dispositivo para acceder rápido y usar sin conexión.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Instalar
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  Ahora no
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Botón fijo en el header (alternativa) */}
      {/* <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Instalar App</span>
      </button> */}
    </>
  );
};

export default InstallPWAButton;