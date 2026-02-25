import { useState, useEffect } from 'react';

const usePlatform = () => {
  const [platform, setPlatform] = useState({
    isAndroid: false,
    isDesktop: false,
    current: 'loading'
  });

  useEffect(() => {
    const ua = navigator.userAgent;

    // Expresión regular para detectar Android
    const isAndroid = /Android/i.test(ua);
    
    // Si no es un dispositivo móvil común, asumimos que es Desktop
    // (Puedes refinar esto detectando iOS también si lo necesitas)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isDesktop = !isMobile;

    setPlatform({
      isAndroid,
      isDesktop,
      current: isAndroid ? 'android' : (isDesktop ? 'desktop' : 'other-mobile')
    });
  }, []);

  return platform;
};

export default usePlatform;