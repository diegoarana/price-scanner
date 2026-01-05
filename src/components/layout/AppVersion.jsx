import React from 'react';

const AppVersion = () => {
  // Obtener versión desde variable de entorno o usar valor por defecto
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
  
  return (
    <div className="fixed bottom-2 left-0 right-0 text-center">
      <p className="text-xs text-gray-400">
        v{version}
      </p>
    </div>
  );
};

export default AppVersion;