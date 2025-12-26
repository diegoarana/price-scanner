import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error al acceder a la cámara:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsActive(false);
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isActive) return null;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.95);
  }, [isActive]);

  const captureBlob = useCallback(() => {
    if (!videoRef.current || !isActive) return null;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
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