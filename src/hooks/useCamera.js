import { useState, useRef, useCallback, useEffect } from 'react';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Limpiar stream cuando el componente se desmonta
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Si ya hay un stream activo, detenerlo primero
      if (streamRef.current) {
        stopCamera();
        // Esperar un momento antes de reiniciar
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('Solicitando acceso a la cámara...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Cámara trasera en móviles
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false // No necesitamos audio
      });
      
      console.log('✓ Acceso a cámara concedido');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Esperar a que el video esté listo
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });
        
        setIsActive(true);
        console.log('✓ Cámara activa');
      }
    } catch (err) {
      console.error('✗ Error al acceder a la cámara:', err);
      let errorMessage = 'No se pudo acceder a la cámara';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración de tu navegador.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No se encontró ninguna cámara en tu dispositivo.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'La cámara está siendo usada por otra aplicación.';
      }
      
      setError(errorMessage);
      setIsActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Deteniendo cámara...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track detenido:', track.kind);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    console.log('✓ Cámara detenida');
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isActive) {
      console.warn('No se puede capturar: cámara no activa');
      return null;
    }

    try {
      const video = videoRef.current;
      
      // Verificar que el video tenga dimensiones válidas
      if (!video.videoWidth || !video.videoHeight) {
        console.warn('Video sin dimensiones válidas');
        return null;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      console.log('✓ Frame capturado:', canvas.width, 'x', canvas.height);
      
      return dataUrl;
    } catch (err) {
      console.error('Error al capturar frame:', err);
      return null;
    }
  }, [isActive]);

  const captureBlob = useCallback(() => {
    if (!videoRef.current || !isActive) return null;

    return new Promise((resolve) => {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      } catch (err) {
        console.error('Error al capturar blob:', err);
        resolve(null);
      }
    });
  }, [isActive]);

  return {
    videoRef,
    isActive,
    error,
    startCamera,
    stopCamera,
    captureFrame,
    captureBlob
  };
};