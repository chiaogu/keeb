import { useEffect, useState } from 'react';

export function useViewport() {
  const [width, setWidth] = useState(innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(innerWidth);
    addEventListener('resize', handleResize);
    return () => removeEventListener('resize', handleResize);
  }, []);
  
  return { width };
}
