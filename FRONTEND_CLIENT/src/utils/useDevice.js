import { useState, useEffect } from 'react';

export const useDevice = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Typically desktop is >= 1024px
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobileOrTablet };
};
