import { useEffect, useState } from 'react';

export default function usePreventDefaultTouchStart() {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const preventDefaultTouchStart = (e: TouchEvent) => {
      e.preventDefault();
    };
    element?.addEventListener('touchstart', preventDefaultTouchStart);
    return () =>
      element?.removeEventListener('touchstart', preventDefaultTouchStart);
  }, [element]);
  
  return setElement;
}
